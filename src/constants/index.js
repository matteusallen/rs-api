export const DB_DATE_FORMAT = 'YYYY-MM-DD';
export const STALL_PRODUCT_X_REF_TYPE_ID = 1;
export const ADD_ON_PRODUCT_X_REF_TYPE_ID = 2;
export const RV_PRODUCT_X_REF_TYPE_ID = 3;
export const RESERVATION_X_REF_TYPE_ID = 4;
export const STRIPE_ACCOUNT_TYPE = {
  express: 'express',
  standard: 'standard'
};
export const ORDER_HISTORY_CHANGE_TYPES = {
  orderChange: 'orderChange',
  orderCancellation: 'orderCancellation',
  specialRefund: 'specialRefund'
};
export const DATE_FORMAT = 'YYYY-MM-DD';

export const RENTER_GROUP_CODE_MODE = {
  SECURED: 'secured',
  UNSECURED: 'unsecured'
};

export const transactionReportByDateDisclaimer = `* Due to the dates selected, this report may not contain all transactions associated with each event in the report.
* All deferred payments are pulled at the time of report generation based on their current reservation details.
* Special Refunds only reflect order subtotal and total.  Itemized product totals have not been updated.`;
export const transactionReportDisclaimer = `* All deferred payments are pulled at the time of report generation based on their current reservation details.
* Special Refunds only reflect order subtotal and total.  Itemized product totals have not been updated.`;
export const creditReportDisclaimer = `* May include an event with a partial reporting period`;
export const cashReportDisclaimer = `* May include an event with a partial reporting period`;

export const REPORT_MERGED_COLUMN_NAMES = ['Total qty', 'Unit price', 'Total'];
export const REPORT_AMOUNT_FORMATTED_COLUMNS = ['Unit price', 'Total', 'Total price', 'Sub total', 'ROLO fee', 'Stripe fee'];
export const REPORT_SPECIAL_HEADERS = ['Products sold', 'Total qty sold'];
export const REPORT_COLUMNS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  'AA',
  'AB',
  'AC',
  'AD',
  'AE',
  'AF',
  'AG',
  'AH',
  'AI',
  'AJ',
  'AK',
  'AL',
  'AM',
  'AN',
  'AO',
  'AP',
  'AQ',
  'AR',
  'AS',
  'AT',
  'AU',
  'AV',
  'AW',
  'AX',
  'AY',
  'AZ',
  'BA',
  'BB',
  'BC',
  'BD',
  'BE',
  'BF',
  'BG',
  'BH',
  'BI',
  'BJ',
  'BK',
  'BL',
  'BM',
  'BN',
  'BO',
  'BP',
  'BQ',
  'BR',
  'BS',
  'BT',
  'BU',
  'BV',
  'BW',
  'BX',
  'BY',
  'BZ',
  'CA',
  'CB',
  'CC',
  'CD',
  'CE',
  'CF',
  'CG',
  'CH',
  'CI',
  'CJ',
  'CK',
  'CL',
  'CM',
  'CN',
  'CO',
  'CP',
  'CQ',
  'CR',
  'CS',
  'CT',
  'CU',
  'CV',
  'CW',
  'CX',
  'CY',
  'CZ'
];
export const GROUP_BILL = 'group-bill';
export const EVENTS_REPORT = 'events-report';
export const STALLS_REPORT = 'stalls-report';
export const RV_REPORT = 'rv-report';
export const TRANSACTION_REPORT = 'transaction';
export const RECONCILIATION_ACTION = 'reconciliation';
export const ACCOUNTING_ACTION = 'accounting';
export const RESERVATION_REPORT = 'reservation';

export const TRANSACTION_TYPES = {
  NEW_ORDER: 'NEW_ORDER',
  CHANGED_PRODUCT: 'CHANGED_PRODUCT',
  QUANTITY_UPDATED: 'QUANTITY_UPDATED',
  NIGHTS_UPDATED: 'NIGHTS_UPDATED',
  REDUCED_QUANTITY_REDUCED_NIGHTS: 'REDUCED_QUANTITY_REDUCED_NIGHTS',
  REDUCED_QUANTITY_EXTENDED_NIGHTS: 'REDUCED_QUANTITY_EXTENDED_NIGHTS',
  INCREASED_QUANTITY_EXTENDED_NIGHTS: 'INCREASED_QUANTITY_EXTENDED_NIGHTS',
  INCREASED_QUANTITY_REDUCED_NIGHTS: 'INCREASED_QUANTITY_REDUCED_NIGHTS',
  MULTI_REFUND: 'MULTI_REFUND',
  NON_PAYMENT_EDIT: 'NON_PAYMENT_EDIT',
  CANCELLED_ORDER: 'CANCELLED_ORDER',
  CANCELLED_ORDER_NO_REFUND: 'CANCELLED_ORDER_NO_REFUND',
  GROUP_ORDER: 'GROUP_ORDER',
  SPECIAL_REFUND: 'SPECIAL_REFUND',
  NO_REFUND: 'NO_REFUND',
  MULTI_PAYMENT: 'MULTI_PAYMENT'
};

export const TRANSACTIONS_WITH_2_ROWS = [
  TRANSACTION_TYPES.REDUCED_QUANTITY_REDUCED_NIGHTS,
  TRANSACTION_TYPES.REDUCED_QUANTITY_EXTENDED_NIGHTS,
  TRANSACTION_TYPES.INCREASED_QUANTITY_EXTENDED_NIGHTS,
  TRANSACTION_TYPES.INCREASED_QUANTITY_REDUCED_NIGHTS,
  TRANSACTION_TYPES.CHANGED_PRODUCT
];

export const TRANSACTION_REPORT_DATA = {
  TITLE_STYLE: { name: 'Roboto', size: 34, bold: true, color: { argb: '434343' } },
  SUBTITLE_STYLE: { name: 'Roboto', size: 12, bold: true, color: { argb: '434343' } },
  TOTAL_TITLE_STYLE: { name: 'Roboto', size: 12, color: { argb: '434343' } },
  TOTAL_STYLE: { name: 'Roboto', size: 18, color: { argb: '434343' } },
  FILL_COLOR: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'f3f3f3' } },
  TABLE_HEADER_ROW: 5,
  FIRST_DATA_ROW: 6
};

export const ERROR_MESSAGES = {
  CHECKIN_CHECKOUT_SAME_DATE: 'Checkin and Checkout date cannot be the same.',
  CHECKOUT_AFTER_EVENT_DATE: 'Checkout date cannot be after Event Checkout date',
  INSUFFICIENT_AVAILABLE_SPACE_COUNT: (productName, isRenter) =>
    `There are not enough ${productName} ${isRenter ? '' : 'assignments'} available for the date(s) you have selected.`,
  INSUFFICIENT_PRODUCT_QUANTITY: productName => `The ${productName} product is not available for the quantity provided.`,
  UNAVAILABLE_PRODUCT_ASSIGNMENT: productName => `One or more ${productName} assignment is no longer available.`,
  SELECTED_DATES_BELOW_MIN_NIGHTS: 'Selected dates are below min nights'
};

export const FF_GROUP_CODE = 'ff_group_code';

export * from './products';
export * from './actions';
export * from './roles';
export * from './menuOptions';
export * from './productXrefTypes';
