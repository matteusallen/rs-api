// @flow
import Excel from 'exceljs';
import { Op } from 'sequelize';
import moment from 'moment-timezone';
import { ADD_ON_PRODUCT_X_REF_TYPE_ID, RESERVATION_X_REF_TYPE_ID } from 'Constants';
import { em } from '../../../utils/processReport';
import { getRvs, getRVProduct, getRVData } from '../../payment/methods/accountingReportHelper';

type AccountingReportInputType = {|
  venueId: string | number,
  userId: string | number,
  venueTimeZone: string,
  eventIds: Array<string | number>,
  end: Date,
  start: Date
|};

async function accountingReport(input: AccountingReportInputType, request?: any = {}): Promise<any> {
  try {
    const { start, end, venueId, eventIds, venueTimeZone, userId } = input;
    const { User, Order, AddOnProduct, Reservation, Payment, OrderHistoryPayments, OrderHistory, RVProduct } = this.sequelize.models;

    let whereClause,
      orderIds,
      payments = [];

    if (eventIds && eventIds.length) {
      //by event
      const eventOrders = await Order.findAll({
        where: { eventId: { [Op.in]: eventIds } },
        attributes: ['id']
      });

      orderIds = eventOrders.map(order => order.id);

      payments = await Payment.findAll({
        where: { orderId: { [Op.in]: orderIds }, cardPayment: true },
        attributes: ['payoutId']
      });

      const payoutIds = payments.map(payment => payment.payoutId);

      whereClause = { id: { [Op.in]: payoutIds } };
    } else if (start && end) {
      //by date
      whereClause = { paidDate: { [Op.between]: [moment(start).tz(venueTimeZone).startOf('day'), moment(end).tz(venueTimeZone).endOf('day')] }, venueId };
    } else throw new Error('Invalid request');

    const payouts = await this.findAll({
      where: whereClause,
      include: [
        {
          association: 'payments',
          attributes: ['id', 'adminId', 'amount', 'createdAt', 'notes', 'ssChargeId', 'ssRefundId', 'cardBrand', 'orderId', 'serviceFee', 'stripeFee'],
          where: { success: true },
          include: eventIds && eventIds.length ? [{ association: 'order', attributes: ['id'], where: { id: { [Op.in]: orderIds } } }] : []
        }
      ],
      order: [['paidDate', 'ASC']]
    });

    if (!payouts || !payouts.length) {
      throw new Error('No records found');
    }

    //if greater than MAX_ROWS_FOR_DOWNLOAD, use background process to complete
    if (payments.length >= Number(process.env.MAX_ROWS_FOR_DOWNLOAD) && request) {
      const user = await User.getUser({ id: userId });
      em.emit('processReport', request, user.payload);
      return [undefined, true, undefined];
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
      { header: 'Payout Date', key: 'payoutDate', width: 16 },
      { header: 'Payout Total', key: 'payoutTotal', width: 16, style: { numFmt: '$##,##0.00' } },
      { header: 'Transaction Date', key: 'transactionDate', width: 24 },
      { header: 'Transaction Total', key: 'transactionTotal', width: 24, style: { numFmt: '$##,##0.00' } },
      { header: 'Transaction Gross', key: 'transactionGross', width: 24, style: { numFmt: '$##,##0.00' } },
      { header: 'Calculated Subtotal', key: 'calculatedSubtotal', width: 26, style: { numFmt: '$##,##0.00' } },
      { header: 'Difference', key: 'difference', width: 16, style: { numFmt: '$##,##0.00' } },
      { header: 'Platform Fee', key: 'platformFee', width: 18, style: { numFmt: '$##,##0.00' } },
      { header: 'Admin', key: 'admin', width: 16 },
      { header: 'Refund Reason / Notes', key: 'refundReason', width: 30 },
      { header: 'Notes', key: 'notes', width: 30 },
      { header: 'Order Id', key: 'orderId', width: 16 },
      { header: 'Payment Type', key: 'paymentType', width: 24 },
      { header: 'Card Brand', key: 'cardBrand', width: 16 },
      { header: 'Original Amount', key: 'originalAmount', width: 24 },
      { header: 'Original Date', key: 'originalDate', width: 24 },
      { header: 'Stripe Name', key: 'stripeName', width: 16 },
      { header: 'Stripe Record', key: 'stripeRecord', width: 18 },
      { header: 'Renter Name', key: 'renterName', width: 18 },
      { header: 'Event Id', key: 'eventId', width: 16 },
      { header: 'Event Name', key: 'eventName', width: 16 },
      { header: 'Event Start Date', key: 'eventStartDate', width: 24 },
      { header: 'Event End Date', key: 'eventEndDate', width: 24 },
      { header: 'Event Nights', key: 'nights', width: 16 },
      { header: 'Stall Rate', key: 'stallRate', width: 16, style: { numFmt: '$##,##0.00' } },
      { header: 'Stall Quantity', key: 'stallQuantity', width: 18 },
      { header: 'Stall Total', key: 'stallTotal', width: 16, style: { numFmt: '$##,##0.00' } },
      { header: 'Rate Type for Stall', key: 'rateTypeForStall', width: 28 },
      { header: 'RV Spot Name', key: 'rvSpotName', width: 18 },
      { header: 'RV Spot Count', key: 'rvSpotCount', width: 18 },
      { header: 'RV Spot Price', key: 'rvSpotPrice', width: 18, style: { numFmt: '$##,##0.00' } },
      { header: 'RV Spot Subtotal', key: 'rvSpotSubtotal', width: 22, style: { numFmt: '$##,##0.00' } },
      { header: 'Multiple charges', key: 'hasMultipleCharges', width: 0 }
    ];

    const newChargesMap = {};
    let lastCharge = {
      rvSpotName: null,
      rvSpotCount: null,
      rvSpotPrice: null,
      rvSpotSubtotal: undefined
    };

    const dataRows = [];
    for (let pi = 0; pi < payouts.length; pi++) {
      const payout = payouts[pi];
      const { payments } = payout;

      // aggregates of all payments per payout columns
      let sumOfPaymentTransactionTotals = 0;
      let sumOfPaymentCalculatedSubtotals = 0;
      let sumOfPaymentTransactionGrossTotals = 0;

      let currentOrderId;

      for (let i = 0; i < payments.length; i++) {
        const payment = payments[i];

        payment.order = await Order.findOne({
          where: { id: payment.orderId },
          attributes: ['id', 'userId', 'fee', 'platformFee'],
          include: [
            {
              association: 'event',
              attributes: ['id', 'name', 'startDate', 'endDate']
            },
            {
              association: 'orderItems',
              attributes: ['xRefTypeId', 'quantity', 'price', 'xProductId']
            }
          ]
        });

        const { id, order, adminId } = payment;
        const { event, userId } = order;

        currentOrderId = order.id;

        // eslint-disable-next-line no-prototype-builtins
        if (!newChargesMap.hasOwnProperty(currentOrderId)) {
          newChargesMap[currentOrderId] = 0;
        }

        let fullAdmin = null;
        if (adminId) {
          const adminResponse = await User.getUser({ id: adminId });
          fullAdmin = adminResponse.payload;
        }
        const { payload: fullUser } = await User.getUser({ id: userId });

        let numberOfNights = moment(event.endDate).diff(moment(event.startDate), 'days');
        const paymentGrossRounded = Math.round(payment.amount * 100) / 100;
        const paymentGrossAmount = Number(paymentGrossRounded.toFixed(2));

        let rowData = {
          payoutDate: moment(payout.paidDate).format('MM/DD/YYYY'),
          payoutTotal: payout.amount / 100,
          transactionGross: paymentGrossAmount,
          transactionDate: moment(payment.createdAt).format('MM/DD/YYYY'),
          admin: fullAdmin ? `${fullAdmin.firstName} ${fullAdmin.lastName}` : null,
          refundReason: payment.notes,
          notes: '',
          orderId: order.id,
          paymentType: payment.ssRefundId ? 'refund' : 'charge',
          cardBrand: payment.cardBrand,
          originalAmount: null,
          originalDate: null,
          stripeName: null,
          stripeRecord: payment.ssRefundId || payment.ssChargeId,
          renterName: `${fullUser.firstName} ${fullUser.lastName}`,
          eventId: event.id,
          eventName: event.name,
          eventStartDate: moment(event.startDate).format('MM/DD/YYYY'),
          eventEndDate: moment(event.endDate).format('MM/DD/YYYY'),
          nights: numberOfNights,
          stallRate: null,
          stallQuantity: null,
          stallTotal: null,
          rateTypeForStall: null,
          rvSpotName: null,
          rvSpotCount: null,
          rvSpotPrice: null,
          rvSpotSubtotal: undefined,
          transactionTotal: undefined,
          calculatedSubtotal: undefined,
          difference: undefined,
          platformFee: undefined,
          hasMultipleCharges: false
        };

        if (rowData.paymentType === 'refund') {
          rowData = { ...rowData, ...lastCharge };
        }

        const rvs = await getRvs(OrderHistoryPayments, OrderHistory, id);

        if (rvs?.xProductId) {
          const rvProduct = await getRVProduct(RVProduct, rvs.xProductId);

          if (rowData.paymentType === 'charge') {
            const rvData = getRVData(rvProduct, rvs);
            rowData = { ...rowData, ...rvData };

            const { rvSpotName, rvSpotCount, rvSpotPrice, rvSpotSubtotal } = rowData;
            lastCharge = { rvSpotName, rvSpotCount, rvSpotPrice, rvSpotSubtotal };
          }

          rowData.rvSpotCount = rvs.quantity;
          // $FlowIgnore
          dataRows.filter(r => r.orderId === order.id).map(r => (r.rvSpotCount = rvs.quantity));
          lastCharge.rvSpotCount = rvs.quantity;
        }

        // handle order items
        const { orderItems } = order;
        let numberOfUniqueAddOnsPerOrder = 0;
        const paymentRefsIds = [];

        for (let oi = 0; oi < orderItems.length; oi++) {
          const orderItem = orderItems[oi];

          paymentRefsIds.push(orderItem.xRefTypeId);

          if (orderItem.xRefTypeId == ADD_ON_PRODUCT_X_REF_TYPE_ID) {
            orderItem.addOnProduct = await AddOnProduct.findOne({
              where: { id: orderItem.xProductId },
              attributes: ['price'],
              include: [{ association: 'addOn', attributes: ['name'] }]
            });
          } else {
            orderItem.reservation = await Reservation.findOne({
              where: { id: orderItem.xProductId },
              attributes: ['xRefTypeId'],
              include: [
                { association: 'stallProduct', attributes: ['price', 'name'] },
                {
                  association: 'rvProduct',
                  attributes: ['price'],
                  include: [{ association: 'rvLot', attributes: ['id', 'name'] }]
                }
              ]
            });
          }

          if (orderItem.xRefTypeId === RESERVATION_X_REF_TYPE_ID) {
            const { stallProduct, rvProduct } = orderItem.reservation;
            if (orderItem.reservation.xRefTypeId === 1) {
              rowData.stallRate = stallProduct.price;
              rowData.stallQuantity = orderItem.quantity;
              rowData.stallTotal = orderItem.price;
              rowData.rateTypeForStall = stallProduct.name;
            } else {
              rowData.rvSpotName = rowData.rvSpotName ?? rvProduct.rvLot.name;
              rowData.rvSpotCount = rowData.rvSpotCount ?? orderItem.quantity;
              rowData.rvSpotPrice = rowData.rvSpotPrice ?? rvProduct.price;
              rowData.rvSpotSubtotal = rowData.rvSpotSubtotal ?? orderItem.price;
            }
          } else {
            const { addOnProduct } = orderItem;
            numberOfUniqueAddOnsPerOrder++;
            const columnExistsForAddOn = columns.filter(column => column.key === `addOnName${numberOfUniqueAddOnsPerOrder}`);
            if (!columnExistsForAddOn.length) {
              const base = 27 + numberOfUniqueAddOnsPerOrder * 4;
              columns.splice(base, 0, {
                header: 'AddOn Name',
                key: `addOnName${numberOfUniqueAddOnsPerOrder}`,
                width: 18
              });
              columns.splice(base + 1, 0, {
                header: 'Quantity of AddOn',
                key: `addOnQuantity${numberOfUniqueAddOnsPerOrder}`,
                width: 26
              });
              columns.splice(base + 2, 0, {
                header: 'Cost Per AddOn',
                key: `addOnCost${numberOfUniqueAddOnsPerOrder}`,
                width: 20
              });
              columns.splice(base + 3, 0, {
                header: 'Subtotal for AddOn',
                key: `addOnSubtotal${numberOfUniqueAddOnsPerOrder}`,
                width: 26,
                style: { numFmt: '$##,##0.00' }
              });
            }

            rowData[`addOnName${numberOfUniqueAddOnsPerOrder}`] = orderItem.addOnProduct.addOn.name;
            rowData[`addOnQuantity${numberOfUniqueAddOnsPerOrder}`] = orderItem.quantity;
            rowData[`addOnCost${numberOfUniqueAddOnsPerOrder}`] = addOnProduct.price;
            rowData[`addOnSubtotal${numberOfUniqueAddOnsPerOrder}`] = orderItem.price;
          }
        }

        const uniquePaymentRefsIds = [...new Set(paymentRefsIds)];
        let paymentTransactionTotal = 0,
          paymentCalculatedSubtotal = 0;
        if (payment.ssRefundId) {
          paymentTransactionTotal = paymentGrossAmount;
          paymentCalculatedSubtotal = paymentGrossAmount;
          rowData.platformFee = 0;
        } else {
          const stripeFeeRounded = Math.round(payment.stripeFee * 100) / 100;
          const stripeFee = Number(stripeFeeRounded.toFixed(2));
          const totalFee = stripeFee + Number(payment.serviceFee.toFixed(2));
          paymentTransactionTotal = paymentGrossAmount - totalFee;
          paymentCalculatedSubtotal = paymentTransactionTotal;
          rowData.platformFee = totalFee;
        }

        if (
          paymentTransactionTotal > 0 &&
          payment.serviceFee === 0 &&
          !(uniquePaymentRefsIds[0] == ADD_ON_PRODUCT_X_REF_TYPE_ID && uniquePaymentRefsIds.length === 1)
        ) {
          newChargesMap[currentOrderId] = newChargesMap[currentOrderId] + 1;
        }

        rowData.transactionTotal = Number(paymentTransactionTotal.toFixed(2));
        rowData.calculatedSubtotal = Number(paymentTransactionTotal.toFixed(2));
        rowData.difference = 0;

        dataRows.push(rowData);

        // calculate payment aggregate amounts for single payout
        sumOfPaymentTransactionTotals += paymentTransactionTotal;
        sumOfPaymentCalculatedSubtotals += paymentCalculatedSubtotal;
        sumOfPaymentTransactionGrossTotals += paymentGrossAmount;
      }

      // add payment aggregates for a single payout to a designated row
      const aggregateRow = {
        transactionTotal: sumOfPaymentTransactionTotals,
        calculatedSubtotal: sumOfPaymentCalculatedSubtotals,
        transactionGross: sumOfPaymentTransactionGrossTotals
      };
      dataRows.push(aggregateRow);
      dataRows.push({
        transactionDate: 'Diff b/w payout and trans total: ',
        transactionTotal: payout.amount / 100 - sumOfPaymentTransactionTotals
      });
      dataRows.push({});
    }

    dataRows.forEach(dataRow => {
      // $FlowIgnore
      const { orderId } = dataRow;
      if (newChargesMap[orderId] > 0) {
        // $FlowIgnore
        dataRow.hasMultipleCharges = true;
        // $FlowIgnore
        dataRow.notes = 'check order for correct product totals.';
      }
    });

    worksheet.columns = columns;
    worksheet.addRows(dataRows);

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
        if (row.getCell('paymentType').value === 'refund') {
          cell.font = {
            color: { argb: 'FFFF0000' }
          };
        }
        if (row.getCell('hasMultipleCharges').value === true) {
          cell.font = {
            color: { argb: '008000' }
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

    worksheet.views = [{ state: 'frozen', ySplit: 1 }];

    return [workbook, false, undefined];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return [undefined, false, error.message];
  }
}

export default accountingReport;
