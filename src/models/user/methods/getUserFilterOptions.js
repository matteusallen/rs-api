// @flow
import type { OptionsType } from '../types';
import { getFilterOptions } from 'Utils';

function getUserFilterOptions(options: OptionsType): {} {
  const { limit, offset, orderBy } = options;
  const ssUserFilterOptions = {
    limit,
    offset,
    order: orderBy
  };
  let userFilterOptions = { where: {} };

  if (options && options.filterBy) {
    const { id, roleId, ...ssFilters } = options.filterBy;
    Object.assign(ssUserFilterOptions, ssFilters);
    const filterOptions = { id, roleId };
    const availableOptions = Object.keys(filterOptions).reduce((prev, key) => {
      if (filterOptions[key]) {
        prev[key] = filterOptions[key];
      }
      return prev;
    }, {});
    userFilterOptions.where = Object.keys(availableOptions).length ? getFilterOptions(availableOptions) : {};
  }
  return { ssUserFilterOptions, userFilterOptions };
}

export default getUserFilterOptions;
