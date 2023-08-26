// @flow
export type ProductQuestionAnswerInput = {|
  questionId: string | number,
  orderId: string | number,
  answer: [string]
|};

export type ProductQuestionAnswerType = {|
  id: string | number,
  question: string,
  answerOptions: [string],
  questionType: string,
  required: boolean,
  questionId: string | number,
  answer: [string]
|};
