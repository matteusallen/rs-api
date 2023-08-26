// @flow
export type ProductQuestionType = {|
  id: string | number,
  eventId: string | number,
  question: string,
  answerOptions?: [string],
  questionType: string
|};

export type ProductQuestionInput = {|
  question: string,
  venueId: string | number,
  eventId: string | number,
  productXRefType: string | number,
  answerOptions?: [string],
  questionType: string,
  required: boolean,
  listOrder: string | number,
  minLength?: number,
  maxLength?: number
|};
