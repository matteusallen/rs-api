import moment from 'moment';
import _omit from 'lodash.omit';
import { TRANSACTION_TYPE_MULTI_PAYMENT } from '../../constants';
import { TRANSACTION_REPORT_DATA } from '../../../../../../constants/index';

export const addHeader = (requestBody, worksheet, reportRows) => {
  addTitle(worksheet);
  addReportingPeriod(requestBody, worksheet);
  addEvent(requestBody, worksheet, reportRows);
};

const addTitle = worksheet => {
  worksheet.insertRow(1, ['Transaction Report']);
  worksheet.getRow(1).font = TRANSACTION_REPORT_DATA.TITLE_STYLE;
};

const addReportingPeriod = ({ start, end }, worksheet) => {
  const startDate = start ? moment(start).format('MM/DD/YYYY') : '';
  const endDate = end ? moment(end).format('MM/DD/YYYY') : '';
  const reportingPeriod = `Reporting period: ${startDate}-${endDate}`;
  worksheet.insertRow(2, [reportingPeriod]);
  worksheet.getRow(2).font = TRANSACTION_REPORT_DATA.SUBTITLE_STYLE;
};

const addEvent = ({ eventIds }, worksheet, reportRows) => {
  const eventName = hasEventData(eventIds, reportRows) ? reportRows[0].event : '-';
  const eventText = `Event: ${eventName}`;
  worksheet.insertRow(3, [eventText]);
  worksheet.getRow(3).font = TRANSACTION_REPORT_DATA.SUBTITLE_STYLE;
  worksheet.insertRow(4, ['']);
};

const hasEventData = (eventIds, reportRows) => eventIds?.length && reportRows?.length;

export const styleTableHeader = worksheet => {
  worksheet.getRow(TRANSACTION_REPORT_DATA.TABLE_HEADER_ROW).font = TRANSACTION_REPORT_DATA.SUBTITLE_STYLE;
};

export const styleTable = worksheet => {
  worksheet.views = [{ state: 'frozen', ySplit: 5 }];
  worksheet.eachRow((row, rowNumber) => {
    setTableHeight(row, rowNumber);
    addColorStyles(row, rowNumber);
    showRowStripes(row, rowNumber);
  });
};

const setTableHeight = (row, rowNumber) => {
  if (rowNumber >= TRANSACTION_REPORT_DATA.TABLE_HEADER_ROW) {
    row.height = 24;
  }
};

const addColorStyles = (row, rowNumber) => {
  const transactionType = row.values[6];

  if (rowNumber >= TRANSACTION_REPORT_DATA.FIRST_DATA_ROW && isRefund(row)) {
    row.font = { bold: true, color: { argb: 'ff0000' } };
  }
  if (rowNumber >= TRANSACTION_REPORT_DATA.FIRST_DATA_ROW && isSplitPayment(transactionType)) {
    row.font = { bold: true, color: { argb: '7B1FA2' } };
  }
};

const isRefund = row => {
  const transactionType = row.values[6];
  const refundReason = row.values[8];
  return transactionType.indexOf('Refund') !== -1 || (refundReason && refundReason.length > 0 && refundReason?.indexOf('NO REFUND') !== -1);
};

export const isSplitPayment = transactionType => {
  return transactionType.includes(TRANSACTION_TYPE_MULTI_PAYMENT);
};

const showRowStripes = (row, rowNumber) => {
  if (rowNumber >= TRANSACTION_REPORT_DATA.FIRST_DATA_ROW && isEven(rowNumber)) {
    row.fill = TRANSACTION_REPORT_DATA.FILL_COLOR;
  }
};

const isEven = rowNumber => rowNumber % 2 === 0;

export const addTotals = (worksheet, addOnNames, reportRows) => {
  let emptyCells = worksheet.name === 'Deferred' ? 9 : worksheet.name === 'Cash' ? 10 : 11;
  addFirstRow(addOnNames, worksheet, emptyCells);
  addSecondRow(worksheet, addOnNames, reportRows, emptyCells);
};

const addFirstRow = (addOnNames, worksheet, emptyCells) => {
  const addOnTotalNames = addOnNames.flatMap(row => ['', '', `${row.header} Total`]);
  const row = worksheet.addRow([...getEmptyCells(emptyCells), 'Stall total', '', '', '', 'RV total', ...addOnTotalNames, 'Subtotal', '', '', 'Grand total']);
  row.font = TRANSACTION_REPORT_DATA.TOTAL_TITLE_STYLE;
  row.fill = TRANSACTION_REPORT_DATA.FILL_COLOR;
  row.alignment = { horizontal: 'right' };
};

const addSecondRow = (worksheet, addOnNames, reportRows, emptyCells) => {
  const totals = getTotals(reportRows, addOnNames);
  const addOnTotals = addOnNames.flatMap(row => ['', '', totals[`${row.header}Total`]]);
  const row = worksheet.addRow([
    ...getEmptyCells(emptyCells),
    totals.stallsTotal,
    '',
    '',
    '',
    totals.rvsTotal,
    ...addOnTotals,
    totals.subtotal,
    '',
    '',
    totals.total
  ]);
  row.font = TRANSACTION_REPORT_DATA.TOTAL_STYLE;
  row.fill = TRANSACTION_REPORT_DATA.FILL_COLOR;
};

const getEmptyCells = rowNumber => Array(rowNumber).fill('');

const getTotals = (reportRows, addOnNames) => {
  return reportRows.reduce((totals, curr) => {
    setTotal(curr, totals, 'stallsTotal');
    setTotal(curr, totals, 'rvsTotal');
    setTotal(curr, totals, 'subtotal');
    setTotal(curr, totals, 'total');

    setAddOnsTotal(addOnNames, curr, totals);
    return totals;
  }, {});
};

const setTotal = (curr, totals, name) => {
  const currentTotal = toNumber(curr[name]);
  totals[name] = (totals[name] ?? 0) + currentTotal;
};

const toNumber = amount => {
  if (!amount || amount === '-') {
    return 0;
  }
  return amount;
};

const setAddOnsTotal = (addOnNames, curr, totals) => {
  addOnNames.forEach(addOn => {
    const name = addOn.header;
    const currentAddOnTotal = toNumber(curr[`${name}Total`]);
    totals[`${name}Total`] = (totals[`${name}Total`] ?? 0) + currentAddOnTotal;
  });
};

export const filterRows = (reportRows, removedKeys) => {
  return reportRows.map(row => {
    row = _omit(row, removedKeys);
    return row;
  });
};
