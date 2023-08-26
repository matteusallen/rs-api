// @flow

import Excel from 'exceljs';

import type { StallOptionsType } from '../types';

async function stallsReport(input: { options?: StallOptionsType, venueId: string | number }, roleId: number): Promise<[{} | void, string | void]> {
  try {
    const { options, venueId } = input;
    const { Order } = this.sequelize.models;
    const [stalls] = await this.getStallsByVenueId(venueId, options, roleId);
    const workbook = new Excel.Workbook();
    workbook.creator = 'Open Stalls';
    workbook.lastModifiedBy = 'Open Stalls';
    workbook.created = new Date();
    workbook.modified = new Date();

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

    const worksheet = workbook.addWorksheet('Stalls');
    const columns = [
      { header: 'Building Name', key: 'buildingName', width: 20 },
      { header: 'Stall Name', key: 'stallName', width: 16 },
      { header: 'Stall Status', key: 'status', width: 16 },
      { header: 'Check Out Date', key: 'lastDepartureDate', width: 16 },
      { header: 'Next Check In', key: 'nextOrder', width: 20 }
    ];

    const dataRows = [];

    for (const stall of stalls) {
      let orders = {};
      let nextOrders = {};

      if (stall.reservationSpaces[0]) {
        const { spaceId } = stall.reservationSpaces[0];
        orders = await Order.getOrderByStall(spaceId, options, roleId);
        nextOrders = await Order.getNextOrderByXRefTypeId(spaceId, options, 1, roleId);
      }

      let dataRow = {
        buildingName: !stall.building ? '' : stall.building.name,
        stallName: stall.name,
        status: stall.status,
        nextOrder: nextOrders && nextOrders.nextReservationDate ? nextOrders.nextReservationDate : '',
        lastDepartureDate: orders && orders.lastDepartureDate ? orders.lastDepartureDate : ''
      };

      dataRows.push(dataRow);
    }

    worksheet.columns = columns;
    worksheet.addRows(dataRows);

    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      if (rowNumber === 1) {
        row.height = 30;
      }
      row.eachCell({ includeEmpty: true }, cell => {
        cell.border = {
          bottom: {},
          right: {}
        };
        if (rowNumber === 1) {
          cell.font = {
            bold: true,
            size: 16
          };
          cell.border = {
            bottom: { style: 'medium' },
            right: { style: null }
          };
        }
      });
    });

    worksheet.views = [{ state: 'frozen', ySplit: 1 }];

    return [workbook, undefined];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return [undefined, error.message];
  }
}

export default stallsReport;
