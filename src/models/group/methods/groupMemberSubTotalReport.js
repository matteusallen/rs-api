// @flow
import Excel from 'exceljs';
import { Group } from 'Models';

async function groupMemberSubTotalReport(groupId: number, eventIds: []): Promise<[{} | void, string | void]> {
  const [exportData, totalDueToVenue, totalFees, grandTotal] = await Group.getGroupTabByEventIds(groupId, eventIds);

  const workbook = new Excel.Workbook();
  workbook.creator = 'Open Stalls';
  workbook.views = [
    {
      x: 0,
      y: 0,
      width: 30000,
      height: 20000,
      firstSheet: 0,
      activeTab: 1,
      visibility: 'visible'
    }
  ];

  const worksheet = workbook.addWorksheet('Group Member Subtotal');

  worksheet.columns = [
    { header: 'Order Id', key: 'orderId', width: 11 },
    { header: 'Reservation Name', key: 'reservationName', width: 23, style: {} },
    { header: 'Type', key: 'type', width: 24 },
    { header: 'Event Name', key: 'eventName', width: 23 },
    { header: 'Rate', key: 'rate', width: 16 },
    { header: 'Quantity Purchased', key: 'quantity', width: 19 },
    { header: 'Paid', key: 'paid', width: 23 },
    { header: 'Unpaid', key: 'unpaid', width: 23 },
    { header: 'Refunded', key: 'refunded', width: 23 },
    { header: '# of Nights Reserved', key: 'numberOfNights', width: 23 },
    { header: 'Line Total', key: 'cost', width: 16 }
  ];

  for (const orderId in exportData) {
    worksheet.addRows(exportData[orderId]);
  }

  worksheet.addRow({
    orderId: ' ',
    reservationName: ' ',
    type: ' ',
    eventName: ' ',
    rate: ' ',
    quantity: ' ',
    paid: ' ',
    unpaid: ' ',
    refunded: ' ',
    numberOfNights: ' ',
    cost: ' '
  });
  worksheet.addRow({
    orderId: ' ',
    reservationName: ' ',
    type: ' ',
    eventName: ' ',
    rate: ' ',
    quantity: ' ',
    paid: ' ',
    unpaid: ' ',
    refunded: ' ',
    numberOfNights: ' ',
    cost: ' '
  });
  worksheet.addRow({
    orderId: ' ',
    reservationName: ' ',
    type: ' ',
    eventName: ' ',
    rate: ' ',
    quantity: ' ',
    numberOfNights: 'Total due to Venue',
    cost: `$ ${totalDueToVenue}`
  });
  worksheet.addRow({
    orderId: ' ',
    reservationName: ' ',
    type: ' ',
    eventName: ' ',
    rate: ' ',
    quantity: ' ',
    numberOfNights: 'Fees due to Open Stalls',
    cost: `$ ${totalFees}`
  });
  worksheet.addRow({
    orderId: ' ',
    reservationName: ' ',
    type: ' ',
    eventName: ' ',
    rate: ' ',
    quantity: ' ',
    numberOfNights: 'Grand Total for Group',
    cost: `$ ${grandTotal}`
  });

  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    if (rowNumber === 1) {
      row.height = 18;
    }

    row.eachCell({ includeEmpty: true }, cell => {
      if (rowNumber === 1) {
        cell.font = {
          bold: true,
          size: 12
        };
        cell.border = {
          bottom: { style: 'medium' },
          right: { style: null }
        };
      }

      if (
        cell.value === '' ||
        cell.value === 'Total' ||
        cell.value === 'Total due to Venue' ||
        cell.value === 'Fees due to Open Stalls' ||
        cell.value === 'Grand Total for Group'
      ) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'cccccc' },
          bold: true
        };

        cell.font = {
          bold: true
        };
      }

      if (cell._column._key === 'cost' || cell._column._key === 'rate' || cell._column._key === 'quantity' || cell._column._key === 'numberOfNights') {
        cell.alignment = {
          vertical: 'center',
          horizontal: 'center'
        };
      }

      if (cell.value === 'Total due to Venue' || cell.value === 'Fees due to Open Stalls' || cell.value === 'Grand Total for Group') {
        cell.alignment = {
          vertical: 'left',
          horizontal: 'left'
        };
      }
    });
  });

  return workbook;
}

export default groupMemberSubTotalReport;
