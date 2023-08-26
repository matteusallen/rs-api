// @flow
import { Order, Reservation, User, Event, ProductQuestionAnswer } from 'Models';
import { Op } from 'sequelize';
import { formatDate, formatPhoneNumber, reportHelpers } from 'Utils';
import { RV_PRODUCT_X_REF_TYPE_ID } from 'Constants';
import { em } from '../../../utils/processReport';

async function getReportData(eventId: number): Promise<any> {
  try {
    const reportData = [];
    const questionColumns = new Set();

    const orders = await Order.findAll({
      where: { eventId, canceled: null },
      attributes: ['id', 'userId', 'createdAt', 'notes'],
      include: [
        {
          association: 'orderItems',
          attributes: ['id', 'xProductId', 'quantity'],
          include: []
        }
      ]
    });

    for (const order of orders) {
      const lots = new Set();
      const assignments = new Set();
      let startDate,
        endDate,
        answers = {},
        notes = order.dataValues.notes;

      for (const orderItem of order.orderItems) {
        if (!orderItem.addOnProduct && orderItem.quantity > 0) {
          const reservation = await Reservation.findOne({
            attributes: ['endDate', 'startDate'],
            where: { id: orderItem.xProductId, xRefTypeId: RV_PRODUCT_X_REF_TYPE_ID },
            include: [
              {
                association: 'reservationSpaces',
                attributes: ['id'],
                include: [
                  {
                    association: 'rvSpot',
                    attributes: ['name'],
                    include: [
                      {
                        association: 'rvLot',
                        attributes: ['name']
                      }
                    ]
                  }
                ]
              }
            ]
          });

          if (!reservation) continue; //exclude Stalls

          startDate = reservation.startDate;
          endDate = reservation.endDate;

          reservation.reservationSpaces.forEach(reservationSpace => {
            lots.add(reservationSpace.rvSpot.rvLot.name);
          });

          reservation.reservationSpaces.forEach(reservationSpace => {
            assignments.add(reservationSpace.rvSpot.name);
          });
        }
      }

      const productAnswers = await ProductQuestionAnswer.findAll({
        attributes: ['answer', 'questionId'],
        where: { orderId: order.id },
        include: [
          {
            association: 'productQuestion',
            attributes: ['question', 'id'],
            where: { productXRefType: RV_PRODUCT_X_REF_TYPE_ID }
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
        lots: [...lots].join(', ') || '-',
        assignments: [...assignments].join(', ') || '-',
        answers,
        notes
      };

      if (startDate) reportData.push(data);
    }
    reportData.sort((a, b) => (!!a && !!b ? a.renterName.localeCompare(b.renterName, 'en', { numeric: true }) : 0));

    const worksheetData = [];

    for (const data of reportData) {
      const questionAnswersData = [];
      let specialReqs = '-';

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

      delete data.answers;
      delete data.notes;
      worksheetData.push(Object.values(data).concat(questionAnswersData).concat(specialReqs)); //merge addon cell data with other column data
    }

    worksheetData.push(['divider-top']); //last row border

    return [
      worksheetData,
      ['Renter name', 'Trans date & Time', 'Phone number', 'Start date', 'End date', 'RV Lot', 'Assignment', ...questionColumns, 'Special Requests']
    ];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw error;
  }
}

async function getRVReport(eventIds: [], request?: any = {}): Promise<any> {
  try {
    const events = await Event.findAll({
        where: { id: { [Op.in]: eventIds } },
        attributes: ['id', 'name']
      }),
      multiEvents = events.length > 1 ? true : false;

    const workbookData = [];
    let data = [],
      headerLabels = [];

    for (const event of events) {
      [data, headerLabels] = await getReportData(event.id);
      workbookData.push({
        data,
        headerLabels: [headerLabels],
        title: event.name,
        sheetName: multiEvents ? event.name : 'RV Report'
      });
    }

    //check if number of rows is greater than MAX_ROWS_FOR_DOWNLOAD
    if (data.length >= Number(process.env.MAX_ROWS_FOR_DOWNLOAD) && request) {
      const { userId } = request.body;
      const user = await User.getUser({ id: userId });
      em.emit('processReport', request, user.payload);
      return [undefined, true];
    }

    const workbook = await reportHelpers.populateTemplate(workbookData, 'src/assets/rv-report-template.xlsx', 'RV Report', 1, 10, true);

    return [workbook, false];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw error;
  }
}
export default getRVReport;
