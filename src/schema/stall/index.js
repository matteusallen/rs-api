// @flow
import type { BuildingType } from 'Models/building/types';
import type { StallOptionsType, StallType } from 'Models/stall/types';
import { Stall, Building, Order } from 'Models';
import type { ContextType } from 'Types/context';
import { adminOrOps } from 'Lib/auth';

const updateStallStatus = (_, { input }, context) => {
  return Stall.updateStallStatus(input, context?.user?.roleId).then(({ payload, error, success }) => ({
    stall: payload,
    error,
    success
  }));
};

const Mutation = {
  updateStallStatus: adminOrOps(updateStallStatus)
};

const resolvers = {
  Mutation,
  Stall: {
    async building(parent: StallType, _: {}, context: ContextType): Promise<BuildingType> {
      const [building] = await Building.getBuildingById(parent.buildingId, context?.user?.roleId);
      return building;
    },
    async currentOrder(parent: StallType, options: StallOptionsType, context: ContextType): {} {
      return await Order.getOrderByStall(parent.id, options, context?.user?.roleId);
    },
    async nextOrder(parent: StallType, options: StallOptionsType, context: ContextType): {} {
      return await Order.getNextOrderByXRefTypeId(parent.id, options, 1, context?.user?.roleId);
    }
  }
};

export default resolvers;
