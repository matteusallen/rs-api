//@flow

import type { NotificationType } from '../types';

async function getNotificationsBySSUserId(ssGlobalId: string): Promise<[?NotificationType, ?string]> {
  const notification = await this.findAll({ where: { ssGlobalId } }).catch(err => {
    // eslint-disable-next-line no-console
    console.error(`Error finding notification with ssUserId ${ssGlobalId}:`, err);
  });
  return [notification, undefined];
}

export default getNotificationsBySSUserId;
