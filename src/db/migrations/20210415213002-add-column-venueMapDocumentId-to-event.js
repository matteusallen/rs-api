'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Event', 'venueMapDocumentId', {
      type: Sequelize.DataTypes.INTEGER,
      references: { model: 'Document', key: 'id' },
      allowNull: true
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('Event', 'venueMapDocumentId');
  }
};
