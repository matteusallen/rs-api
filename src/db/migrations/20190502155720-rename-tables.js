'use strict';

module.exports = {
  up: queryInterface => {
    return Promise.all([queryInterface.renameTable('user', 'User'), queryInterface.renameTable('venue', 'Venue')]);
  },

  down: queryInterface => {
    return Promise.all([queryInterface.renameTable('User', 'user'), queryInterface.renameTable('Venue', 'venue')]);
  }
};
