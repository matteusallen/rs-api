// @flow
import type { ProductQuestionType } from 'Models/productQuestion/types';
import { EventQuestions } from 'Models';

type ProductQuestionsSearchInput = {
  eventId: number,
  productXRefType: number
};

async function getProductQuestionsByEventId(input: ProductQuestionsSearchInput): Promise<[ProductQuestionType]> {
  const { eventId, productXRefType } = input;

  const eventQuestions = await EventQuestions.findAll({
    where: {
      eventId
    },
    attributes: ['required', 'listOrder', 'minLength', 'maxLength'],
    include: [
      { association: 'productQuestion', attributes: ['id', 'question', 'questionType', 'answerOptions', 'productXRefType'], where: { productXRefType } }
    ]
  });

  const productQuestions = eventQuestions.map(eventQuestion => {
    const { required, listOrder, productQuestion, minLength, maxLength } = eventQuestion;
    const { id, question, questionType, answerOptions } = productQuestion;
    return { id, question, questionType, answerOptions, required, listOrder, minLength, maxLength };
  });

  return productQuestions.sort((a, b) => a.listOrder - b.listOrder);
}

export default getProductQuestionsByEventId;
