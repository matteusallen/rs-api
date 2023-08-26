//@flow
import type { OrderItemInputType } from 'Models/orderItem/types';
import { STALL_PRODUCT_X_REF_TYPE_ID, ERROR_MESSAGES } from 'Constants';
import logger from 'Config/winston';

async function findAvailabilityError(
  // eslint-disable-next-line flowtype/no-weak-types
  model: any,
  xRefTypeId: number,
  eventId: number,
  orderItems: Array<OrderItemInputType>,
  reservationId?: number,
  isRenter?: boolean,
  roleId: number
): Promise<[?string, ?string]> {
  try {
    const productIndex = orderItems.findIndex(orderItem => parseInt(orderItem.xRefTypeId) === xRefTypeId);
    const productName = xRefTypeId === STALL_PRODUCT_X_REF_TYPE_ID ? 'Stall' : 'RV Spot';

    if (productIndex > -1) {
      const productOrderItem = orderItems[productIndex];
      const startDate = productOrderItem.startDate;
      const endDate = productOrderItem.endDate;
      const productId = productOrderItem.xProductId;

      if (productOrderItem.assignments && productOrderItem.assignments.length) {
        const { assignments } = productOrderItem;
        const [spacesAvailable] = await model.getAvailableSpaces(
          {
            startDate,
            endDate,
            productId,
            reservationId
          },
          roleId
        );
        const availableSpaceIds = spacesAvailable.reduce((acc, curr) => {
          const spaceIds = curr.availableSpaces.map(availableSpace => availableSpace.id);
          acc.push(...spaceIds);
          return acc;
        }, []);
        const areSpacesStillAvailable = assignments.every(assignment => {
          return availableSpaceIds.includes(parseInt(assignment));
        });
        if (!areSpacesStillAvailable) {
          const message = ERROR_MESSAGES.UNAVAILABLE_PRODUCT_ASSIGNMENT(productName);
          return [message, undefined];
        }
      } else {
        const [availability] = await model.getAvailability(
          {
            eventId,
            startDate,
            endDate,
            reservationId,
            roleId
          },
          roleId
        );

        const selectedProductAvailability = availability.filter(data => data.productId == productId)[0];
        if (productOrderItem.quantity > selectedProductAvailability.available) {
          const message = ERROR_MESSAGES.INSUFFICIENT_PRODUCT_QUANTITY(productName);
          return [message, undefined];
        }

        const [availabileSpaces] = await model.getAvailableSpaces(
          {
            productId,
            startDate,
            endDate,
            reservationId
          },
          roleId
        );
        const availableSpacesCount = availabileSpaces.map(spaces => spaces.availableSpaces.length).reduce((curr, val) => curr + val, 0);

        if (availableSpacesCount < selectedProductAvailability.available && productOrderItem.quantity > availableSpacesCount) {
          logger.info(`availableSpacesCount: ${availableSpacesCount}`);
          logger.info(`selectedProductAvailability: ${selectedProductAvailability.available}`);
          const message = ERROR_MESSAGES.INSUFFICIENT_AVAILABLE_SPACE_COUNT(productName, isRenter);
          return [message, undefined];
        }
      }
    }

    logger.info('Availability check passed!');
    return [null, undefined];
  } catch (error) {
    return [undefined, error.message];
  }
}

export default findAvailabilityError;
