// @flow
import type { SSUserReturnType, SSUserInputType } from '../types';
import { ssPost } from 'Utils/ssNetworkRequests';

async function getSSUserFields(options: ?SSUserInputType): Promise<[SSUserReturnType | void, string | void]> {
  try {
    const result = await ssPost('/users', options);
    if (result && result.data) {
      return [result.data, undefined];
    }
    return [undefined, 'User does not exist'];
  } catch (error) {
    return [undefined, error];
  }
}

export default getSSUserFields;
