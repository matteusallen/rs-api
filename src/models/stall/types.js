// @flow
import type { BuildingType } from 'Models/building/types';

export type StallType = {|
  building: BuildingType,
  buildingId?: string,
  createdAt: string,
  id: string | number,
  name: string,
  updatedAt: string
|};

export type StallOptionsType = {|
  filterBy: {
    buildingId?: string | number,
    endDate?: string,
    name?: string,
    startDate?: string,
    status?: string
  }
|};
