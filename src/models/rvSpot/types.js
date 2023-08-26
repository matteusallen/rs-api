// @flow

export type RVSpotType = {|
  createdAt: Date,
  description: string,
  id: string | number,
  name: string,
  rvLotId: string | number,
  updatedAt: Date
|};

export type RVSpotOptionsType = {|
  filterBy: {
    name?: string,
    rvLotId?: string | number,
    startDate?: string
  }
|};
