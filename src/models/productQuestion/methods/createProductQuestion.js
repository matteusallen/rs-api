// @flow
import type { ProductQuestionInput, ProductQuestionType } from '../types';

async function createProductQuestion(input: ProductQuestionInput, { transaction }: { transaction: {} }): Promise<ProductQuestionType> {
  const { EventQuestions } = this.sequelize.models;
  const { listOrder, required, questionType, answerOptions, question, venueId, eventId, productXRefType, minLength, maxLength } = input;
  try {
    const payload = {
      question,
      answerOptions,
      questionType,
      venueId,
      productXRefType
    };
    const existingQuestion = await this.findOne({ where: payload });
    const productQuestion = existingQuestion || (await this.create(payload, { returning: true, transaction }));

    const EventQuestionPayload = {
      questionId: productQuestion.id,
      eventId,
      listOrder,
      required,
      minLength,
      maxLength
    };

    await EventQuestions.createEventQuestion(EventQuestionPayload, transaction);
    return productQuestion;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw new Error(`There was a problem creating this question. ${error}`);
  }
}

export default createProductQuestion;
