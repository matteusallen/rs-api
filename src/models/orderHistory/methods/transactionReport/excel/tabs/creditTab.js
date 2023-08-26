import { getColumns } from '../reportColumns';
import * as helpers from '../helpers';

export const fillCreditTab = (worksheet, reportRows, request) => {
  const [columns, addOnNames] = getColumns(reportRows);
  worksheet.columns = columns;

  helpers.addHeader(request.body, worksheet, reportRows);
  helpers.styleTableHeader(worksheet);
  worksheet.addRows(reportRows);
  helpers.styleTable(worksheet);
  helpers.addTotals(worksheet, addOnNames, reportRows);
};
