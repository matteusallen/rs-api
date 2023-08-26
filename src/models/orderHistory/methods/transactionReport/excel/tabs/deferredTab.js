import { getColumns } from '../reportColumns';
import * as helpers from '../helpers';

export const fillDeferredTab = (worksheet, reportRows, request) => {
  const unnecessaryColumns = ['cardBrand', 'stripeFee', 'stripePayoutId', 'paidDate', 'refundReason'];
  const [columns, addOnNames] = getColumns(reportRows, unnecessaryColumns);
  worksheet.columns = columns;

  helpers.addHeader(request.body, worksheet, reportRows);
  helpers.styleTableHeader(worksheet);
  worksheet.addRows(helpers.filterRows(reportRows, unnecessaryColumns));
  helpers.styleTable(worksheet);
  helpers.addTotals(worksheet, addOnNames, reportRows);
};
