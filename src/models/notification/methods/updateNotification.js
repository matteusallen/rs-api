//@flow

import type { NotificationType } from '../types';

async function updateNotification(notificationId: string, ssGlobalId: number): Promise<[?NotificationType, ?string]> {
  const notification = await this.findOne({ where: { id: notificationId } });
  if (!notification) {
    const errorMessage = `Notification with id ${notificationId} not found.`;
    // eslint-disable-next-line no-console
    console.error(errorMessage);
    return [undefined, errorMessage];
  }
  notification.ssGlobalId = ssGlobalId;
  const updatedNotification = await notification.save({ fields: ['ssGlobalId'] });
  return [updatedNotification, undefined];
}

export default updateNotification;
