// @flow
import type { RVSpotType, RVSpotOptionsType } from 'Models/rvSpot/types';
import type { RVLotType } from 'Models/rvLot/types';
import type { ContextType } from 'Types/context';
import { RVLot, Order } from 'Models';

const resolvers = {
  RVSpot: {
    async rvLot(parent: RVSpotType, _: {}, context: ContextType): Promise<RVLotType> {
      const [rvLot] = await RVLot.getRVLotById(parent.rvLotId, context?.user?.roleId);
      return rvLot;
    },
    async nextOrder(parent: RVSpotType, options: RVSpotOptionsType, context: ContextType): {} {
      return await Order.getNextOrderByXRefTypeId(parent.id, options, 3, context?.user?.roleId);
    }
  }
};

export default resolvers;
