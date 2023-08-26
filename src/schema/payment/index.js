// @flow
import type { PaymentType } from 'Models/payment/types';
import type { UserType } from 'Models/user/types';
import type { OrderType } from 'Models/order/types';
import type { ContextType } from 'Types/context';
import { User, Order } from 'Models';

const Query = {};

const resolvers = {
  Query,
  Payment: {
    admin(parent: PaymentType, _: {}, context: ContextType): Promise<UserType> | null {
      if (!parent.adminId) return null;
      return User.getUser({ id: parent.adminId }, context?.user?.roleId);
    },
    order(parent: PaymentType): Promise<OrderType> | null {
      if (!parent.orderId) {
        return null;
      }
      return Order.getOrder(parent.orderId);
    }
  }
};

export default resolvers;
