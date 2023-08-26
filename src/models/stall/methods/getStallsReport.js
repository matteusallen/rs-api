// @flow
import { Order, Reservation, User, Event, ProductQuestionAnswer } from 'Models';
import { Op } from 'sequelize';
import { formatDate, formatPhoneNumber, reportHelpers } from 'Utils';
import { STALL_PRODUCT_X_REF_TYPE_ID } from 'Constants';
import { em } from '../../../utils/processReport';

async function getReportData(eventId: number): Promise<any> {
  try {
    const reportData = [],
      addOnColumnsSet = [],
      questionColumns = new Set();

    const orders = await Order.findAll({
      where: { eventId, canceled: null },
      attributes: ['id', 'userId', 'createdAt', 'notes'],
      include: [
        {
          association: 'orderItems',
          attributes: ['id', 'xProductId', 'quantity'],
          include: [
            {
              association: 'addOnProduct',
              attributes: ['id'],
              include: [
                {
                  association: 'addOn',
                  attributes: ['id', 'name']
                }
              ]
            }
          ]
        }
      ]
    });

    for (const order of orders) {
      const barnNames = new Set();
      const assgnments = new Set();
      let startDate,
        endDate,
        addOns = {},
        answers = {},
        notes = order.dataValues.notes;

      for (const orderItem of order.orderItems) {
        if (orderItem.quantity > 0) {
          if (!orderItem.addOnProduct) {
            const reservation = await Reservation.findOne({
              attributes: ['endDate', 'startDate'],
              where: { id: orderItem.xProductId, xRefTypeId: STALL_PRODUCT_X_REF_TYPE_ID },
              include: [
                {
                  association: 'reservationSpaces',
                  attributes: ['id'],
                  include: [
                    {
                      association: 'stall',
                      attributes: ['name'],
                      include: [
                        {
                          association: 'building',
                          attributes: ['name']
                        }
                      ]
                    }
                  ]
                }
              ]
            });

            if (!reservation) continue; //exclude RVs

            startDate = reservation.startDate;
            endDate = reservation.endDate;

            reservation.reservationSpaces.forEach(reservationSpace => {
              barnNames.add(reservationSpace.stall.building.name);
            });

            reservation.reservationSpaces.forEach(reservationSpace => {
              assgnments.add(reservationSpace.stall.name);
            });
          } else {
            //only when addon exists
            const addOnName = orderItem.addOnProduct.addOn.name;
            const key = addOnName.split(' ').join('-');
            addOns[key] = orderItem.quantity;
            addOnColumnsSet.push(addOnName);
          }
        }
      }

      const productAnswers = await ProductQuestionAnswer.findAll({
        attributes: ['answer', 'questionId'],
        where: { orderId: order.id },
        include: [
          {
            association: 'productQuestion',
            attributes: ['question', 'id'],
            where: { productXRefType: STALL_PRODUCT_X_REF_TYPE_ID }
          }
        ]
      });

      const { payload } = await User.getUser({ id: order.userId });

      productAnswers.forEach(el => {
        questionColumns.add(el.productQuestion.question);
        answers[el.productQuestion.question] = el.answer.join(', ') || '-';
      });

      const data = {
        renterName: `${(payload.lastName && payload.lastName.toUpperCase()) || ''}, ${(payload.firstName && payload.firstName.toUpperCase()) || ''}`,
        transDate: formatDate.toUsDateTime(order.createdAt),
        phoneNumber: formatPhoneNumber(payload.phone) || '-',
        startDate: (startDate && formatDate.toUsDateWithSlash(startDate)) || '-',
        endDate: (endDate && formatDate.toUsDateWithSlash(endDate)) || '-',
        barnName: [...barnNames].join(', ') || '-',
        assgnments: [...assgnments].join(', ') || '-',
        notes,
        addOns,
        answers
      };

      if (startDate || (data.addOns && Object.keys(data.addOns).length > 0)) reportData.push(data);
    }
    reportData.sort((a, b) => (!!a && !!b ? a.renterName.localeCompare(b.renterName, 'en', { numeric: true }) : 0));

    const worksheetData = [];
    const addOnColumnNames = [...new Set(addOnColumnsSet)];

    for (const data of reportData) {
      const addOnColumnData = [];
      const questionAnswersData = [];
      let specialReqs = '-';

      if (data.addOns) {
        //update addon cell data with qty or -
        addOnColumnNames.forEach(colName => {
          const key = colName.split(' ').join('-') || '-';
          if (data.addOns && data.addOns[key]) {
            addOnColumnData.push(data.addOns[key]);
          } else {
            addOnColumnData.push('-');
          }
        });
      }

      if (data.answers) {
        questionColumns.forEach(colName => {
          if (data.answers && data.answers[colName]) {
            questionAnswersData.push(data.answers[colName]);
          } else {
            questionAnswersData.push('-');
          }
        });
      }

      if (data.notes) specialReqs = data.notes;

      delete data.addOns; //exclude addOns obj
      delete data.answers;
      delete data.notes;
      worksheetData.push(Object.values(data).concat(addOnColumnData).concat(questionAnswersData).concat(specialReqs)); //merge addon cell data with other column data
    }

    worksheetData.push(['divider-top']); //last row border
    return [
      worksheetData,
      [
        'Renter name',
        'Trans date & Time',
        'Phone number',
        'Start date',
        'End date',
        'Barn name',
        'Assignment',
        ...addOnColumnNames,
        ...questionColumns,
        'Special Requests'
      ]
    ];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw error;
  }
}

async function getStallsReport(eventIds: [], request?: any = {}): Promise<any> {
  try {
    const events = await Event.findAll({
      where: { id: { [Op.in]: eventIds } },
      attributes: ['id', 'name']
    });

    const workbookData = [];
    let data = [],
      headerLabels = [];
    for (const event of events) {
      [data, headerLabels] = await getReportData(event.id);
      workbookData.push({
        data,
        headerLabels: [headerLabels],
        title: event.name,
        sheetName: event.name
      });
    }

    //check if number of rows is greater than MAX_ROWS_FOR_DOWNLOAD
    if (data.length >= Number(process.env.MAX_ROWS_FOR_DOWNLOAD) && request) {
      const { userId } = request.body;
      const user = await User.getUser({ id: userId });
      em.emit('processReport', request, user.payload);
      return [undefined, true];
    }

    const workbook = await reportHelpers.populateTemplate(workbookData, 'src/assets/stall-report-template.xlsx', 'Stall Report', 1, 10, true);
    return [workbook, false];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw error;
  }
}
export default getStallsReport;
