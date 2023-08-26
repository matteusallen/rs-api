const { Op } = require('sequelize');
const moment = require('moment');

function getFilterOptions(filters) {
  if (!filters) return {};
  const whereFilter = Object.entries(filters).reduce((acc, [prop, value]) => {
    let opWithValue;
    switch (prop) {
      case 'startDate':
        opWithValue = { [Op.gte]: value };
        break;
      case 'endDate':
        opWithValue = { [Op.gte]: moment.utc(value) };
        break;
      case 'createdAt':
        opWithValue = { [Op.eq]: new Date(value) };
        break;
      case 'openDate':
        opWithValue = { [Op.lte]: moment.utc(value) };
        break;
      case 'id':
        opWithValue = { [Op.in]: value };
        break;
      case 'roleId':
        opWithValue = { [Op.in]: value };
        break;
      case 'venueId':
        opWithValue = { [Op.eq]: value };
        break;
      default:
        opWithValue = { [Op.iLike]: `%${String(value)}%` };
        break;
    }
    return Object.assign(acc, { [prop]: opWithValue });
  }, {});
  if (Object.prototype.hasOwnProperty.call(whereFilter, 'startDate') && Object.prototype.hasOwnProperty.call(whereFilter, 'endDate')) {
    delete whereFilter.startDate;
    delete whereFilter.endDate;
    whereFilter[Op.or] = {
      startDate: { [Op.between]: [filters.startDate, filters.endDate] },
      endDate: { [Op.between]: [filters.startDate, filters.endDate] }
    };
  }
  return whereFilter;
}

export default getFilterOptions;
