import { eventReportData, reportsSample } from 'Tests/__fixtures__';
import { reportHelpers } from 'Utils';

describe('When getting events report', () => {
  it(`should export the same base64 output all the time`, async () => {
    //generate event report with base64 output format
    const reportBase64String = await reportHelpers.populateTemplate(
      eventReportData,
      'src/assets/event-report-template.xlsx',
      'Event Report',
      1,
      9,
      false,
      'base64'
    );
    expect(reportBase64String).toEqual(reportsSample.eventReport);
  });
});
