'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const initializationOptions = {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    };

    /**
     * After extensively reading the docs, the only way to set a field that is both new AND required
     * is to initialize as a nullable field, then update values so no rows have a null value, and
     * then set `allowNull` to be false.
     */
    return Promise.all([queryInterface.addColumn('user', 'ssGlobalId', initializationOptions), queryInterface.removeColumn('user', 'ssUserId')]);
  },

  down: (queryInterface, Sequelize) => {
    const ssUserIdOptions = {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true
    };

    return Promise.all([queryInterface.removeColumn('user', 'ssGlobalId'), queryInterface.addColumn('user', 'ssUserId', ssUserIdOptions)]);
  }
};
