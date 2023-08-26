import { Op } from 'sequelize';
import moment from 'moment-timezone';
import { populateTemplate } from '../../../../utils/reportHelpers';
import { getEvents, getOrders, getUsers } from './queries';
import { getReservations } from './reservationBuilder';

const getReservationReport = async ({ eventIds, start, end, venueTimeZone, venueId }, roleId) => {
  const events = await getEvents(eventIds);
  const workbookData = [];

  for (const event of events) {
    await addEventSheet(workbookData, event, roleId);
  }

  if (start && end) {
    await addDateSheet(workbookData, venueId, start, end, venueTimeZone, roleId);
  }

  const workbook = await populateTemplate(workbookData, 'src/assets/reservation-report-template.xlsx', 'Reservation Report', 0, 10, true);
  return [workbook, false];
};

const addEventSheet = async (workbookData, event, roleId) => {
  const whereClause = { eventId: event.id };
  const sheetData = await getSheetData(whereClause, roleId, event.name, event.name);
  workbookData.push(sheetData);
};

const getSheetData = async (whereClause, roleId, title, sheetName) => {
  const orders = await getOrders(whereClause);
  const users = await getUsers(orders, roleId);
  const [data, headerLabels] = getReservations(orders, users);
  const sheetData = { data, headerLabels: [headerLabels], title, sheetName };
  return sheetData;
};

const addDateSheet = async (workbookData, venueId, start, end, venueTimeZone, roleId) => {
  const whereClause = getWhereClause(venueId, start, end, venueTimeZone);
  const title = getDateTitle(start, end);

  const sheetData = await getSheetData(whereClause, roleId, title, 'Reservations');
  workbookData.push(sheetData);
};

const getWhereClause = (venueId, start, end, venueTimeZone) => {
  const whereClause = {
    '$event.venueId$': +venueId,
    createdAt: { [Op.between]: [moment(start).tz(venueTimeZone).startOf('day'), moment(end).tz(venueTimeZone).endOf('day')] }
  };

  return whereClause;
};

const getDateTitle = (start, end) => {
  const startDate = start ? moment(start).format('MM/DD/YYYY') : '';
  const endDate = end ? moment(end).format('MM/DD/YYYY') : '';
  return `${startDate}-${endDate}`;
};

export default getReservationReport;
