const seedFactory = (TableName, next) => async queryInterface => {
  return next(queryInterface);
};

export default seedFactory;
