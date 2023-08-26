import db, { ProductQuestion } from 'Models';
import { ProductQuestionInput1, ProductQuestionInputWithoutProduct, ProductQuestionInputWithTwoProducts } from 'Tests/__fixtures__';

describe('Test createProductQuestion Function', () => {
  it('Creates a Product Question', async () => {
    const parentTransaction = await db.sequelize.transaction();
    const productQuestion = await ProductQuestion.createProductQuestion(ProductQuestionInput1, parentTransaction);
    await parentTransaction.commit();
    expect(productQuestion).toBeTruthy();
  });

  it('Throws error if creating same question twice', async () => {
    await expect(() => ProductQuestion.createProductQuestion(ProductQuestionInput1)).rejects.toEqual(expect.any(Error));
  });

  it('Throws error if productId is not included', async () => {
    await expect(() => ProductQuestion.createProductQuestion(ProductQuestionInputWithoutProduct)).rejects.toEqual(expect.any(Error));
  });

  it('Throws error if two products are included', async () => {
    await expect(() => ProductQuestion.createProductQuestion(ProductQuestionInputWithTwoProducts)).rejects.toEqual(expect.any(Error));
  });
});
