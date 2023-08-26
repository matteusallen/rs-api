import { transactionReportData, reportsSample } from 'Tests/__fixtures__';
import { reportHelpers } from 'Utils';

describe('When getting transaction report', () => {
  jest.setTimeout(30000);
  it(`should export the same base64 output all the time`, async () => {
    //generate event report with base64 output format
    const reportBase64String = await reportHelpers.populateTemplate(
      transactionReportData,
      'src/assets/transaction-report-template.xlsx',
      'Transaction Report',
      1,
      9,
      false,
      'base64',
      15
    );
    expect(reportBase64String).toEqual(reportsSample.transactionReport);
  });
});
