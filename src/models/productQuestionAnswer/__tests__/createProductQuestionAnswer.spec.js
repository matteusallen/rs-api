import db from 'Models';
import { ProductQuestion, ProductQuestionAnswer } from 'Models';
import { ProductQuestionInput2, ProductQuestionAnswerBaseInput } from 'Tests/__fixtures__';

describe('Test createProductQuestionAnswer Function', () => {
  it('Creates a ProductQuestionAnswer', async () => {
    const parentTransaction = await db.sequelize.transaction();
    const productQuestion = await ProductQuestion.createProductQuestion(ProductQuestionInput2, parentTransaction);
    expect(productQuestion).toBeTruthy();

    const productQuestionAnswer = await ProductQuestionAnswer.createProductQuestionAnswer({
      ...ProductQuestionAnswerBaseInput,
      questionId: productQuestion.id
    });
    expect(productQuestionAnswer).toBeTruthy();
  });
});
