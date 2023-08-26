// @flow
import type { ProductXRefType } from '../types';

/**
 * Example:
 * {"1":"StallProduct","2":"AddOnProduct","3":"RVProduct","4":"Reservation"}
 *
 * @returns {Promise<[Instance[], undefined]>}
 */
async function getAllProductXRefTypes(): Promise<[?ProductXRefType, ?string]> {
  const productXRefTypes = await this.findAll();
  return [productXRefTypes, undefined];
}

export default getAllProductXRefTypes;
