//@flow
import type { NotificationRequestType } from '../types';

async function createNotification(notificationId: string, requestData: string, requestType: string): Promise<[?NotificationRequestType, ?string]> {
  const newNotificationRequest = this.create({ notificationId: notificationId, requestData, requestType }).catch(err => {
    // eslint-disable-next-line no-console
    if (process.env.NODE_ENV === 'development') console.error('NotificationRequest create error:', err);
  });
  return [newNotificationRequest, undefined];
}

export default createNotification;
