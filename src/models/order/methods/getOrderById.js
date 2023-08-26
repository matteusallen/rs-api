// @flow

import type { OrderType } from '../types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getOrderById(id: number, roleId: number): Promise<[OrderType | void, string | void]> {
  validateAction(MENU.ORDERS, ACTIONS[MENU.ORDERS].GET_ORDER_BY_ID, roleId);
  try {
    const order = await this.findOne({ where: { id } });
    return [order, undefined];
  } catch (error) {
    return [undefined, error];
  }
}

export default getOrderById;
