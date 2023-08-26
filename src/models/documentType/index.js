const DocumentType = (sequelize, Sequelize) => {
  const DocumentType = sequelize.define(
    'DocumentType',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      }
    },
    {
      freezeTableName: true,
      tableName: 'DocumentType',
      paranoid: true
    }
  );

  DocumentType.associate = models => {
    DocumentType.hasMany(models.Document, {
      foreignKey: 'documentType',
      as: 'documents'
    });
  };

  return DocumentType;
};

export default DocumentType;
