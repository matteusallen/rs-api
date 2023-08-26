'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const addColumn = async (columns, options) => queryInterface.addColumn('user', columns, options);
    const columns = [addColumn('token', { type: Sequelize.STRING }), addColumn('tokenExpirationDate', { type: Sequelize.DATE })];
    return Promise.all(columns);
  },

  down: queryInterface => {
    const removeColumn = async field => queryInterface.removeColumn('user', field);
    const columns = [removeColumn('token'), removeColumn('tokenExpirationDate')];
    return Promise.all(columns);
  }
};
