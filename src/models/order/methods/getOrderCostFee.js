//@flow
import { getStripeFee, getPercentageFee } from 'Utils/stripeFeeUtils';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

type OrderCostsOnEditInputType = {|
  amount: number,
  orderId: number,
  useCard: boolean,
  isNonUSCard: boolean,
  reservationAdded: boolean
|};

async function getOrderCostFee(input: OrderCostsOnEditInputType, roleId: number) {
  validateAction(MENU.ORDERS, ACTIONS[MENU.ORDERS].GET_ORDER_COST_FEE, roleId);
  try {
    const { amount, useCard, isNonUSCard, orderId, reservationAdded } = input;
    const order = await this.findOne({
      where: { id: orderId },
      include: [{ association: 'event', include: [{ association: 'venue' }] }]
    });
    const platformFee = reservationAdded ? order.event.venue.platformFee : 0;
    const totalPercentageFee = getPercentageFee(amount, true, order.event);
    const fee = getStripeFee(totalPercentageFee + amount, platformFee, useCard, isNonUSCard);
    return fee + totalPercentageFee + platformFee;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw new Error(error.message);
  }
}

export default getOrderCostFee;
