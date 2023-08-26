'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('Group', [
      {
        name: 'Group 1',
        contactName: 'Contact 1',
        email: 'email',
        phone: 'phone',
        allowDeferred: true,
        venueId: 1,
        createdAt: '2021-06-18 07:22:26.295-05',
        updatedAt: '2021-06-18 07:22:26.295-05',
        uniqueText: 'some text',
        code: '5KF1O'
      }
    ]);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('Group', null, {});
  }
};
