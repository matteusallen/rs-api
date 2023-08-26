// @flow
import type { EventType } from '../types';
import { getFilterOptions } from 'Utils';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

type FilterKeyType = 'name' | 'startDate' | 'endDate' | 'openDate';

type OptionsType = {|
  filterBy?: {
    id?: Array<number>,
    [key: FilterKeyType]: string
  },
  limit?: number,
  offset?: number,
  orderBy?: string
|};

async function getEvents(options?: OptionsType, roleId: number): Promise<Array<?EventType>> {
  validateAction(MENU.EVENTS, ACTIONS[MENU.EVENTS].GET_EVENTS, roleId);
  const filterOptions = {
    where: getFilterOptions(options && options.filterBy),
    limit: options && options.limit,
    offset: options && options.offset,
    order: options && options.orderBy && [[options.orderBy], ['createdAt', 'ASC']]
  };

  return await this.findAll(filterOptions);
}

export default getEvents;
