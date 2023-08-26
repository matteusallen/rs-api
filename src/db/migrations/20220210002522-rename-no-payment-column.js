'use strict';

module.exports = {
  up: async queryInterface => {
    await queryInterface.renameColumn('OrderHistory', 'noPayment', 'ignorePayment');
  },

  down: async queryInterface => {
    await queryInterface.renameColumn('OrderHistory', 'ignorePayment', 'noPayment');
  }
};
