// @flow
import type { EventQuestionInput } from '../types';

async function createEventQuestion(input: EventQuestionInput, transaction: {}): Promise<void> {
  await this.create(input, { transaction });
}

export default createEventQuestion;
