// @flow
import type { AddOnType } from '../types';

async function getAllAddOns(): Promise<[?AddOnType, ?string]> {
  const addOns = await this.findAll();
  return [addOns, undefined];
}

export default getAllAddOns;
