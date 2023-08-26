// @flow
import type { ProductQuestionAnswerType } from 'Models/productQuestionAnswer/types';

type ProductQuestionAnswersSearchInput = {
  orderId: number,
  eventId: number,
  productXRefType: number
};

async function getProductQuestionAnswerByOrderId(input: ProductQuestionAnswersSearchInput): Promise<[ProductQuestionAnswerType]> {
  const { orderId, productXRefType, eventId } = input;

  const questionAnswers = await this.findAll({
    where: {
      orderId
    },
    attributes: ['id', 'questionId', 'answer'],
    include: [
      {
        association: 'productQuestion',
        attributes: ['id', 'question', 'questionType', 'answerOptions', 'productXRefType'],
        where: { productXRefType },
        include: [
          {
            association: 'eventQuestions',
            attributes: ['required', 'minLength', 'maxLength'],
            where: { eventId }
          }
        ]
      }
    ]
  });

  const productQuestionsAnswers = questionAnswers.map(questionAnswer => {
    const { id, questionId, answer, productQuestion } = questionAnswer;
    const { question, questionType, answerOptions, eventQuestions } = productQuestion;
    const { required, minLength, maxLength } = eventQuestions[0];

    return { id, questionId, question, questionType, answerOptions, answer, required, minLength, maxLength };
  });

  return productQuestionsAnswers;
}

export default getProductQuestionAnswerByOrderId;
