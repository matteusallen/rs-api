import validateRoute from '@praxent/praxent-validate-route';
import Bugsnag from '@bugsnag/js';
import { Stall, User } from 'Models';

const gatewayToken = process.env.GATEWAY_TOKEN;
const validate = validateRoute(gatewayToken);

const baseRoute = 'ops';

const opsRoutes = app => {
  app.post(
    `/${baseRoute}/stalls-report`,
    validate({
      action: async (req, res) => {
        const user = await User.getUser({ id: req.body.userId });
        const [workbook, error] = await Stall.stallsReport(req.body, user.payload.roleId);
        if (error) {
          Bugsnag.notify(new Error(error));
          return res.json({ success: false, error });
        }
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=' + `StallsReport.xlsx`);
        await workbook.xlsx.write(res);
        res.end();
      },
      requireAuth: true
    })
  );
};

export default opsRoutes;
