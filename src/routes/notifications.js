import { registerSubscriber, notifySubscriber } from 'Lib/pushNotifications';

const notificationRoutes = app => {
  app.post('/subscription', registerSubscriber);
  app.get('/subscription/:id', notifySubscriber);
};

export default notificationRoutes;
