// @flow
import type { OrderItemType } from 'Models/orderItem/types';
import type { ReservationType } from 'Models/reservation/types';
import type { AddOnProductType } from 'Models/addOnProduct/types';
import type { ContextType } from 'Types/context';
import { Reservation, AddOnProduct } from 'Models';

const resolvers = {
  OrderItem: {
    async reservation(parent: OrderItemType, _: {}, context: ContextType): Promise<?ReservationType> {
      if (parseInt(parent.xRefTypeId) === 4) {
        const [reservation] = await Reservation.getReservationById(parent.xProductId, context?.user?.roleId);
        return reservation;
      }
      return undefined;
    },
    async addOnProduct(parent: OrderItemType, _: {}, context: ContextType): Promise<?AddOnProductType> {
      if (parseInt(parent.xRefTypeId) === 2) {
        const [addOnProduct] = await AddOnProduct.getAddOnProductById(parent.xProductId, context?.user?.roleId);
        return addOnProduct;
      }
      return undefined;
    }
  }
};

export default resolvers;
