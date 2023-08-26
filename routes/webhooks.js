import validateRoute from '@praxent/praxent-validate-route';
import { Payout } from 'Models';

const gatewayToken = process.env.GATEWAY_TOKEN;
const validate = validateRoute(gatewayToken);

const baseRoute = 'webhooks';

const webhooksRoutes = app => {
  // we currently are not using this webhook for anything and more work will need to be done on stripe to get it running
  app.post(
    `/${baseRoute}/stripe`,
    validate({
      action: async (req, res) => {
        try {
          // const event = JSON.parse(req.body)
          // switch (event.type) {
          //   case 'payout.paid': {
          //     const { object: payoutPaid } = event.data
          //     // eslint-disable-next-line no-console
          //     console.log('PAYOUT PAID', payoutPaid)
          //     break
          //   }
          //   default:
          //   // we aren't handling any other webhooks
          // }
          Payout.getPayoutsFromStripe();
          res.json({ success: true });
        } catch (err) {
          res.status(400).send(`Webhook Error: ${err.message}`);
        }
      },
      requireAuth: false
    })
  );
};

export default webhooksRoutes;
