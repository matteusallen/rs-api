import Moment from 'moment';
import { RESERVATION_X_REF_TYPE_ID, RV_PRODUCT_X_REF_TYPE_ID, ADD_ON_PRODUCT_X_REF_TYPE_ID, STALL_PRODUCT_X_REF_TYPE_ID } from 'Constants';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

function generateRateRows({ payments, rateType, dates, targetProduct, byEvent, eventId, venueTimeZone }) {
  const rowNames = ['Cash', 'Credit', `${rateType} Net Income`];

  const productXRefId = targetProduct === 'stallProduct' ? 1 : 3;

  const cashPayments = payments.filter(payment => !payment.cardPayment && Math.sign(payment.amount) === 1);
  const creditPayments = payments.filter(payment => payment.cardPayment && Math.sign(payment.amount) === 1);
  // TODO: bring this back or refactor when refunding specific items is implemented
  // const cashRefunds = payments.filter((payment) => !payment.cardPayment && Math.sign(payment.amount) === -1)
  // const creditRefunds = payments.filter((payment) => payment.cardPayment && Math.sign(payment.amount) === -1)

  const transactions = [cashPayments, creditPayments, payments];
  const initialRows = [{ rowName: rateType }];
  const rows = transactions.reduce((acc, curr, i) => {
    const newRow = { rowName: rowNames[i], totalAmount: 0, totalCount: 0 };

    for (const payment of curr) {
      const { order } = payment;
      const { orderItems } = order;
      let paymentDate;

      if (venueTimeZone) {
        paymentDate = moment(payment.createdAt).tz(venueTimeZone).startOf('day').format('MM-DD-YYYY');
      } else {
        paymentDate = moment(payment.createdAt).startOf('day').format('MM-DD-YYYY');
      }

      const flatRateOrderItems = orderItems.filter(
        orderItem =>
          !!orderItem.reservation &&
          !!orderItem.reservation[targetProduct] &&
          orderItem.reservation.xRefTypeId === productXRefId &&
          !orderItem.reservation[targetProduct].nightly
      );

      const nightlyRateOrderItems = orderItems.filter(
        orderItem =>
          !!orderItem.reservation &&
          !!orderItem.reservation[targetProduct] &&
          orderItem.reservation.xRefTypeId === productXRefId &&
          orderItem.reservation[targetProduct].nightly
      );

      const addOnsOrderItems = orderItems.filter(orderItem => orderItem.addOnProduct && orderItem.addOnProduct.addOn.name === targetProduct);

      for (const orderItem of flatRateOrderItems) {
        dates.forEach(date => {
          const amountValue = newRow[`${date}Amount`];
          const countValue = newRow[`${date}Count`];
          const actualDate = moment(new Date(date).toISOString()).startOf('day').format('MM-DD-YYYY');

          if (payment.amount > 0 && paymentDate === actualDate) {
            if (byEvent && eventId !== payment.order.eventId) return;

            newRow[`${date}Count`] = countValue ? countValue + orderItem.quantity : orderItem.quantity;
            newRow[`${date}Amount`] = amountValue ? amountValue + orderItem.price : Number(orderItem.price.toFixed(2));
            newRow[`${date}Count`] = countValue ? countValue + orderItem.quantity : orderItem.quantity;
            newRow[`${date}Amount`] = amountValue ? amountValue + orderItem.price : Number(orderItem.price.toFixed(2));
            newRow.totalCount += orderItem.quantity;
            newRow.totalAmount += Number(orderItem.price.toFixed(2));
          }
        });
      }

      dates.forEach(date => {
        const amountValue = newRow[`${date}Amount`];
        const countValue = newRow[`${date}Count`];
        const actualDate = moment(new Date(date).toISOString()).startOf('day').format('MM-DD-YYYY');

        let item;
        if ((targetProduct === 'stallProduct' || targetProduct === 'rvProduct') && !flatRateOrderItems.length) {
          [item] = nightlyRateOrderItems;
        } else if (addOnsOrderItems.length) {
          [item] = addOnsOrderItems;
        } else return;

        if (!item) return;

        // ternarys should be updated when refunds have a new order associated to them, this is temporary logic to address current functionality

        if (i !== 2 && payment.amount > 0 && paymentDate === actualDate) {
          if (byEvent && eventId !== payment.order.eventId) return;
          newRow[`${date}Count`] = countValue ? countValue + item.quantity : item.quantity;
          newRow[`${date}Amount`] = amountValue ? amountValue + item.price : Number(item.price.toFixed(2));
          newRow.totalCount += item.quantity;
          newRow.totalAmount += Number(item.price.toFixed(2));
        }
        // TODO: bring this back or refactor when refunding specific items is implemented
        // else if (i !== 4 && payment.amount < 0) {
        //   newRow[`${date}Count`] = '-'
        //   newRow[`${date}Amount`] = `(${Number(Math.abs(payment.amount))})`
        //   newRow.totalAmount += payment.amount
        // }
        if (i === 2 && payment.amount > 0 && paymentDate === actualDate) {
          if (byEvent && eventId !== payment.order.eventId) return;
          newRow[`${date}Amount`] = amountValue ? amountValue + Number(item.price.toFixed(2)) : Number(item.price.toFixed(2));
          newRow.totalAmount += Number(item.price.toFixed(2));
        }
        // else {
        //   newRow[`${date}Amount`] = cellValue ? cellValue + payment.amount : payment.amount
        //   newRow.totalAmount += payment.amount
        // }
      });
    }
    acc.push(newRow);
    return acc;
  }, initialRows);
  // empty row to separate sections
  rows.push({});
  return rows;
}

function generateTotalRows({ payments, dates, type, byEvent, eventId, venueTimeZone }) {
  const rows = [`Total ${type} Sales`, `Total ${type} Refunds`, type ? `Total Net ${type}` : 'Total Net Income'];
  const cashPayments = payments.filter(payment => !payment.cardPayment);
  const creditPayments = payments.filter(payment => payment.cardPayment);
  const targetPayments = type === 'Cash' ? cashPayments : type === 'Credit' ? creditPayments : payments;

  const totalRows = rows.reduce((acc, curr, i) => {
    const newRow = { rowName: curr, totalAmount: 0 };
    for (const payment of targetPayments) {
      const { orderItems } = payment.order;
      let paymentDate;

      if (venueTimeZone) {
        paymentDate = moment(payment.createdAt).tz(venueTimeZone).startOf('day').format('MM-DD-YYYY');
      } else {
        paymentDate = moment(payment.createdAt).startOf('day').format('MM-DD-YYYY');
      }

      const flatRateOrderItems = orderItems.filter(orderItem => {
        if (!orderItem.reservation) return;
        const targetProduct = orderItem.reservation && orderItem.reservation.xRefTypeId === STALL_PRODUCT_X_REF_TYPE_ID ? 'stallProduct' : 'rvProduct';
        return !!orderItem.reservation && !!orderItem.reservation[targetProduct] && !orderItem.reservation[targetProduct].nightly;
      });

      if (flatRateOrderItems.length) {
        dates.forEach(date => {
          const actualDate = moment(new Date(date).toISOString()).startOf('day').format('MM-DD-YYYY');
          const cellValue = newRow[`${date}Amount`];
          if ((i === 0 && payment.amount > 0) || (i === 1 && payment.amount < 0) || i === 2) {
            if (paymentDate === actualDate) {
              if (byEvent && eventId !== payment.order.eventId) return;
              newRow[`${date}Amount`] = cellValue ? cellValue + Number(payment.amount.toFixed(2)) : Number(payment.amount.toFixed(2));
              newRow.totalAmount += Number(payment.amount.toFixed(2));
            }
          }
        });
      } else {
        dates.forEach(date => {
          const actualDate = moment(new Date(date).toISOString()).startOf('day').format('MM-DD-YYYY');
          const cellValue = newRow[`${date}Amount`];
          if ((i === 0 && payment.amount > 0) || (i === 1 && payment.amount < 0) || i === 2) {
            if (paymentDate === actualDate) {
              if (byEvent && eventId !== payment.order.eventId) return;
              newRow[`${date}Amount`] = cellValue ? cellValue + Number(payment.amount.toFixed(2)) : Number(payment.amount.toFixed(2));
              newRow.totalAmount += Number(payment.amount.toFixed(2));
            }
          }
        });
      }
    }
    acc.push(newRow);
    return acc;
  }, []);
  // empty row to separate sections
  totalRows.push({});
  return totalRows;
}

async function summaryReport(input) {
  try {
    const { User } = this.sequelize.models;
    const { worksheet, payments, start, end, adminIds, byEvent, eventId, venueTimeZone } = input;

    let admin;
    if (adminIds.length > 1) {
      admin = 'All Admins';
    } else {
      const { payload: user } = await User.getUser({ id: adminIds[0] });
      admin = `${user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)} ${user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)}`;
    }

    let reportDatesForComparison;

    if (venueTimeZone) {
      reportDatesForComparison = Array.from(moment.range(moment(start), moment(end)).by('day')).map(day =>
        day.tz(venueTimeZone).startOf('day').format('MM-DD-YYYY')
      );

      // Check if end date was included (moment's 'by' operator may exclude last date)
      if (!reportDatesForComparison.includes(moment(end).tz(venueTimeZone).startOf('day').format('MM-DD-YYYY'))) {
        reportDatesForComparison.push(moment(end).tz(venueTimeZone).startOf('day').format('MM-DD-YYYY'));
      }
    } else {
      reportDatesForComparison = Array.from(moment.range(moment(start), moment(end)).by('day')).map(day => day.startOf('day').format('MM-DD-YYYY'));
      // Check if end date was included (moment's 'by' operator may exclude last date)
      if (!reportDatesForComparison.includes(moment(end).startOf('day').format('MM-DD-YYYY'))) {
        reportDatesForComparison.push(moment(end).startOf('day').format('MM-DD-YYYY'));
      }
    }

    const dateColumns = reportDatesForComparison.reduce((acc, curr) => {
      const columns = [
        { header: 'Count', key: `${curr}Count`, width: 16 },
        { header: 'Amount', key: `${curr}Amount`, width: 16, style: { numFmt: '$##,##0.00' } }
      ];
      return acc.concat(columns);
    }, []);

    const columns = [
      { header: admin, key: 'rowName', width: 25 },
      ...dateColumns,
      { header: 'Count', key: 'totalCount', width: 16 },
      { header: 'Amount', key: 'totalAmount', width: 16, style: { numFmt: '$##,##0.00' } }
    ];

    const nightlyStallRatePayments = payments.filter(payment => {
      const { order } = payment;
      const { orderItems } = order;
      if (orderItems.findIndex(orderItem => orderItem.xRefTypeId === RESERVATION_X_REF_TYPE_ID) > -1) {
        const reservationOrderItems = orderItems.filter(orderItem => orderItem.xRefTypeId === RESERVATION_X_REF_TYPE_ID);
        for (const orderItem of reservationOrderItems) {
          const { reservation } = orderItem;
          if (!!reservation.stallProduct && reservation.stallProduct.nightly) return reservation.xRefTypeId === STALL_PRODUCT_X_REF_TYPE_ID;
        }
      }
    });

    const flatStallRatePayments = payments.filter(payment => {
      const { order } = payment;
      const { orderItems } = order;
      const reservationOrderItems = orderItems.filter(orderItem => orderItem.xRefTypeId === RESERVATION_X_REF_TYPE_ID);
      for (const orderItem of reservationOrderItems) {
        const { reservation } = orderItem;
        if (!!reservation.stallProduct && !reservation.stallProduct.nightly) return reservation.xRefTypeId === STALL_PRODUCT_X_REF_TYPE_ID;
      }
    });

    const nightlyRvRatePayments = payments.filter(payment => {
      const { order } = payment;
      const { orderItems } = order;
      if (orderItems.findIndex(orderItem => orderItem.xRefTypeId === RESERVATION_X_REF_TYPE_ID) > -1) {
        const reservationOrderItems = orderItems.filter(orderItem => orderItem.xRefTypeId === RESERVATION_X_REF_TYPE_ID);
        for (const orderItem of reservationOrderItems) {
          const { reservation } = orderItem;
          if (!!reservation.rvProduct && reservation.rvProduct.nightly) return reservation.xRefTypeId === RV_PRODUCT_X_REF_TYPE_ID;
        }
      }
    });

    const addOnPayments = payments.reduce((acc, curr) => {
      const { order } = curr;
      const { orderItems } = order;
      if (orderItems.findIndex(orderItem => orderItem.xRefTypeId === ADD_ON_PRODUCT_X_REF_TYPE_ID) > -1) {
        const addOnOrderItems = orderItems.filter(orderItem => orderItem.xRefTypeId === ADD_ON_PRODUCT_X_REF_TYPE_ID);
        for (const orderItem of addOnOrderItems) {
          const { addOnProduct } = orderItem;
          const { addOn } = addOnProduct;
          if (!acc[addOn.name]) {
            acc[addOn.name] = [curr];
          } else {
            acc[addOn.name].push(curr);
          }
        }
      }
      return acc;
    }, {});

    const reportAddOns = Object.keys(addOnPayments);
    let addOnRows = [];
    for (const addOn of reportAddOns) {
      const addOnRowSection = generateRateRows({
        payments: addOnPayments[addOn],
        rateType: `${addOn.charAt(0).toUpperCase() + addOn.slice(1)}`,
        dates: reportDatesForComparison,
        targetProduct: addOn,
        byEvent,
        eventId,
        venueTimeZone
      });
      addOnRows = addOnRows.concat(addOnRowSection);
    }

    const nightlyStallRateRows = generateRateRows({
      payments: nightlyStallRatePayments,
      rateType: 'Stall - Nightly Rate',
      dates: reportDatesForComparison,
      targetProduct: 'stallProduct',
      byEvent,
      eventId,
      venueTimeZone
    });

    const flatStallRateRows = generateRateRows({
      payments: flatStallRatePayments,
      rateType: 'Stall - Flat Rate',
      dates: reportDatesForComparison,
      targetProduct: 'stallProduct',
      byEvent,
      eventId,
      venueTimeZone
    });

    const nightlyRvRateRows = generateRateRows({
      payments: nightlyRvRatePayments,
      rateType: 'RV - Nightly Rate',
      dates: reportDatesForComparison,
      targetProduct: 'rvProduct',
      byEvent,
      eventId,
      venueTimeZone
    });

    const flatRvRateRows = generateRateRows({
      payments: flatStallRatePayments,
      rateType: 'RV - Flat Rate',
      dates: reportDatesForComparison,
      targetProduct: 'rvProduct',
      byEvent,
      eventId,
      venueTimeZone
    });

    const cashTotalRows = generateTotalRows({
      payments,
      dates: reportDatesForComparison,
      type: 'Cash',
      byEvent,
      eventId,
      venueTimeZone
    });

    const creditTotalRows = generateTotalRows({
      payments,
      dates: reportDatesForComparison,
      type: 'Credit',
      byEvent,
      eventId,
      venueTimeZone
    });

    const totalRows = generateTotalRows({
      payments,
      dates: reportDatesForComparison,
      type: '',
      byEvent,
      eventId,
      venueTimeZone
    });

    const dataRows = []
      .concat(nightlyStallRateRows)
      .concat(flatStallRateRows)
      .concat(nightlyRvRateRows)
      .concat(flatRvRateRows)
      .concat(addOnRows)
      .concat(cashTotalRows)
      .concat(creditTotalRows)
      .concat(totalRows);

    worksheet.columns = columns;
    worksheet.addRows(dataRows);

    const capitalizedReportAddOns = reportAddOns.map(addOn => `${addOn.charAt(0).toUpperCase() + addOn.slice(1)}`);
    const sectionTitles = ['Nightly Rate', 'Flat Rate', 'RV', ...capitalizedReportAddOns];

    worksheet.eachRow({ includeEmpty: true }, row => {
      const firstCellValue = row.getCell(1).value;
      if (sectionTitles.includes(firstCellValue)) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD2E2F1' }
        };
      }
      if (!row.getCell(1).value || row.getCell(1).value.includes('Total Net')) {
        row.border = {
          bottom: { style: 'medium' }
        };
      }
      row.eachCell({ includeEmpty: true }, cell => {
        if (cell.value < 0) {
          cell.value = `$(${Number(Math.abs(cell.value)).toFixed(2)})`;
          cell.alignment = { horizontal: 'right' };
        }
        if (cell._column._key.includes('Count') && !cell.value && !row.getCell(1).value.includes('Net Income')) {
          cell.value = 0;
        }
        if (cell._column._key.includes('Amount') && !cell.value && !row.getCell(1).value.includes('Net Income')) {
          cell.value = '-';
          cell.alignment = { horizontal: 'right' };
        }
        if (row.getCell(1).value && row.getCell(1).value.includes('Total Net')) {
          cell.font = {
            bold: true
          };
        }
      });
    });

    worksheet.duplicateRow(1, 1, true);

    const dateHeaderValues = {
      rowName: ''
    };

    for (const date of reportDatesForComparison) {
      dateHeaderValues[`${date}Count`] = date;
    }
    dateHeaderValues.totalCount = 'Total';

    const dateRow = worksheet.getRow(1);
    dateRow.values = dateHeaderValues;
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('').map(char => char.toUpperCase());
    const cellsToMerge = [];
    dateRow.eachCell({ includeEmpty: true }, cell => {
      if (cell.value) {
        const splitAddress = cell._address.split('');

        const targetLetterIndex = splitAddress.length - 2;
        const targetLetterAlphabetIndex = alphabet.findIndex(letter => letter === splitAddress[targetLetterIndex]);

        const preTargetLetter = splitAddress[targetLetterIndex - 1];
        const preTargetLetterAlphabetIndex = alphabet.findIndex(letter => letter === preTargetLetter);

        const nextPreTargetLetter = alphabet[preTargetLetterAlphabetIndex + 1];

        if (targetLetterAlphabetIndex === 25 && splitAddress.length > 2) {
          splitAddress[targetLetterIndex - 1] = nextPreTargetLetter;
          splitAddress[targetLetterIndex] = 'A';
        } else if (targetLetterAlphabetIndex === 25 && splitAddress.length === 2) {
          splitAddress[targetLetterIndex] = 'AA';
        } else {
          splitAddress[targetLetterIndex] = alphabet[targetLetterAlphabetIndex + 1];
        }

        const nextAddress = splitAddress.join('');
        cellsToMerge.push(`${cell._address}:${nextAddress}`);
      }
    });

    for (const cells of cellsToMerge) {
      try {
        worksheet.mergeCells(cells);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e.message);
        // eslint-disable-next-line no-console
        console.log(cells);
        //to avoid already merged cells error
        //as exceljs tries to merge ZZ1 with A1
        worksheet.mergeCells('ZZ1:AAA1');
      }
    }

    dateRow.eachCell({ includeEmpty: true }, cell => {
      cell.font = {
        bold: true
      };
      cell.alignment = { horizontal: 'center' };
    });

    return [worksheet, undefined];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw error;
  }
}

export default summaryReport;
