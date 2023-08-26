import { VENUE_ADMIN, OPS, RENTER, RESERVATION_ADMIN, SUPER_ADMIN, GROUP_LEADER } from './roles';
import { MENU } from './menuOptions';

const getAll = actions => Object.values(actions);

const getAllBut = (actions, ignoredActions) => {
  const actionsArray = Object.values(actions);
  return actionsArray.filter(action => !ignoredActions.includes(action));
};

export const ACTIONS = {
  [MENU.ADDONS]: {
    GET_ADDON_BY_ID: 'GET_ADDON_BY_ID',
    GET_ADDONS_BY_VENUE_ID: 'GET_ADDONS_BY_VENUE_ID',
    UPDATE_ADDON_INFO: 'updateAddOnInfo',
    TOGGLE_ADDON_AVAILABILITY: 'TOGGLE_ADDON_AVAILABILITY',
    BOOKED: 'BOOKED'
  },
  [MENU.ADDON_PRODUCTS]: {
    GET_ADDON_PRODUCT_BY_ID: 'GET_ADDON_PRODUCT_BY_ID'
  },
  [MENU.BUILDINGS]: {
    GET_BUILDING_BY_ID: 'GET_BUILDING_BY_ID',
    GET_BUILDINGS_BY_VENUE_ID: 'GET_BUILDINGS_BY_VENUE_ID'
  },
  [MENU.DOCUMENTS]: {
    GET_DOCUMENTS: 'GET_DOCUMENTS'
  },
  [MENU.EVENTS]: {
    GET_EVENT_BY_ID: 'GET_EVENT_BY_ID',
    GET_EVENTS: 'GET_EVENTS',
    GET_FILTERED_EVENTS_BY_VENUE_ID: 'GET_FILTERED_EVENTS_BY_VENUE_ID',
    FUZZY_SEARCH_EVENTS_BY_NAME_OR_CITY: 'FUZZY_SEARCH_EVENTS_BY_NAME_OR_CITY',
    SEARCH_EVENTS_WITH_ORDER_AVAILABILITY: 'SEARCH_EVENTS_WITH_ORDER_AVAILABILITY',
    GET_EVENTS_BY_GROUP_ID: 'GET_EVENTS_BY_GROUP_ID',
    CREATE_EVENT: 'CREATE_EVENT',
    EDIT_EVENT: 'EDIT_EVENT',
    UPDATE_EVENT_INFO: 'UPDATE_EVENT_INFO'
  },
  [MENU.GROUPS]: {
    CREATE_GROUP: 'CREATE_GROUP',
    GET_GROUPS: 'GET_GROUPS',
    GET_GROUPS_BY_LEADER_ID: 'GET_GROUPS_BY_LEADER_ID',
    GET_GROUP_BY_ID: 'GET_GROUP_BY_ID',
    UPDATE_GROUP: 'UPDATE_GROUP',
    DELETE_GROUP: 'DELETE_GROUP',
    REFRESH_CODE: 'REFRESH_CODE'
  },
  [MENU.GROUP_ORDERS]: {
    GET_ORDERS_BY_GROUP_ID: 'GET_ORDERS_BY_GROUP_ID'
  },
  [MENU.ORDERS]: {
    ADMIN_NOTES: 'ADMIN_NOTES',
    ADDITIONAL_ORDER_PAYMENT: 'ADDITIONAL_ORDER_PAYMENT',
    ORDER_PAYMENT: 'ORDER_PAYMENT',
    ORDER_REFUND: 'ORDER_REFUND',
    DEFERRED_SETLEMENT_CASH_PAYMENT: 'DEFERRED_SETLEMENT_CASH_PAYMENT',
    EDIT_RESERVATION_BUTTON_ON_RESERVATION_SIDEBAR: 'EDIT_RESERVATION_BUTTON_ON_RESERVATION_SIDEBAR',
    RV_STATUS_DROPDOWN_ON_RESERVATION_SIDEBAR: 'RV_STATUS_DROPDOWN_ON_RESERVATION_SIDEBAR',
    RESERVATION_BULK_ACTIONS: 'RESERVATION_BULK_ACTIONS',
    STALL_STATUS_DROPDOWN_ON_RESERVATION_SIDEBAR: 'STALL_STATUS_DROPDOWN_ON_RESERVATION_SIDEBAR',
    GET_DETAILS_SMS_COUNT: 'GET_DETAILS_SMS_COUNT',
    GET_NEXT_ORDER_BY_XREF_TYPE_ID: 'GET_NEXT_ORDER_BY_XREF_TYPE_ID',
    GET_ORDER_BY_ID: 'GET_ORDER_BY_ID',
    GET_ORDER_BY_STALL: 'GET_ORDER_BY_STALL',
    GET_ORDER_COST_FEE: 'GET_ORDER_COST_FEE',
    GET_ORDERS: 'GET_ORDERS',
    GET_ORDERS_BY_USER_ID: 'GET_ORDERS_BY_USER_ID',
    GET_ORDER_UPDATE_PRICING_DIFFERENCES: 'GET_ORDER_UPDATE_PRICING_DIFFERENCES',
    GROUP_ORDER_CHECKOUT: 'GROUP_ORDER_CHECKOUT',
    ORDER_CHECKOUT: 'ORDER_CHECKOUT',
    ORDER_COSTS: 'ORDER_COSTS',
    SEND_ASSIGNMENTS_SMS_BY_ORDER_ID: 'SEND_ASSIGNMENTS_SMS_BY_ORDER_ID',
    SEND_CONFIRMATION_EMAIL: 'SEND_CONFIRMATION_EMAIL',
    SEND_CUSTOM_SMS_BY_ORDER_IDS: 'SEND_CUSTOM_SMS_BY_ORDER_IDS',
    UPDATE_ORDER: 'UPDATE_ORDER',
    ORDER_CANCELATION: 'ORDER_CANCELATION',
    ORDER_CANCELATION_AFTER_SETTLEMENT: 'ORDER_CANCELATION_AFTER_SETTLEMENT'
  },
  [MENU.RESERVATIONS]: {
    GET_RESERVATION_BY_ID: 'GET_RESERVATION_BY_ID'
  },
  [MENU.RESERVATION_STATUS]: {
    GET_RESERVATION_STATUS_BY_ID: 'GET_RESERVATION_STATUS_BY_ID',
    UPDATE_RESERVATION_STATUS: 'UPDATE_RESERVATION_STATUS'
  },
  [MENU.RESERVATION_SPACES]: {
    GET_RESERVATION_SPACES: 'GET_RESERVATION_SPACES',
    PRODUCT_ASSIGNMENT: 'PRODUCT_ASSIGNMENT'
  },
  [MENU.RV_LOTS]: {
    GET_RV_LOT_BY_ID: 'GET_RV_LOT_BY_ID',
    GET_RV_LOTS_BY_VENUE_ID: 'getRVLotsByVenueId'
  },
  [MENU.RV_PRODUCTS]: {
    GET_AVAILABILITY: 'GET_AVAILABILITY',
    GET_AVAILABLE_SPACES: 'GET_AVAILABLE_SPACES',
    GET_RV_PRODUCT_BY_ID: 'GET_RV_PRODUCT_BY_ID',
    UPDATE_RV_PRODUCT_INFO: 'UPDATE_RV_PRODUCT_INFO',
    BOOKED: 'BOOKED',
    GET_ASSIGNED_SPOTS: 'GET_ASSIGNED_SPOTS'
  },
  [MENU.RV_SPOTS]: {
    GET_RV_SPOTS_BY_RV_LOT_ID: 'GET_RV_SPOTS_BY_RV_LOT_ID',
    GET_RV_SPOTS_BY_RV_PRODUCT_ID: 'GET_RV_SPOTS_BY_RV_PRODUCT_ID',
    GET_RV_SPOTS_BY_VENUE_ID: 'GET_RV_SPOTS_BY_VENUE_ID'
  },
  [MENU.STALLS]: {
    GET_STALLS_BY_BUILDING_ID: 'GET_STALLS_BY_BUILDING_ID',
    GET_STALLS_BY_STALL_PRODUCT_ID: 'GET_STALLS_BY_STALL_PRODUCT_ID',
    GET_STALLS_BY_VENUE_ID: 'GET_STALLS_BY_VENUE_ID',
    UPDATE_STALL_STATUS: 'UPDATE_STALL_STATUS'
  },
  [MENU.STALL_PRODUCTS]: {
    GET_AVAILABILITY: 'GET_AVAILABILITY',
    GET_AVAILABLE_SPACES: 'GET_AVAILABLE_SPACES',
    GET_STALL_PRODUCT_BY_ID: 'GET_STALL_PRODUCT_BY_ID',
    UPDATE_STALL_PRODUCT_INFO: 'UPDATE_STALL_PRODUCT_INFO',
    BOOKED: 'BOOKED'
  },
  [MENU.USERS]: {
    GET_FILTERED_USERS_BY_VENUE_ID: 'GET_FILTERED_USERS_BY_VENUE_ID',
    GET_GROUP_LEADERS: 'GET_GROUP_LEADERS',
    GET_USER: 'GET_USER',
    GET_USERS: 'GET_USERS',
    GET_USER_CREDIT_CARDS: 'GET_USER_CREDIT_CARDS',
    UPSERT_USER: 'UPSERT_USER'
  },
  [MENU.USER_ROLES]: {
    GET_USER_ROLE_BY_ID: 'GET_USER_ROLE_BY_ID'
  },
  [MENU.VENUES]: {
    CREATE_VENUE: 'CREATE_VENUE',
    GET_VENUE_BY_ID: 'GET_VENUE_BY_ID',
    GET_VENUES: 'GET_VENUES'
  }
};

export const unallowedActionsByroles = {
  [VENUE_ADMIN]: {},
  [OPS]: {
    [MENU.ADDONS]: getAll(ACTIONS[MENU.ADDONS]),
    [MENU.ADDON_PRODUCTS]: getAll(ACTIONS[MENU.ADDON_PRODUCTS]),
    [MENU.DOCUMENTS]: getAll(ACTIONS[MENU.DOCUMENTS]),
    [MENU.EVENTS]: getAll(ACTIONS[MENU.EVENTS]),
    [MENU.GROUPS]: getAll(ACTIONS[MENU.GROUPS]),
    [MENU.GROUP_ORDERS]: getAll(ACTIONS[MENU.GROUP_ORDERS]),
    [MENU.ORDERS]: getAllBut(ACTIONS[MENU.ORDERS], [ACTIONS[MENU.ORDERS].GET_ORDER_BY_STALL, ACTIONS[MENU.ORDERS].GET_NEXT_ORDER_BY_XREF_TYPE_ID]),
    [MENU.RESERVATIONS]: getAll(ACTIONS[MENU.RESERVATIONS]),
    [MENU.RESERVATION_STATUS]: getAll(ACTIONS[MENU.RESERVATION_STATUS]),
    [MENU.RESERVATION_SPACES]: getAll(ACTIONS[MENU.RESERVATION_SPACES]),
    [MENU.RV_PRODUCTS]: getAll(ACTIONS[MENU.RV_PRODUCTS]),
    [MENU.RV_SPOTS]: getAllBut(ACTIONS[MENU.RV_SPOTS], [ACTIONS[MENU.RV_SPOTS].GET_RV_SPOTS_BY_VENUE_ID]),
    [MENU.STALLS]: getAllBut(ACTIONS[MENU.STALLS], [ACTIONS[MENU.STALLS].GET_STALLS_BY_VENUE_ID, ACTIONS[MENU.STALLS].UPDATE_STALL_STATUS]),
    [MENU.STALL_PRODUCTS]: getAll(ACTIONS[MENU.STALL_PRODUCTS]),
    [MENU.USERS]: getAllBut(ACTIONS[MENU.USERS], [ACTIONS[MENU.USERS].GET_USER_CREDIT_CARDS]),
    [MENU.VENUES]: [ACTIONS[MENU.VENUES].CREATE_VENUE, ACTIONS[MENU.VENUES].GET_VENUES]
  },
  [RENTER]: {
    [MENU.EVENTS]: getAllBut(ACTIONS[MENU.EVENTS], [
      ACTIONS[MENU.EVENTS].GET_EVENTS,
      ACTIONS[MENU.EVENTS].GET_EVENT_BY_ID,
      ACTIONS[MENU.EVENTS].FUZZY_SEARCH_EVENTS_BY_NAME_OR_CITY
    ]),
    [MENU.GROUPS]: getAll(ACTIONS[MENU.GROUPS]),
    [MENU.GROUP_ORDERS]: getAll(ACTIONS[MENU.GROUP_ORDERS]),
    [MENU.ORDERS]: getAllBut(ACTIONS[MENU.ORDERS], [
      ACTIONS[MENU.ORDERS].ORDER_COSTS,
      ACTIONS[MENU.ORDERS].ORDER_CHECKOUT,
      ACTIONS[MENU.ORDERS].ORDER_PAYMENT,
      ACTIONS[MENU.ORDERS].SEND_CONFIRMATION_EMAIL,
      ACTIONS[MENU.ORDERS].GET_ORDERS_BY_USER_ID
    ]),
    [MENU.RESERVATIONS]: getAllBut(ACTIONS[MENU.RESERVATIONS], [ACTIONS[MENU.RESERVATIONS].GET_RESERVATION_BY_ID]),
    [MENU.RESERVATION_STATUS]: getAllBut(ACTIONS[MENU.RESERVATION_STATUS], [ACTIONS[MENU.RESERVATION_STATUS].GET_RESERVATION_STATUS_BY_ID]),
    [MENU.RESERVATION_SPACES]: getAllBut(ACTIONS[MENU.RESERVATION_SPACES], [ACTIONS[MENU.RESERVATION_SPACES].GET_RESERVATION_SPACES]),
    [MENU.RV_LOTS]: getAllBut(ACTIONS[MENU.RV_LOTS], [ACTIONS[MENU.RV_LOTS].GET_RV_LOT_BY_ID]),
    [MENU.RV_PRODUCTS]: getAllBut(ACTIONS[MENU.RV_PRODUCTS], [
      ACTIONS[MENU.RV_PRODUCTS].GET_AVAILABILITY,
      ACTIONS[MENU.RV_PRODUCTS].GET_AVAILABLE_SPACES,
      ACTIONS[MENU.RV_PRODUCTS].GET_RV_PRODUCT_BY_ID
    ]),
    [MENU.RV_SPOTS]: getAllBut(ACTIONS[MENU.RV_SPOTS], [ACTIONS[MENU.RV_SPOTS].GET_RV_SPOTS_BY_VENUE_ID]),
    [MENU.STALLS]: getAllBut(ACTIONS[MENU.STALLS], [ACTIONS[MENU.STALLS].GET_STALLS_BY_VENUE_ID]),
    [MENU.STALL_PRODUCTS]: getAllBut(ACTIONS[MENU.STALL_PRODUCTS], [
      ACTIONS[MENU.STALL_PRODUCTS].GET_AVAILABILITY,
      ACTIONS[MENU.STALL_PRODUCTS].GET_AVAILABLE_SPACES,
      ACTIONS[MENU.STALL_PRODUCTS].GET_STALL_PRODUCT_BY_ID
    ]),
    [MENU.USERS]: getAllBut(ACTIONS[MENU.USERS], [ACTIONS[MENU.USERS].GET_USER_CREDIT_CARDS, ACTIONS[MENU.USERS].UPSERT_USER]),
    [MENU.VENUES]: getAll(ACTIONS[MENU.VENUES])
  },
  [RESERVATION_ADMIN]: {
    [MENU.EVENTS]: getAllBut(ACTIONS[MENU.EVENTS], [
      ACTIONS[MENU.EVENTS].GET_EVENT_BY_ID,
      ACTIONS[MENU.EVENTS].GET_FILTERED_EVENTS_BY_VENUE_ID,
      ACTIONS[MENU.EVENTS].GET_EVENTS
    ]),
    [MENU.USERS]: getAllBut(ACTIONS[MENU.USERS], [ACTIONS[MENU.USERS].GET_USER_CREDIT_CARDS, ACTIONS[MENU.USERS].GET_USERS, ACTIONS[MENU.USERS].UPSERT_USER]),
    [MENU.GROUPS]: getAllBut(ACTIONS[MENU.GROUPS], [ACTIONS[MENU.GROUPS].GET_GROUPS])
  },
  [SUPER_ADMIN]: {},
  [GROUP_LEADER]: {
    [MENU.GROUPS]: [ACTIONS[MENU.GROUPS].CREATE_GROUP, ACTIONS[MENU.GROUPS].DELETE_GROUP, ACTIONS[MENU.GROUPS].UPDATE_GROUP, ACTIONS[MENU.GROUPS].REFRESH_CODE],
    [MENU.ORDERS]: [
      ACTIONS[MENU.ORDERS].ADMIN_NOTES,
      ACTIONS[MENU.ORDERS].ORDER_PAYMENT,
      ACTIONS[MENU.ORDERS].ADDITIONAL_ORDER_PAYMENT,
      ACTIONS[MENU.ORDERS].DEFERRED_SETLEMENT_CASH_PAYMENT,
      ACTIONS[MENU.ORDERS].EDIT_RESERVATION_BUTTON_ON_RESERVATION_SIDEBAR,
      ACTIONS[MENU.ORDERS].RV_STATUS_DROPDOWN_ON_RESERVATION_SIDEBAR,
      ACTIONS[MENU.ORDERS].RESERVATION_BULK_ACTIONS,
      ACTIONS[MENU.RESERVATION_SPACES].PRODUCT_ASSIGNMENT,
      ACTIONS[MENU.ORDERS].STALL_STATUS_DROPDOWN_ON_RESERVATION_SIDEBAR,
      ACTIONS[MENU.ORDERS].ORDER_REFUND,
      ACTIONS[MENU.ORDERS].ORDER_CANCELATION_AFTER_SETTLEMENT,
      ACTIONS[MENU.ORDERS].GET_DETAILS_SMS_COUNT,
      ACTIONS[MENU.ORDERS].SEND_CUSTOM_SMS_BY_ORDER_IDS
    ]
  }
};
