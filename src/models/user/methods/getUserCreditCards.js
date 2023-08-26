// @flow

import { ssGet } from 'Utils/ssNetworkRequests';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getUserCreditCards(globalId: string, venueData: any, roleId: number): Promise<Array<{}>> {
  validateAction(MENU.USERS, ACTIONS[MENU.USERS].GET_USER_CREDIT_CARDS, roleId);
  const [venue] = venueData;

  if (!venue) return [];

  const { stripeAccountType, stripeAccount } = venue;
  const result = await ssGet(`/payment/saved-cards?globalId=${globalId}&stripeAccount=${stripeAccount}&stripeAccountType=${stripeAccountType}`);
  return result.data.cards;
}

export default getUserCreditCards;
