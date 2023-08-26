import { rvReportData, reportsSample } from 'Tests/__fixtures__';
import { reportHelpers } from 'Utils';

describe('When getting rv report', () => {
  it(`should export the same base64 output all the time`, async () => {
    //generate stall report with base64 output format
    const reportBase64String = await reportHelpers.populateTemplate(rvReportData, 'src/assets/rv-report-template.xlsx', 'RV Report', 1, 10, true, 'base64');
    expect(reportBase64String).toEqual(reportsSample.rvReport);
  });
});
