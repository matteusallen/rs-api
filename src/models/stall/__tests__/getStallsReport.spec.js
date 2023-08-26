import { stallReportData, reportsSample } from 'Tests/__fixtures__';
import { reportHelpers } from 'Utils';

describe('When getting stalls report', () => {
  it(`should export the same base64 output all the time`, async () => {
    //generate stall report with base64 output format
    const reportBase64String = await reportHelpers.populateTemplate(
      stallReportData,
      'src/assets/stall-report-template.xlsx',
      'Stall Report',
      1,
      10,
      true,
      'base64'
    );
    expect(reportBase64String).toEqual(reportsSample.stallReport);
  });
});
