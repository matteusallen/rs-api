// @flow
import type { ProductQuestionProductType } from '../types';

async function createProductQuestionProduct(input: ProductQuestionProductType, transaction: {}): Promise<void> {
  await this.create(input, { transaction });
}

export default createProductQuestionProduct;
