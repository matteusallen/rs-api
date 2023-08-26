// @flow
import type { StallType } from '../types';

async function getStallsById(stallIds: Array<number | string>): Promise<[?Array<StallType>, ?string]> {
  const stalls = await this.findAll({ where: { id: stallIds } });
  return [stalls, undefined];
}

export default getStallsById;
