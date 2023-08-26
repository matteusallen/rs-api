import Excel from 'exceljs';
import { getQuery } from '../query';
import { getTransactions } from '../transactionsBuilder';
import { fillCashTab } from './tabs/cashTab';
import { fillTransactionsTab } from './tabs/transactionsTab';
import { fillDeferredTab } from './tabs/deferredTab';
import { fillCreditTab } from './tabs/creditTab';
import { fillMultiPaymentTab } from './tabs/multiPaymentTab';
import { isSplitPayment } from './helpers/index';
import * as CONSTANTS from '../constants';

const createNewTab = (workbook, tabName) => workbook.addWorksheet(tabName);

const transactionReport = async (request, roleId) => {
  const workbook = new Excel.Workbook();
  const [orderHistoryData, cancelledOrderIds] = await getQuery(request.body, roleId);
  const stripeAccountType = orderHistoryData[0].order.event.venue?.stripeAccountType;

  const transactionsWorksheet = createNewTab(workbook, CONSTANTS.TABS.TRANSACTIONS);
  const reportRows = getTransactions(orderHistoryData);
  fillTransactionsTab(transactionsWorksheet, reportRows, request);

  const uncanceledOrders = reportRows.filter(order => !cancelledOrderIds.some(orderId => order.orderId === orderId));

  const cashRows = getCash(uncanceledOrders);
  if (cashRows.length) {
    const cashWorksheet = createNewTab(workbook, CONSTANTS.TABS.CASH);
    fillCashTab(cashWorksheet, cashRows, request);
  }

  const deferredRows = getDeferred(uncanceledOrders);
  if (deferredRows.length > 0) {
    const deferredWorksheet = createNewTab(workbook, CONSTANTS.TABS.DEFERRED);
    fillDeferredTab(deferredWorksheet, deferredRows, request);
  }

  const creditRows = getCredit(uncanceledOrders, stripeAccountType);
  if (creditRows.length > 0) {
    const creditWorksheet = createNewTab(workbook, CONSTANTS.TABS.CREDIT);
    fillCreditTab(creditWorksheet, creditRows, request);
  }

  const multiPaymentRows = getMultiPayment(uncanceledOrders);
  if (multiPaymentRows.length > 0) {
    const multiPaymentWorksheet = createNewTab(workbook, CONSTANTS.TABS.MULTI_PAYMENT);
    fillMultiPaymentTab(multiPaymentWorksheet, multiPaymentRows, request);
  }

  return [workbook, false, undefined];
};

const getCredit = (orders, venueAcctType) =>
  orders.filter(({ transactionType, stripeAccountType }) => isCredit(transactionType) && stripeAccountType === venueAcctType);

const isCredit = transactionType => transactionType === CONSTANTS.TRANSACTION_TYPE_CREDIT || transactionType === CONSTANTS.TRANSACTION_TYPE_CARD_REFUND;

const getDeferred = orders => orders.filter(({ transactionType }) => transactionType === CONSTANTS.TRANSACTION_TYPE_DEFERRED);

const getCash = orders => orders.filter(({ transactionType }) => isCash(transactionType));

const isCash = transactionType => transactionType === CONSTANTS.TRANSACTION_TYPE_CASH || transactionType === CONSTANTS.TRANSACTION_TYPE_CASH_REFUND;

const getMultiPayment = orders => orders.filter(({ transactionType }) => isSplitPayment(transactionType));

export default transactionReport;
