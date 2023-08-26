import { existsSync, mkdirSync } from 'fs';
import AWS from 'aws-sdk';
import { Payment, Payout, Venue, Event, RVSpot, Stall } from 'Models';
import adminReportsEmail from '../services/email/adminReportsEmail';
import Bugsnag from '@bugsnag/js';
import { EventEmitter } from 'events';
import { STRIPE_ACCOUNT_TYPE, RECONCILIATION_ACTION, ACCOUNTING_ACTION, EVENTS_REPORT, STALLS_REPORT, RV_REPORT, TRANSACTION_REPORT } from 'Constants';

const REPORTS_BUCKET_NAME = `${process.env.AWS_BUCKET}/documents/admin/reports`;

const em = new EventEmitter();
const s3 = new AWS.S3();

const processReports = async (request, user) => {
  try {
    const { reportType, venueId, eventIds } = request.body;
    const { ssGlobalId, roleId } = user;
    const fileName = `${reportType}_report_${ssGlobalId}_${Date.now()}.xlsx`;
    let workbook, error;

    if (reportType === ACCOUNTING_ACTION) {
      const venue = await Venue.findOne({ where: { id: venueId } });

      if (!venue) throw new Error('invalid request');
      [workbook, , error] =
        venue.stripeAccountType === STRIPE_ACCOUNT_TYPE.standard
          ? await Payment.accountingReport(request.body, '')
          : await Payout.accountingReport(request.body, '');
    } else if (reportType === RECONCILIATION_ACTION) {
      [workbook, , error] = await Payment.reconciliationReport(request.body, '');
    } else if (reportType === TRANSACTION_REPORT) {
      [workbook] = await Payment.getTransactionReport(request.body, '', roleId);
    } else if (reportType === EVENTS_REPORT) {
      [workbook] = await Event.getEventReportData(eventIds, '');
    } else if (reportType === STALLS_REPORT) {
      [workbook] = await Stall.getStallsReport(eventIds, '');
    } else if (reportType === RV_REPORT) {
      [workbook] = await RVSpot.getRVReport(eventIds, '');
    } else throw new Error('Invalid report type');

    if (error) throw error;

    const downloadDir = './downloads';
    if (!existsSync(downloadDir)) {
      mkdirSync(downloadDir);
    }

    const params = {
      Bucket: REPORTS_BUCKET_NAME,
      Key: fileName,
      Body: (await workbook?.xlsx?.writeBuffer()) || workbook
    };

    //Upload to s3
    const upload = await s3.upload(params).promise();

    if (upload) {
      // eslint-disable-next-line no-console
      console.log(`File uploaded successfully for '${user.id}' at ${upload.Location}.`);
      const downloadLink = `${request.protocol}://${request.get('host')}/admin/reports/download/${fileName}`;
      adminReportsEmail(user.email, reportType, downloadLink);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    Bugsnag.notify(new Error(e));
  }
};

em.addListener('processReport', (request, user) => {
  setImmediate(() => processReports(request, user));
});

export { processReports, em };
