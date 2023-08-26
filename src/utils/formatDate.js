import Moment from 'moment';
import { DATE_FORMAT } from 'Constants';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

export const toUsDateInMonthWord = date => {
  const monthName = moment.utc(date).format('MMMM');
  const day = moment.utc(date).format('DD');
  const year = moment.utc(date).format('YYYY');
  return `${monthName} ${day}, ${year}`;
};

export const toUsDateTime = date => {
  return moment.utc(date).format('MM/DD/YYYY HH:mm');
};

export const toUsDate = date => {
  return moment.utc(date).format('MM-DD-YYYY');
};

export const toUsDateWithSlash = date => {
  return moment.utc(date).format('MM/DD/YYYY');
};

export const toDbDate = date => {
  return moment.utc(date).format(DATE_FORMAT);
};

export const currentDate = format => {
  return format ? moment.utc().format(format) : moment.utc().format('MM-DD-YYYY');
};

export const toCustomDate = (date, format) => {
  return moment.utc(date).format(format);
};

export const currentDbDateUTC = () => {
  return moment.utc().format(DATE_FORMAT);
};

export const isSameOrBefore = (previous, after) => {
  return moment(previous).isSameOrBefore(after);
};

export const isSameOrAfter = (after, previous) => {
  return moment(after).isSameOrAfter(previous);
};

export const isAfter = (date1, date2) => {
  return moment(date1).isAfter(date2);
};

export const isBefore = (date1, date2) => {
  return moment(date1).isBefore(date2);
};

export const isSame = (date1, date2) => {
  return moment(date1).isSame(date2);
};

export const getDbDateRange = (from, to) => {
  return Array.from(moment.range(moment.utc(from), moment.utc(to)).by('day')).map(day => day.format(DATE_FORMAT));
};

export const isBetweenExcludeTo = (date, from, to) => {
  return moment.utc(date).isBetween(from, to, 'days', '[)');
};

export const getNumberOfNights = (startDate, endDate) => {
  let diff = 0;
  if (startDate && endDate) {
    const dateStart = moment(startDate);
    const dateEnd = moment(endDate);
    if (dateStart.isValid() && dateEnd.isValid()) {
      diff = dateEnd.diff(dateStart, 'days');
      diff = diff > -1 ? diff : 0;
    }
  }
  return diff;
};

export const momentRange = (from, to) => Array.from(moment.range(from, to).by('day'));

export const mapDates = moments => moments.map(m => m.format(DATE_FORMAT));

export const datesInRange = input => {
  const productRange = moment.range(moment(input.start, DATE_FORMAT), moment(input.end, DATE_FORMAT));
  return productRange.contains(moment(input.selected.start, DATE_FORMAT)) && productRange.contains(moment(input.selected.end, DATE_FORMAT));
};

export const createDateRange = ({ startDate, endDate, selectedStartDate, pristine, isEdit }) => {
  const start = moment(startDate, DATE_FORMAT);
  const end = moment(endDate, DATE_FORMAT);

  const reservationStart = selectedStartDate ? moment(selectedStartDate, DATE_FORMAT) : null;

  const minusOne = pristine ? end.clone() : end.clone().add(-1, 'days');
  const plusOne = pristine ? end.clone() : end.clone().add(1, 'days');

  const from = momentRange(start, minusOne);
  const to = reservationStart ? momentRange(isEdit ? reservationStart : reservationStart.add(1, 'days'), plusOne) : [];

  return [mapDates(from), mapDates(to)];
};

export const subtractFromDate = (inputDate, subtraction, period) => {
  return moment(inputDate).subtract(subtraction, period).format(DATE_FORMAT);
};

export const addToDate = (inputDate, addition, period) => {
  return moment(inputDate).add(addition, period).format(DATE_FORMAT);
};

export const parseDays = (startDate, endDate, format) => {
  const [range] = createDateRange({
    startDate: subtractFromDate(startDate, 1, 'days'),
    endDate,
    pristine: true
  });

  return format ? range.map(d => moment(d, DATE_FORMAT).format(format)) : range;
};

export const getDaysFromRange = (startDate, endDate, leftOffset, rightOffset) => {
  const days = [];

  let i = leftOffset;
  while (i > 0) {
    days.push('');
    i--;
  }

  const [dateRange] = createDateRange({
    startDate: subtractFromDate(startDate, 1, 'days'),
    endDate,
    pristine: true
  });

  for (const date of dateRange) {
    days.push(moment(date).format('ddd'));
  }

  let j = rightOffset;
  while (j > 0) {
    days.push('');
    j--;
  }

  return [days];
};
