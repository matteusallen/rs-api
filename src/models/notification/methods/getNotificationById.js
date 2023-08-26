//@flow

import type { NotificationType } from '../types';

async function getNotificationById(notificationId: string): Promise<[?NotificationType, ?string]> {
  const notification = await this.findOne({ where: { id: notificationId } }).catch(err => {
    // eslint-disable-next-line no-console
    console.error(`Error finding notification with id ${notificationId}:`, err);
  });
  return [notification, undefined];
}

export default getNotificationById;
