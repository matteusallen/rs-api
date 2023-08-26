'use strict';

module.exports = {
  up: queryInterface => {
    return Promise.all([
      queryInterface.removeColumn('Group', 'street'),
      queryInterface.removeColumn('Group', 'city'),
      queryInterface.removeColumn('Group', 'state'),
      queryInterface.removeColumn('Group', 'zipCode')
    ]);
  },

  down: (queryInterface, Sequelize) => {
    const initialOptions = {
      type: Sequelize.STRING,
      allowNull: true
    };

    return Promise.all([
      queryInterface.addColumn('Group', 'street', initialOptions),
      queryInterface.addColumn('Group', 'city', initialOptions),
      queryInterface.addColumn('Group', 'state', initialOptions),
      queryInterface.addColumn('Group', 'zipCode', initialOptions)
    ]);
  }
};
