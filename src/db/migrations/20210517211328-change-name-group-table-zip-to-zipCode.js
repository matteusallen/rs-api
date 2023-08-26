'use strict';

module.exports = {
  up: async queryInterface => {
    await queryInterface.renameColumn('Group', 'zip', 'zipCode');
  },

  down: async queryInterface => {
    await queryInterface.renameColumn('Group', 'zipCode', 'zip');
  }
};
