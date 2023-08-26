'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const options = {
      type: Sequelize.STRING,
      allowNull: true
    };

    return Promise.all([
      queryInterface.changeColumn('Group', 'email', options),
      queryInterface.changeColumn('Group', 'phone', options),
      queryInterface.changeColumn('Group', 'street', options),
      queryInterface.changeColumn('Group', 'city', options),
      queryInterface.changeColumn('Group', 'state', options),
      queryInterface.changeColumn('Group', 'zipCode', { ...options, type: Sequelize.INTEGER }),
      queryInterface.changeColumn('Group', 'contactName', options)
    ]);
  },

  down: (queryInterface, Sequelize) => {
    const options = {
      type: Sequelize.STRING,
      allowNull: false
    };

    return Promise.all([
      queryInterface.changeColumn('Group', 'email', options),
      queryInterface.changeColumn('Group', 'phone', options),
      queryInterface.changeColumn('Group', 'street', options),
      queryInterface.changeColumn('Group', 'city', options),
      queryInterface.changeColumn('Group', 'state', options),
      queryInterface.changeColumn('Group', 'zipCode', { ...options, type: Sequelize.INTEGER }),
      queryInterface.changeColumn('Group', 'contactName', options)
    ]);
  }
};
