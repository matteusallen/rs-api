'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('User', [
      {
        password: '$2a$10$zxwW8jTQRAmbMxpGgAym1O/j4DUTfh7hPfO1WPoadY0CrSh7WKhg6',
        ssGlobalId: 'cWEtYWRtaW5AbWFpbC5jb20=',
        roleId: '1'
      }
    ]);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('User', null, {});
  }
};
