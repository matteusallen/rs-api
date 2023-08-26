// @flow
import type { RVSpotType } from '../types';

async function getRVSpotsById(rvSpotIds: Array<number | string>): Promise<[?Array<RVSpotType>, ?string]> {
  const rvSpots = await this.findAll({ where: { id: rvSpotIds } });
  return [rvSpots, undefined];
}

export default getRVSpotsById;
