'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const timestampFieldOptions = {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    };

    return Promise.all([
      queryInterface.changeColumn('user', 'createdAt', timestampFieldOptions),
      queryInterface.changeColumn('user', 'updatedAt', timestampFieldOptions)
    ]);
  },

  down: (queryInterface, Sequelize) => {
    const timestampFieldOptions = {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    };

    return Promise.all([
      queryInterface.changeColumn('user', 'createdAt', timestampFieldOptions),
      queryInterface.changeColumn('user', 'updatedAt', timestampFieldOptions)
    ]);
  }
};
