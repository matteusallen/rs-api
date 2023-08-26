// @flow
export type EventQuestionType = {|
  id: string | number,
  eventId: string | number,
  listOrder: string | number,
  questionId: string | number,
  required: boolean
|};

// @flow
export type EventQuestionInput = {|
  eventId: string | number,
  listOrder: string | number,
  questionId: string | number,
  required: boolean,
  minLength?: number,
  maxLength?: number
|};
