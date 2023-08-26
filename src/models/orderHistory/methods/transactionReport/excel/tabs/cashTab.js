import { getColumns } from '../reportColumns';
import * as helpers from '../helpers';

export const fillCashTab = (worksheet, reportRows, request) => {
  const unnecessaryColumns = ['cardBrand', 'stripeFee', 'stripePayoutId', 'paidDate'];
  const [columns, addOnNames] = getColumns(reportRows, unnecessaryColumns);
  worksheet.columns = columns;

  helpers.addHeader(request.body, worksheet, reportRows);
  helpers.styleTableHeader(worksheet);
  worksheet.addRows(helpers.filterRows(reportRows, unnecessaryColumns));
  helpers.styleTable(worksheet);
  helpers.addTotals(worksheet, addOnNames, reportRows);
};
