export const getColumns = (reportRows, unnecessaryColumns = []) => {
  const addOnColumns = getAddOnColumns(reportRows);
  const addOnNames = addOnColumns.filter((_, index) => index % 3 === 0);

  let columns = [
    { header: 'Order Id', key: 'orderId', width: 12 },
    { header: 'Trans Date', key: 'transactionDate', width: 24 },
    { header: 'Admin name', key: 'adminName', width: 16 },
    { header: 'Event', key: 'event', width: 26 },
    { header: 'Renter Name', key: 'renterName', width: 18 },
    { header: 'Transaction Type', key: 'transactionType', width: 24 },
    { header: 'Card Brand', key: 'cardBrand', width: 16 },
    { header: 'Refund Reason', key: 'refundReason', width: 30 },
    { header: 'Stall Qty', key: 'stallsQty', width: 12 },
    { header: 'Stall Nights', key: 'stallsNights', width: 10 },
    { header: 'Unit Price', key: 'stallsUnitPrice', width: 16, style: { numFmt: '$##,##0.00' } },
    { header: 'Stall Total price', key: 'stallsTotal', width: 16, style: { numFmt: '$##,##0.00' } },
    { header: 'RV Qty', key: 'rvsQty', width: 12 },
    { header: 'RV Nights', key: 'rvsNights', width: 10 },
    { header: 'Unit Price', key: 'rvsUnitPrice', width: 18, style: { numFmt: '$##,##0.00' } },
    { header: 'RV Total Price', key: 'rvsTotal', width: 22, style: { numFmt: '$##,##0.00' } },
    ...addOnColumns,
    { header: 'Sub total', key: 'subtotal', width: 18, style: { numFmt: '$##,##0.00' } },
    { header: 'ROLO fee', key: 'roloFee', width: 18, style: { numFmt: '$##,##0.00' } },
    { header: 'Stripe fee', key: 'stripeFee', width: 16, style: { numFmt: '$##,##0.00' } },
    { header: 'Total', key: 'total', width: 18, style: { numFmt: '$##,##0.00' } },
    { header: 'Payout ID', key: 'stripePayoutId', width: 30 },
    { header: 'Paid Date', key: 'paidDate', width: 24 },
    { header: 'Amount', key: 'amount', width: 12, style: { numFmt: '$##,##0.00' } }
  ];

  if (unnecessaryColumns.length) {
    columns = columns.filter(column => !unnecessaryColumns.includes(column.key));
  }

  return [columns, addOnNames];
};

const getAddOnColumns = reportRows => {
  const addOnNames = getAddOnNames(reportRows);
  const colums = addOnNames.reduce((acc, addOn) => {
    return [...acc, ...getColumnsInAddOn(addOn)];
  }, []);

  return colums;
};

const getAddOnNames = reportRows => {
  const allAddOns = reportRows.reduce((acc, reportRow) => {
    const addOnsInRow = reportRow.addOnNames ?? [];
    addOnsInRow.forEach(addOnName => acc.add(addOnName));
    return acc;
  }, new Set());

  return Array.from(allAddOns);
};

const getColumnsInAddOn = addOn => {
  return [
    { header: `${addOn}`, key: `${addOn}Qty`, width: 18 },
    { header: 'Unit price', key: `${addOn}UnitPrice`, width: 18, style: { numFmt: '$##,##0.00' } },
    { header: `${addOn} Total price`, key: `${addOn}Total`, width: 18, style: { numFmt: '$##,##0.00' } }
  ];
};
