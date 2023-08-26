import { Notification, User } from 'Models';
// eslint-disable-next-line import/no-extraneous-dependencies
const crypto = require('crypto');
const webPush = require('web-push');

const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env;

webPush.setVapidDetails('mailto:support@rodeologistics.co', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

/**
 * Helper to generate hash based IDs for notification table / model.
 * @param {Object} subscriptionObject
 * @returns {string}
 */
export function createHash(subscriptionObject) {
  const serializedSubscription = JSON.stringify(subscriptionObject);
  const md5sum = crypto.createHash('md5');
  md5sum.update(Buffer.from(serializedSubscription));
  return md5sum.digest('hex');
}

/**
 * Accepts request to create either a new subscription or update existing one, based on client service worker generated
 * subscription object.
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<*>}
 */
export async function registerSubscriber(req, res) {
  const { body: subscriptionPayload } = req;
  const { payload: user } = await User.getUser({ id: req.headers['user-id'] });
  const subscriptionHash = createHash(subscriptionPayload);
  try {
    const [existingNotification] = await Notification.getNotificationById(subscriptionHash);
    const [notifications] = await Notification.getNotificationsBySSUserId(user.ssGlobalId);
    const existingNotificationMatchesUser = [...notifications].find(notification => {
      return notification.id === subscriptionHash;
    });
    if (!existingNotification) {
      await Notification.createNotification(subscriptionHash, subscriptionPayload, user);
    } else if (existingNotification && !existingNotificationMatchesUser) {
      await Notification.updateNotification(subscriptionHash, user.ssGlobalId);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error creating notification:', err);
    return res.status(500).json({ error: 'Create failed' });
  }
  return res.status(201).json({ id: subscriptionHash });
}

/**
 * Helper function to perform actual push to client.
 * @param {Object} subscription
 * @param {string} downloadLink
 * @returns {*}
 */
export function notifySubscriberHelper(subscription, downloadLink) {
  return webPush.sendNotification(
    subscription,
    JSON.stringify({
      title: 'Rodeo Logistics',
      text: 'Your report is ready for download.',
      downloadLink
    })
  );
}

/**
 * For demo page only, possibly refactor and remove later.
 * @param {Object} req
 * @param {Object} res
 * @returns {Bluebird<R>} * - a promise
 */
export async function notifySubscriber(req, res) {
  const { id: notificationId } = req.params;
  const [notification] = await Notification.getNotificationById(notificationId);

  return notifySubscriberHelper(notification.subscription, 'https://www.rodeologistics.co/')
    .then(pushResult => {
      return res.status((pushResult && pushResult.statusCode) || 202).send();
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      console.error('Error pushing notification:', err);
      return res.status(500).send();
    });
}

export default {
  registerSubscriber,
  createHash,
  notifySubscriber,
  notifySubscriberHelper
};
