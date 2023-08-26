// @flow
import Excel from 'exceljs';
import { Op } from 'sequelize';
import moment from 'moment';

import type { TransactionReportInputType } from '../types';

async function transactionReport(input: TransactionReportInputType): Promise<[{} | void, string | void]> {
  try {
    const { Payment, User, GroupOrder, Event, OrderItem } = this.sequelize.models;
    const { adminId, start, end } = input;

    const payments = await Payment.findAll({
      where: {
        createdAt: { [Op.between]: [start, end] },
        adminId: { [Op.in]: adminId },
        success: true
      },
      include: [
        {
          association: 'order',
          attributes: ['id', 'eventId', 'userId'],
          where: { successor: { [Op.is]: null } }
        }
      ]
    });

    if (!payments || !payments.length) {
      throw new Error('No records found');
    }

    const workbook = new Excel.Workbook();
    workbook.creator = 'Open Stalls';
    workbook.lastModifiedBy = 'Open Stalls';
    workbook.created = new Date();
    workbook.modified = new Date();

    workbook.views = [
      {
        x: 0,
        y: 0,
        width: 30000,
        height: 20000,
        firstSheet: 0,
        activeTab: 1,
        visibility: 'visible'
      }
    ];

    const worksheet = workbook.addWorksheet('Transactions');
    const columns = [
      { header: 'Admin Name', key: 'adminName', width: 16 },
      { header: 'Event Name', key: 'eventName', width: 16 },
      { header: 'Renter Name', key: 'renterName', width: 16 },
      { header: 'Order Id', key: 'orderId', width: 11 },
      { header: 'Date of Transaction', key: 'dateOfTransaction', type: 'date', width: 24 },
      { header: '# of Stalls', key: 'stallQuantity', width: 12 },
      { header: 'Rate Type for Stalls', key: 'stallRateTypeName', width: 22 },
      { header: '# of Nights for Stalls', key: 'stallNightQuantity', width: 23 },
      { header: 'Subtotal for Stalls', key: 'stallSubtotal', width: 21, style: { numFmt: '$##,##0.00' } },
      { header: '# of RV Spots', key: 'rvSpotQuantity', width: 16 },
      { header: 'Rate Type for RV Spots', key: 'rvSpotRateTypeName', width: 26 },
      { header: '# of Nights for RV Spots', key: 'rvSpotNightQuantity', width: 16 },
      { header: 'Subtotal for RV Spots', key: 'rvSpotSubtotal', width: 25, style: { numFmt: '$##,##0.00' } },
      { header: 'Payment Type', key: 'paymentType', width: 17 },
      { header: 'Group Name', key: 'groupName', width: 16 },
      { header: 'Last 4 of Card', key: 'last4', width: 15 },
      {
        header: 'Total Paid',
        key: 'total',
        width: 15,
        style: { numFmt: '$##,##0.00' }
      },
      { header: 'Refund', key: 'isRefund', width: 15 }
    ];

    const dataRows = [];
    for (let i = 0; i < payments.length; i++) {
      const payment = payments[i];
      const { adminId, order } = payment;

      order.groupOrder = await GroupOrder.findOne({
        where: { orderId: order.id },
        attributes: ['id'],
        include: [
          {
            association: 'group',
            attributes: ['id', 'name']
          }
        ]
      });

      order.event = await Event.findOne({
        where: { id: order.eventId },
        attributes: ['id', 'name'],
        include: [
          {
            association: 'venue',
            attributes: ['id', 'timeZone']
          }
        ]
      });

      order.orderItems = await OrderItem.findAll({
        where: { orderId: order.id },
        include: [
          { association: 'addOnProduct', include: [{ association: 'addOn' }] },
          {
            association: 'reservation',
            include: [{ association: 'stallProduct' }, { association: 'rvProduct', include: [{ association: 'rvLot', attributes: ['id', 'name'] }] }]
          }
        ]
      });

      const { orderItems, event, userId, groupOrder } = order;
      const { venue } = event;

      let fullAdmin;
      if (adminId) {
        const adminResponse = await User.getUser({ id: adminId });
        fullAdmin = adminResponse.payload;
      }
      const { payload: fullUser } = await User.getUser({ id: userId });

      const rowData = {
        adminName: fullAdmin ? `${fullAdmin.firstName} ${fullAdmin.lastName}` : null,
        eventName: event.name,
        renterName: `${fullUser.firstName} ${fullUser.lastName}`,
        orderId: order.id,
        dateOfTransaction: new Date(payment.createdAt).toLocaleString('en-US', {
          timeZone: venue.timeZone,
          timeZoneName: 'short'
        }),
        paymentType: payment.cardPayment ? 'card' : 'cash/check',
        last4: payment.cardPayment ? Number(payment.last4) : null,
        groupName: (groupOrder && groupOrder.group && groupOrder.group.name) || '-',
        total: Number(payment.amount.toFixed(2)),
        isRefund: payment.amount < 0,
        stallQuantity: null,
        stallRateTypeName: null,
        stallNightQuantity: null,
        stallSubtotal: null,
        rvSpotQuantity: null,
        rvSpotRateTypeName: null,
        rvSpotNightQuantity: null,
        rvSpotSubtotal: null
      };

      let numberOfUniqueAddOnsPerOrder = 0;
      orderItems.map(orderItem => {
        if (orderItem.xRefTypeId == 2) {
          numberOfUniqueAddOnsPerOrder++;
          const columnExistsForAddOn = columns.filter(column => column.key === `addOnName${numberOfUniqueAddOnsPerOrder}`);
          if (!columnExistsForAddOn.length) {
            const base = 9 + numberOfUniqueAddOnsPerOrder * 4;
            columns.splice(base, 0, {
              header: 'AddOn Name',
              key: `addOnName${numberOfUniqueAddOnsPerOrder}`,
              width: 15
            });
            columns.splice(base + 1, 0, {
              header: 'Quantity of AddOn',
              key: `addOnQuantity${numberOfUniqueAddOnsPerOrder}`,
              width: 22
            });
            columns.splice(base + 2, 0, {
              header: 'Cost Per AddOn',
              key: `addOnCost${numberOfUniqueAddOnsPerOrder}`,
              width: 15
            });
            columns.splice(base + 3, 0, {
              header: 'Subtotal for AddOn',
              key: `addOnSubtotal${numberOfUniqueAddOnsPerOrder}`,
              width: 22,
              style: { numFmt: '$##,##0.00' }
            });
          }
          rowData[`addOnName${numberOfUniqueAddOnsPerOrder}`] = orderItem.addOnProduct.addOn.name;
          rowData[`addOnQuantity${numberOfUniqueAddOnsPerOrder}`] = orderItem.quantity;
          rowData[`addOnCost${numberOfUniqueAddOnsPerOrder}`] = orderItem.quantity ? orderItem.price / orderItem.quantity : 0;
          rowData[`addOnSubtotal${numberOfUniqueAddOnsPerOrder}`] = orderItem.price;
        } else {
          const numberOfNights = moment(orderItem.reservation.endDate).diff(moment(orderItem.reservation.startDate), 'days');
          if (orderItem.reservation.xRefTypeId == 1) {
            rowData.stallQuantity = orderItem.quantity;
            rowData.stallRateTypeName = orderItem.reservation.stallProduct.name;
            rowData.stallNightQuantity = numberOfNights;
            rowData.stallSubtotal = orderItem.price;
          } else {
            rowData.rvSpotQuantity = orderItem.quantity;
            rowData.rvSpotRateTypeName = orderItem.reservation.rvProduct.rvLot.name;
            rowData.rvSpotNightQuantity = numberOfNights;
            rowData.rvSpotSubtotal = orderItem.price;
          }
        }
      });

      dataRows.push(rowData);
    }

    worksheet.columns = columns;
    worksheet.addRows(dataRows);

    worksheet.views = [{ state: 'frozen', ySplit: 1 }];

    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      if (rowNumber === 1) {
        row.height = 30;
      }
      row.eachCell({ includeEmpty: true }, cell => {
        cell.border = {
          bottom: {},
          right: {}
        };
        if (rowNumber === 1) {
          cell.font = {
            bold: true,
            size: 16
          };
          cell.border = {
            bottom: { style: 'medium' },
            right: { style: null }
          };
        }
        if (
          cell._column._key === 'dateOfTransaction' ||
          cell._column._key === 'stallSubtotal' ||
          cell._column._key === 'rvSpotSubtotal' ||
          cell._column._key.includes('addOnSubtotal')
        ) {
          //$FlowFixMe
          cell.border.right.style = 'medium';
        }
        if (row.getCell('isRefund').value === true) {
          cell.font = {
            color: { argb: 'FFFF0000' }
          };
        }
        if (cell.value === null) {
          cell.value = '--';
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFEEEEEE' }
          };
        }
      });
    });

    const summaryWorksheet = workbook.addWorksheet('Summary');
    const [, summaryWorksheetError] = await this.summaryReport({
      worksheet: summaryWorksheet,
      payments,
      start,
      end,
      adminIds: adminId
    });
    if (summaryWorksheetError) throw Error(summaryWorksheetError);

    return [workbook, undefined];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return [undefined, error.message];
  }
}

export default transactionReport;
