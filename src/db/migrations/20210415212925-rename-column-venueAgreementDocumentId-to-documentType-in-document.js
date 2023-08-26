'use strict';

module.exports = {
  up: async queryInterface => {
    await queryInterface.renameColumn('Document', 'venueAgreementDocumentId', 'documentType');
  },

  down: async queryInterface => {
    await queryInterface.renameColumn('Document', 'documentType', 'venueAgreementDocumentId');
  }
};
