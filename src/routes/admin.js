import validateRoute from '@praxent/praxent-validate-route';
import Bugsnag from '@bugsnag/js';
import multerS3 from 'multer-s3';
import multer from 'multer';
import AWS from 'aws-sdk';
import { Payment, Payout, Document, User, Group, Venue, Event, Stall, RVSpot, OrderHistory, Reservation } from 'Models';
import {
  STRIPE_ACCOUNT_TYPE,
  RECONCILIATION_ACTION,
  ACCOUNTING_ACTION,
  GROUP_BILL,
  EVENTS_REPORT,
  STALLS_REPORT,
  RV_REPORT,
  TRANSACTION_REPORT,
  RESERVATION_REPORT
} from 'Constants';

const gatewayToken = process.env.GATEWAY_TOKEN;
const validate = validateRoute(gatewayToken);

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});
const s3 = new AWS.S3();

const venueAgreementUpload = multer({
  limits: {
    fileSize: 20000000,
    files: 1
  },
  storage: multerS3({
    s3,
    bucket: `${process.env.AWS_BUCKET}/documents/venue/agreements`,
    acl: 'public-read',
    key: (req, file, cb) => {
      cb(null, `${req.body.venueId}-${Date.now().toString()}.pdf`);
    }
  })
}).single('document');

const venueMapUpload = multer({
  limits: {
    fileSize: 20000000,
    files: 1
  },
  storage: multerS3({
    s3,
    bucket: `${process.env.AWS_BUCKET}/documents/venue/maps`,
    acl: 'public-read',
    key: (req, file, cb) => {
      cb(null, `${req.body.venueId}-${req.body.name}${req.body.name.includes('.pdf') ? '' : '.pdf'}`);
    }
  })
}).single('document');

const baseRoute = 'admin';

const adminRoutes = app => {
  const gatewayAuthWare = (req, res, next) => {
    return gatewayToken === req.headers.token ? next() : res.json({ success: false, error: 'Unauthenticated!' });
  };

  app.post(`/${baseRoute}/venue-agreement`, gatewayAuthWare, (req, res) => {
    venueAgreementUpload(req, res, async err => {
      try {
        if (err) throw Error(err.message);
        if (!req.file) throw Error('No file sent');
        const [document, documentError] = await Document.createDocument(req.file, req.body);
        if (documentError) throw Error(documentError);
        return res.json({ success: true, document });
      } catch (error) {
        return res.json({ success: false, error: error.message });
      }
    });
  });

  app.post(`/${baseRoute}/venue-map`, gatewayAuthWare, (req, res) => {
    venueMapUpload(req, res, async err => {
      try {
        if (err) throw Error(err.message);
        if (!req.file) throw Error('No file sent');
        const [document, documentError] = await Document.createDocument(req.file, req.body);
        if (documentError) throw Error(documentError);
        return res.json({ success: true, document });
      } catch (error) {
        return res.json({ success: false, error: error.message });
      }
    });
  });

  app.post(
    `/${baseRoute}/stripe-payouts`,
    validate({
      action: async (req, res) => {
        try {
          const [result, error] = await Payout.getPayoutsFromStripe();
          if (error) throw Error(error);
          res.json({ success: true, result });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error.message);
          Bugsnag.notify(new Error(error.message), e => {
            e.context = 'Error retrieving payouts, charges, or refunds from Stripe';
          });
          return res.json({ success: false, error: error.message });
        }
      },
      requireAuth: true
    })
  );

  app.post(
    `/${baseRoute}/download/group-bill`,
    validate({
      action: async (req, res) => {
        try {
          const { groupId, eventIds, userId } = req.body;
          if (!groupId || typeof groupId != 'number' || !eventIds || !Array.isArray(eventIds) || !eventIds.length) {
            return res.json({ success: false, error: 'invalid request' });
          }

          const user = await User.getUser({ id: userId });
          if (user.error) return res.status(500).json({ success: false, error: 'Unable to process request' });

          const workbook = await Group.groupMemberSubTotalReport(groupId, eventIds);

          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'attachment; filename=' + 'Group_Bill_Reports.xlsx');
          await workbook.xlsx.write(res);
          res.end();
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
          return res.json({ success: false, error: error.message });
        }
      },
      requireAuth: true
    })
  );

  app.get(
    `/${baseRoute}/reports/download/:file`,
    validate({
      action: (req, res) => {
        const config = {
          Bucket: `${process.env.AWS_BUCKET}/documents/admin/reports`,
          Key: req.params.file
        };

        //set proper header to make the file downloadable
        res.attachment(req.params.file);

        //trigger download
        s3.getObject(config)
          .createReadStream()
          .on('error', e => {
            // eslint-disable-next-line no-console
            console.error(e);
            Bugsnag.notify(new Error(e.message), e => {
              e.context = 'Error downloading reports from s3';
            });
          })
          .pipe(res);
      }
    })
  );

  app.post(
    `/${baseRoute}/reports`,
    validate({
      action: async (request, res) => {
        try {
          const { reportType, groupId, eventIds, venueId, userId } = request.body;

          if (!reportType) throw new Error('Invalid report type');

          const user = await User.getUser({ id: userId });

          const { ssGlobalId, email, roleId } = user.payload;

          const ADMIN_MESSAGE_FOR_PENDING_FILE = `Your report is too large. It will be sent to ${email}.`;

          if (user.error) throw new Error('Unable to find user for this request');

          const fileName = `${reportType}_report_${ssGlobalId}_${Date.now()}.xlsx`;
          let workbook, error, isPending;

          if (reportType === ACCOUNTING_ACTION) {
            const venue = await Venue.findOne({ where: { id: venueId } });
            if (!venue) throw new Error('invalid request');
            request.body.venueTimeZone = venue.timeZone;
            request.body.stripeAccountType = venue.stripeAccountType;
            [workbook, isPending, error] =
              venue.stripeAccountType === STRIPE_ACCOUNT_TYPE.standard
                ? await Payment.accountingReport(request.body, request)
                : await Payout.accountingReport(request.body, request);
            if (isPending) {
              res.status(202).send(ADMIN_MESSAGE_FOR_PENDING_FILE);
              res.end();
              return;
            }
          } else if (reportType === RECONCILIATION_ACTION) {
            const venue = await Venue.findOne({ where: { id: venueId } });
            if (!venue) throw new Error('invalid request');
            request.body.venueTimeZone = venue.timeZone;
            request.body.stripeAccountType = venue.stripeAccountType;
            [workbook, isPending, error] = await Payment.reconciliationReport(request.body, request);
            if (isPending) {
              res.status(202).send(ADMIN_MESSAGE_FOR_PENDING_FILE);
              res.end();
              return;
            }
          } else if (reportType === TRANSACTION_REPORT) {
            const venue = await Venue.findOne({ where: { id: venueId }, include: [{ association: 'users', attributes: ['id'] }] });
            if (!venue) throw new Error('invalid request');
            request.body.venueTimeZone = venue.timeZone;
            request.body.userIds = venue.users.map(user => user.id);
            request.body.stripeAccountType = venue.stripeAccountType;
            [workbook, isPending] = await OrderHistory.transactionReport(request, roleId);

            if (isPending) {
              //[workbook, true/false if pending, errorMessage]
              res.status(202).send(ADMIN_MESSAGE_FOR_PENDING_FILE);
              res.end();
              return;
            }
          } else if (reportType === GROUP_BILL) {
            workbook = await Group.groupMemberSubTotalReport(groupId, eventIds);
          } else if (reportType === EVENTS_REPORT) {
            [workbook, isPending] = await Event.getEventReportData(eventIds, request);
            if (isPending) {
              res.status(202).send(ADMIN_MESSAGE_FOR_PENDING_FILE);
              res.end();
              return;
            }
            res.attachment(fileName);
            res.send(workbook);
            res.end();
            return;
          } else if (reportType === STALLS_REPORT) {
            [workbook, isPending] = await Stall.getStallsReport(eventIds, request);

            if (isPending) {
              res.status(202).send(ADMIN_MESSAGE_FOR_PENDING_FILE);
              res.end();
              return;
            }

            res.attachment(fileName);
            res.send(workbook);
            res.end();
            return;
          } else if (reportType === RV_REPORT) {
            [workbook, isPending] = await RVSpot.getRVReport(eventIds, request);

            if (isPending) {
              res.status(202).send(ADMIN_MESSAGE_FOR_PENDING_FILE);
              res.end();
              return;
            }

            res.attachment(fileName);
            res.send(workbook);
            res.end();
            return;
          } else if (reportType === RESERVATION_REPORT) {
            const venue = await Venue.findOne({ where: { id: venueId } });
            if (!venue) throw new Error('invalid request');
            request.body.venueTimeZone = venue.timeZone;
            [workbook, isPending] = await Reservation.getReservationReport(request.body, roleId);

            if (isPending) {
              res.status(202).send(ADMIN_MESSAGE_FOR_PENDING_FILE);
              res.end();
              return;
            }

            res.attachment(fileName);
            res.send(workbook);
            res.end();
            return;
          } else throw new Error('Invalid report type');

          if (error) throw new Error(error || 'Unable to generate report data');

          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);

          await workbook.xlsx.write(res);

          res.end();
        } catch (error) {
          const statusCode = error.message === 'No records found' ? 204 : 400;
          // eslint-disable-next-line no-console
          console.log(error);
          res.status(statusCode).send(error.message);
        }
      },
      requireAuth: true
    })
  );
};

export default adminRoutes;
