//@flow

import type { NotificationType, WebPushSubscriptionType } from '../types';
// $FlowFixMe
import { UserType } from 'Models/user/types';

async function createNotification(notificationId: string, subscriptionObject: WebPushSubscriptionType, user: UserType): Promise<[?NotificationType, ?string]> {
  const { ssGlobalId } = user;
  const newNotification = this.create({
    id: notificationId,
    subscription: subscriptionObject,
    ssGlobalId
  }).catch(err => {
    // eslint-disable-next-line no-console
    console.error('Notification create error:', err);
  });
  return [newNotification, undefined];
}

export default createNotification;
