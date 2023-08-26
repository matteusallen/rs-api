// @flow
import type { ReservationType } from 'Models/reservation/types';
import type { StallType } from 'Models/stall/types';
import type { RVSpotType } from 'Models/rvSpot/types';
import type { StallProductType } from 'Models/stallProduct/types';
import type { RVProductType } from 'Models/rvProduct/types';
import type { ReservationStatusType } from 'Models/reservationStatus/types';
import type { ContextType } from 'Types/context';
import db, { ReservationStatus, ReservationSpace, StallProduct, RVProduct } from 'Models';
import { admin } from 'Lib/auth';

const updateReservationStatus = async (_: {}, { input }, context: ContextType) => {
  const transaction = await db.sequelize.transaction();
  const [reservation, reservationError] = await ReservationStatus.updateReservationStatus(input, transaction, context?.user?.roleId);
  if (reservationError) {
    await transaction.rollback();
    return {
      success: false,
      error: reservationError
    };
  }
  await transaction.commit();
  return {
    reservation,
    success: true
  };
};

const Mutation = {
  updateReservationStatus: admin(updateReservationStatus)
};

const resolvers = {
  Mutation,
  Reservation: {
    async status(parent: ReservationType, _: {}, context: ContextType): Promise<ReservationStatusType> {
      const [reservationStatus] = await ReservationStatus.getReservationStatusById(parent.statusId, context?.user?.roleId);
      return reservationStatus;
    },
    async stalls(parent: ReservationType, _: {}, context: ContextType): Promise<?Array<StallType>> {
      if (parseInt(parent.xRefTypeId) === 1) {
        const [stalls] = await ReservationSpace.getReservationSpaces(1, parent.id, context?.user?.roleId);
        return stalls;
      }
      return undefined;
    },
    async stallProduct(parent: ReservationType, _: {}, context: ContextType): Promise<?StallProductType> {
      if (parseInt(parent.xRefTypeId) === 1) {
        const [stallProduct] = await StallProduct.getStallProductById(parent.xProductId, context?.user?.roleId);
        return stallProduct;
      }
      return undefined;
    },
    async rvSpots(parent: ReservationType, _: {}, context: ContextType): Promise<?Array<RVSpotType>> {
      if (parseInt(parent.xRefTypeId) === 3) {
        const [rvSpots] = await ReservationSpace.getReservationSpaces(3, parent.id, context?.user?.roleId);
        return rvSpots;
      }
      return undefined;
    },
    async rvProduct(parent: ReservationType, _: {}, context: ContextType): Promise<?RVProductType> {
      if (parseInt(parent.xRefTypeId) === 3) {
        const [rvProduct] = await RVProduct.getRVProductById(parent.xProductId, context?.user?.roleId);
        return rvProduct;
      }
      return undefined;
    }
  }
};

export default resolvers;
