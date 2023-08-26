import { getTransactions, getRowsInHistory } from '../methods/transactionReport/transactionsBuilder';
import { getInitialOrderData } from '../data/initialOrderData';
import { getRefundData } from '../data/refundData';
import { getSpecialRefundData } from '../data/specialRefundData';
import { getExtendingNightsData } from '../data/extendingNightsData';
import { getReducingQtyReducingNightsData } from '../data/reducingQtyReducingNightsData';
import { getReducingQtyExtendingNightsData } from '../data/reducingQtyExtendingNightsData';
import { getIncreasingQtyExtendingNightsData } from '../data/increasingQtyExtendingNightsData';
import { getIncreasingQtyReducingNightsData } from '../data/increasingQtyReducingNightsData';
import { getChangingProductData } from '../data/changingProductData';
import { getAdding3AddOnsData } from '../data/adding3AddOns';
import { getMultiRefundData } from '../data/multiRefundData';
import { getNonPaymentEditData } from '../data/nonPaymentEditData';
import { getCancellingData } from '../data/cancellingData';
import { getCancellingNoRefundData } from '../data/cancellingNoRefundData';
import { getGroupOrderData } from '../data/groupOrderData';
import { getGroupOrderSettledData } from '../data/groupOrderSettledData';
import { getNoRefundData } from '../data/noRefundData';
import { getMultiPaymentData } from '../data/multiPaymentData';

describe('Creating initial order', () => {
  const [orderHistory, expectedRows] = getInitialOrderData();
  const generatedRows = getRowsInHistory(orderHistory);

  it(`should match expected data`, async () => {
    expect(generatedRows).toEqual(expectedRows);
  });
});

describe('Creating refund (Reducing stall and add on qty)', () => {
  const [orderHistory, expectedRows] = getRefundData();
  const generatedRows = getRowsInHistory(orderHistory);

  it(`should match expected data`, async () => {
    expect(generatedRows).toEqual(expectedRows);
  });
});

describe('Creating special refund', () => {
  const [orderHistory, expectedRows] = getSpecialRefundData();
  const generatedRows = getRowsInHistory(orderHistory);

  it(`should match expected data`, async () => {
    expect(generatedRows).toEqual(expectedRows);
  });
});

describe('Extending nights', () => {
  const [orderHistory, expectedRows] = getExtendingNightsData();
  const generatedRows = getRowsInHistory(orderHistory);

  it(`should match expected data`, async () => {
    expect(generatedRows).toEqual(expectedRows);
  });
});

describe('Reducing quantity and reducing nights', () => {
  const [orderHistory, expectedRows] = getReducingQtyReducingNightsData();
  const generatedRows = getRowsInHistory(orderHistory);

  it(`should match expected data`, async () => {
    expect(generatedRows).toEqual(expectedRows);
  });
});

describe('Reducing quantity and extending nights', () => {
  const [orderHistory, expectedRows] = getReducingQtyExtendingNightsData();
  const generatedRows = getRowsInHistory(orderHistory);

  it(`should match expected data`, async () => {
    expect(generatedRows).toEqual(expectedRows);
  });
});

describe('Increasing quantity and extending nights', () => {
  const [orderHistory, expectedRows] = getIncreasingQtyExtendingNightsData();
  const generatedRows = getRowsInHistory(orderHistory);

  it(`should match expected data`, async () => {
    expect(generatedRows).toEqual(expectedRows);
  });
});

describe('Increasing quantity and reducing nights', () => {
  const [orderHistory, expectedRows] = getIncreasingQtyReducingNightsData();
  const generatedRows = getRowsInHistory(orderHistory);

  it(`should match expected data`, async () => {
    expect(generatedRows).toEqual(expectedRows);
  });
});

describe('Changing product', () => {
  const [orderHistory, expectedRows] = getChangingProductData();
  const generatedRows = getRowsInHistory(orderHistory);

  it(`should match expected data`, async () => {
    expect(generatedRows).toEqual(expectedRows);
  });
});

describe('Adding 3 Add Ons', () => {
  const [orderHistory, expectedRows] = getAdding3AddOnsData();
  const generatedRows = getRowsInHistory(orderHistory);

  it(`should match expected data`, async () => {
    expect(generatedRows).toEqual(expectedRows);
  });
});

describe('Creating multi refund (3 refunded cards)', () => {
  const [orderHistory, expectedRows] = getMultiRefundData();
  const generatedRows = getRowsInHistory(orderHistory);

  it(`should match expected data`, async () => {
    expect(generatedRows).toEqual(expectedRows);
  });
});

describe('Adding non payment edit', () => {
  const [orderHistory, expectedRows] = getNonPaymentEditData();
  const generatedRows = getRowsInHistory(orderHistory);

  it(`should match expected data`, async () => {
    expect(generatedRows).toEqual(expectedRows);
  });
});

describe('Cancelling order refunding fees', () => {
  const [orderHistory, expectedRows] = getCancellingData();
  const generatedRows = getRowsInHistory(orderHistory);

  it(`should match expected data`, async () => {
    expect(generatedRows).toEqual(expectedRows);
  });
});

describe('Cancelling order with no refund', () => {
  const [orderHistory, expectedRows] = getCancellingNoRefundData();
  const generatedRows = getRowsInHistory(orderHistory);

  it(`should match expected data`, async () => {
    expect(generatedRows).toEqual(expectedRows);
  });
});

describe('Creating group order', () => {
  const [orderHistory, expectedRows] = getGroupOrderData();
  const generatedRows = getRowsInHistory(orderHistory);

  it(`should match expected data`, async () => {
    expect(generatedRows).toEqual(expectedRows);
  });
});

describe('Creating settled group order', () => {
  const [orderHistory, expectedRows] = getGroupOrderSettledData();
  const generatedRows = getTransactions(orderHistory);

  it(`should match expected data`, async () => {
    expect(generatedRows).toEqual(expectedRows);
  });
});

describe('Creating no refund', () => {
  const [orderHistory, expectedRows] = getNoRefundData();
  const generatedRows = getRowsInHistory(orderHistory);

  it(`should match expected data`, async () => {
    expect(generatedRows).toEqual(expectedRows);
  });
});

describe('Creating multi payment with 2 row', () => {
  const [orderHistory, expectedRows] = getMultiPaymentData();
  const generatedRows = getRowsInHistory(orderHistory);

  it(`should match expected data`, async () => {
    expect(generatedRows).toEqual(expectedRows);
  });
});
