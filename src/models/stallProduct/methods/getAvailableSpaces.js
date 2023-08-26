// @flow
import type { SpaceAvailabilityInputType, SpaceAvailabilityReturnType } from 'Models/venue/types';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function getAvailableSpaces(input: SpaceAvailabilityInputType, roleId: number): SpaceAvailabilityReturnType {
  validateAction(MENU.STALL_PRODUCTS, ACTIONS[MENU.STALL_PRODUCTS].GET_AVAILABLE_SPACES, roleId);
  try {
    const { Venue } = this.sequelize.models;
    const { productId, startDate, endDate, reservationId, includeCurrentReservation } = input;
    const [availability] = await Venue.getAvailableSpaces(
      {
        xRefTypeId: 1,
        productId,
        startDate,
        endDate,
        reservationId,
        includeCurrentReservation
      },
      roleId
    );
    return [availability, undefined];
  } catch (error) {
    return [undefined, error];
  }
}

export default getAvailableSpaces;
