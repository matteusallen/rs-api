'use strict';
const replaceEnum = require('sequelize-replace-enum-postgres').default;

module.exports = {
  up: async queryInterface => {
    return replaceEnum({
      queryInterface,
      tableName: 'OrderHistory',
      columnName: 'changeType',
      newValues: ['reservationChange', 'reservationProductChange', 'addOnChange', 'assignmentChange', 'orderCancellation', 'orderRefund'],
      enumName: 'enum_OrderHistory_changeType'
    });
  },

  down: async queryInterface => {
    return replaceEnum({
      queryInterface,
      tableName: 'OrderHistory',
      columnName: 'changeType',
      newValues: ['reservationChange', 'reservationProductChange', 'addOnChange', 'assignmentChange', 'orderCancellation'],
      enumName: 'enum_OrderHistory_changeType'
    });
  }
};
