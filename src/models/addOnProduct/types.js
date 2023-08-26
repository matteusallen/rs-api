// @flow
export type AddOnProductType = {|
  addOnId: string | number,
  createdAt: Date,
  eventId: string | number,
  id: string | number,
  price: number,
  updatedAt: Date
|};

export type AddOnProductInputType = {|
  addOnId: string | number,
  eventId: string | number,
  id?: string | number,
  price: number,
  disabled: boolean
|};
