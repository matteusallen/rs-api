// @flow
import type { EventAndProductsInfoInputType } from '../types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function updateEventInfo(input: EventAndProductsInfoInputType, transaction: {}, roleId: number) {
  validateAction(MENU.EVENTS, ACTIONS[MENU.EVENTS].UPDATE_EVENT_INFO, roleId);
  try {
    const { id, name, description } = input;
    const event = await this.findOne({ where: { id } });
    event.name = name || event.name;
    event.description = description || event.description;
    await event.save({ transaction });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

export default updateEventInfo;
