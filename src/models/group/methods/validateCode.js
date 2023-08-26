// @flow
import type { ValidateGroupCodeType } from '../types';
import type { GroupType } from '../types';

async function validateCode(input: ValidateGroupCodeType): Promise<GroupType | null> {
  try {
    const { code } = input;
    const group = await this.findOne({ where: { code } });

    if (!group || (group && group.code !== String(code).trim().toUpperCase())) return null;

    return group;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw new Error('Unable to validate group code');
  }
}

export default validateCode;
