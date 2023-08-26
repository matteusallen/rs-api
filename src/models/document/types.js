//@flow
import type { BaseModelType } from 'Types/basemodel';

export type DocumentType = BaseModelType & {|
  description: string,
  key: string,
  name: string,
  url?: string,
  userId: number,
  documentType: number,
  venueId: number
|};
