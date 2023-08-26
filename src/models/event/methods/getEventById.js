// @flow
import type { EventType } from '../types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getEventById(id: string | number, roleId: number): Promise<[EventType | void, string | void]> {
  validateAction(MENU.EVENTS, ACTIONS[MENU.EVENTS].GET_EVENT_BY_ID, roleId);
  const event = await this.findOne({ where: { id } });
  return [event, undefined];
}

export default getEventById;
