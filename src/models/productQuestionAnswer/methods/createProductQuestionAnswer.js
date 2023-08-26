// @flow
import type { ProductQuestionAnswerInput } from '../types';

async function createProductQuestionAnswer(input: ProductQuestionAnswerInput, transaction: {}): Promise<number> {
  try {
    const productQuestionAnswer = await this.create(input, { transaction });
    return productQuestionAnswer.id;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw new Error(`There was a problem creating this answer. ${error}`);
  }
}

export default createProductQuestionAnswer;
