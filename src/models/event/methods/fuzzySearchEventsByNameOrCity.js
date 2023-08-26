// @flow
import type { EventSearchType } from '../types';
import { QueryTypes } from 'sequelize';
import logger from 'Config/winston';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

type searchInputType = {
  name: string,
  limit?: number,
  offset?: number,
  venueId?: number,
  searchAll?: boolean
};

async function fuzzySearchEventsByNameOrCity(input: searchInputType, roleId: number): Promise<[EventSearchType]> {
  try {
    validateAction(MENU.EVENTS, ACTIONS[MENU.EVENTS].FUZZY_SEARCH_EVENTS_BY_NAME_OR_CITY, roleId);
    const { name, limit, offset, searchAll, venueId } = input;
    const events = await this.sequelize.query(
      `SELECT
      e.id, e.name, e."startDate", e."endDate", e."openDate", e."closeDate", json_build_object('id', v.id, 'phone', v.phone, 'timeZone', v."timeZone", 'city', v.city, 'state', v.state, 'name', v.name) as venue
      FROM "public"."Event" e
      JOIN "public"."Venue" v
      on e."venueId" = v.id
      ${venueId ? 'AND v.id=:venueId' : ''}
      ${searchAll ? '' : 'AND e."endDate" >= CURRENT_DATE'}
      AND (:name % ANY(STRING_TO_ARRAY(e.name,' ')) OR :name % ANY(STRING_TO_ARRAY(v.city,' ')))
      ORDER BY e."endDate" ASC
      LIMIT ${limit ? ':limit' : 10}
      ${offset ? 'OFFSET :offset' : ''}`,
      {
        replacements: { name, limit, offset, venueId },
        type: QueryTypes.SELECT
      }
    );

    return events;
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
}

export default fuzzySearchEventsByNameOrCity;
