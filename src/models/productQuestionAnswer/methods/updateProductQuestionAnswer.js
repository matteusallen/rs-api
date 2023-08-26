// @flow
import type { ProductQuestionAnswerType } from '../types';

type UpdateProductQuestionAnswerType = {|
  id: number | String,
  answer: string[]
|};

async function updateProductQuestionAnswer(input: UpdateProductQuestionAnswerType, transaction: {}): Promise<ProductQuestionAnswerType> {
  const { id, answer } = input;
  const questionAnswer = await this.findOne({ where: { id } });
  if (!questionAnswer) throw new Error('Previous QuestionAnswer was not found');

  questionAnswer.answer = answer || questionAnswer.answer;
  await questionAnswer.save({ transaction });

  return questionAnswer;
}

export default updateProductQuestionAnswer;
