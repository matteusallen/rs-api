// @flow
import type { RVLotType } from 'Models/rvLot/types';
import type { RVSpotType } from 'Models/rvSpot/types';
import type { ContextType } from 'Types/context';
import { RVSpot } from 'Models';

const resolvers = {
  RVLot: {
    async rvSpots(parent: RVLotType, _: {}, context: ContextType): Promise<RVSpotType> {
      const [rvSpots] = await RVSpot.getRVSpotsByRVLotId(parent.id, context?.user?.roleId);
      return rvSpots;
    },
    async availableRVSpots(parent: RVLotType, _: {}, context: ContextType): Promise<RVSpotType> {
      const [rvSpots] = await RVSpot.getRVSpotsByRVLotId(parent.id, true, context?.user?.roleId);
      return rvSpots;
    }
  }
};

export default resolvers;
