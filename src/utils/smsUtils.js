// @flow
import type { ReservationType } from 'Models/reservation/types';
import type { EventType } from 'Models/event/types';
import { startCase } from './stringHelpers';
import productXRefTypeHelper from './productXRefTypeHelper';

interface GetSMSIntroMessage {
  (userName: string, reservation: ReservationType, event: EventType): string;
}

/**
 * @returns {string}'<UserName>, thank you for using Open Stalls for RV reservations at <venue_name>
 */
const getSMSIntroMessage: GetSMSIntroMessage = (userName: string, reservation: ReservationType, event: EventType) => {
  const reservationTypeName = productXRefTypeHelper.isRvProduct(reservation.xRefTypeId) ? 'RV' : 'stall';
  const venueName = event && event.venue ? event.venue.name || '' : '';
  if (venueName) {
    return `${startCase(userName)}, thank you for using Open Stalls for your ${reservationTypeName} reservations at ${venueName}.`;
  }
  return `${startCase(userName)}, thank you for using Open Stalls for your ${reservationTypeName} reservations.`;
};

type AssignmentsMapType = {|
  [string]: Array<string>
|};

const createSMSAssignmentMessage = (assignmentsMap: AssignmentsMapType, singularMessage: string = 'stall'): [] => {
  const assigmentMessages = [];
  Object.entries(assignmentsMap).forEach(item => {
    let hasMultipleAssignments = false;
    const location = item[0] || '';
    const spots: mixed = item[1] || [];
    let namesFragment: string;
    if (Array.isArray(spots) && !!spots) {
      if (spots.length > 1) {
        hasMultipleAssignments = true;
        namesFragment = `${spots.slice(0, spots.length - 1).join(', ')}`;
        // $FlowFixMe
        namesFragment += ` and ${spots.slice(spots.length - 1)}`;
      } else {
        // $FlowFixMe
        namesFragment = `${spots[0]}`;
      }

      assigmentMessages.push(`${hasMultipleAssignments ? singularMessage + 's' : singularMessage} ${namesFragment} in ${location}`);
    }
  });
  return assigmentMessages;
};

export default {
  createSMSAssignmentMessage,
  getSMSIntroMessage
};
