import { toUsDateTime, toUsDateWithSlash } from '../../../../utils/formatDate';
import formatPhoneNumber from '../../../../utils/formatPhoneNumber';
import { PRODUCT_XREF_TYPES } from '../../../../constants/productXrefTypes';

export const getReservations = (orders, users) => {
  const addOnColumns = new Set();
  const rvquestionColumns = new Set();
  const stallQuestionColumns = new Set();

  const rows = orders.map(order => {
    const row = {
      ...getUsersData(order, users),
      ...getRVData(order),
      ...getRVQuestions(order, rvquestionColumns),
      ...getStallData(order),
      ...getAddOnsData(order, addOnColumns),
      ...getStallQuestions(order, stallQuestionColumns),
      ...getSpecialRequest(order)
    };

    return row;
  });

  const filledRows = fillEmptyAddOnsAndQuestions(rows, addOnColumns, rvquestionColumns, stallQuestionColumns);
  sortData(filledRows);
  const columnNames = getColumnNames(addOnColumns, rvquestionColumns, stallQuestionColumns);
  return [filledRows, columnNames];
};

const getUsersData = (order, users) => {
  const [userName, userPhone] = getUserInfo(users, order.userId);

  return {
    renterName: userName,
    ...getTransDate(order),
    renterPhone: formatPhoneNumber(userPhone)
  };
};

const getUserInfo = (users, userId) => {
  const user = users.find(user => user.id === userId);
  const userName = user ? `${user.lastName}, ${user.firstName}`.toUpperCase() : '-';

  return [userName, user.phone];
};

const getTransDate = order => {
  return {
    transDate: toUsDateTime(order.createdAt)
  };
};

const getRVData = order => {
  const rvOrderItem = order.orderItems.find(isRV);
  if (!rvOrderItem) {
    return getRVEmptyData();
  }
  const lots = new Set();
  const assignments = new Set();

  rvOrderItem.reservation.reservationSpaces.map(space => {
    lots.add(space.rvSpot.rvLot.name);
    assignments.add(space.rvSpot.name.replace(/[\r\n]/gm, ''));
  });

  return {
    ...fillReservationDates(rvOrderItem, 'rv'),
    rvQty: rvOrderItem.quantity,
    rvLots: [...lots].join(', ') || '-',
    rvAssignments: [...assignments].join(', ') || '-'
  };
};

const isRV = orderItem => {
  return orderItem?.xRefTypeId === PRODUCT_XREF_TYPES.RESERVATIONS && orderItem.reservation?.xRefTypeId === PRODUCT_XREF_TYPES.RVS;
};

const getRVEmptyData = () => {
  return { rvStartDate: '-', rvEndDate: '-', rvQty: '-', rvLots: '-', rvAssignments: '-' };
};

const fillReservationDates = (orderItem, productName) => {
  const { startDate, endDate } = orderItem.reservation;
  const reservationDates = {};
  reservationDates[`${productName}StartDate`] = startDate ? toUsDateWithSlash(startDate) : '-';
  reservationDates[`${productName}EndDate`] = endDate ? toUsDateWithSlash(endDate) : '-';

  return reservationDates;
};

const getRVQuestions = (order, rvQuestionColumns) => {
  const productQuestionAnswers = order.productQuestionAnswers.filter(answer => {
    return answer.productQuestion.productXRefType === PRODUCT_XREF_TYPES.RVS;
  });

  const rvQuestions = getQuestionsData(productQuestionAnswers, rvQuestionColumns, '-rv-');
  return rvQuestions;
};

const getStallData = order => {
  const stallOrderItem = order.orderItems.find(isStall);
  if (!stallOrderItem) {
    return getStallEmptyData();
  }
  const barns = new Set();
  const assignments = new Set();

  stallOrderItem.reservation.reservationSpaces.map(space => {
    barns.add(space.stall.building.name);
    assignments.add(space.stall.name);
  });

  return {
    ...fillReservationDates(stallOrderItem, 'stall'),
    stallQty: stallOrderItem.quantity,
    stallBarns: [...barns].join(', ') || '-',
    stallAssignments: [...assignments].join(', ') || '-'
  };
};

const isStall = orderItem => {
  return orderItem?.xRefTypeId === PRODUCT_XREF_TYPES.RESERVATIONS && orderItem.reservation?.xRefTypeId === PRODUCT_XREF_TYPES.STALLS;
};

const getStallEmptyData = () => {
  return { stallStartDate: '-', stallEndDate: '-', stallQty: '-', stallBarns: '-', stallAssignments: '-' };
};

const getAddOnsData = (order, addOnsColumns) => {
  const addOnOrderItems = order.orderItems.filter(isAddOn);
  const addOnNames = {};

  addOnOrderItems.forEach(orderItem => {
    addOnsColumns.add(orderItem.addOnProduct.addOn.name);
    addOnNames[orderItem.addOnProduct.addOn.name] = orderItem.quantity;
  });

  return addOnNames;
};

const isAddOn = orderItem => {
  return orderItem?.xRefTypeId === PRODUCT_XREF_TYPES.ADDONS;
};

const getStallQuestions = (order, stallQuestionColumns) => {
  const productQuestionAnswers = order.productQuestionAnswers.filter(answer => {
    return answer.productQuestion.productXRefType === PRODUCT_XREF_TYPES.STALLS;
  });

  const stallQuestions = getQuestionsData(productQuestionAnswers, stallQuestionColumns, '-stall-');
  return stallQuestions;
};

const getQuestionsData = (productQuestionAnswers, questionColumns, prefix) => {
  const questions = {};
  productQuestionAnswers.forEach(productQuestionAnswer => {
    questionColumns.add(productQuestionAnswer.productQuestion.question);
    questions[`${prefix}${productQuestionAnswer.productQuestion.question}`] = productQuestionAnswer.answer.join(', ') || '-';
  });

  return questions;
};

const getSpecialRequest = order => {
  return { specialRequests: order.notes ?? '-' };
};

const getColumnNames = (addOnColumns, rvquestionColumns, stallQuestionColumns) => {
  return [
    'Renter name',
    'Trans date & Time',
    'Phone number',
    'RV start date',
    'RV end date',
    'RV qty',
    'RV Lot',
    'RV Lot assignment',
    ...rvquestionColumns,
    'Stall start date',
    'Stall end date',
    'Stall qty',
    'Stall Barn name',
    'Stall assignment',
    ...addOnColumns,
    ...stallQuestionColumns,
    'Special Requests'
  ];
};

const fillEmptyAddOnsAndQuestions = (rows, addOnColumns, rvquestionColumns, stallQuestionColumns) => {
  const filledRows = rows.map(row => {
    const addOnsProps = fillEmptyProps(addOnColumns, row, '');
    const rvQuestionProps = fillEmptyProps(rvquestionColumns, row, '-rv-');
    const stallQuestionsProps = fillEmptyProps(stallQuestionColumns, row, '-stall-');

    const filledRow = {
      renterName: row.renterName,
      transDate: row.transDate,
      renterPhone: row.renterPhone,
      rvStartDate: row.rvStartDate,
      rvEndDate: row.rvEndDate,
      rvQty: row.rvQty,
      rvLots: row.rvLots,
      rvAssignments: row.rvAssignments,
      ...rvQuestionProps,
      stallStartDate: row.stallStartDate,
      stallEndDate: row.stallEndDate,
      stallQty: row.stallQty,
      stallBarns: row.stallBarns,
      stallAssignments: row.stallAssignments,
      ...addOnsProps,
      ...stallQuestionsProps,
      specialRequests: row.specialRequests
    };

    return Object.values(filledRow);
  });

  return filledRows;
};

const fillEmptyProps = (columns, row, prefix) => {
  return [...columns].reduce((acc, curr) => {
    acc[`${prefix}${curr}`] = row[`${prefix}${curr}`] ?? '-';
    return acc;
  }, {});
};

const sortData = worksheetData => {
  const RENTER_NAME_INDEX = 0;
  worksheetData.sort((a, b) => {
    return !!a && !!b ? a[RENTER_NAME_INDEX].localeCompare(b[RENTER_NAME_INDEX], 'en', { numeric: true }) : 0;
  });

  worksheetData.push(['divider-top']);
};
