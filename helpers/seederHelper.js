const createQuery = db => ({
  from: tableName => ({
    select: columns => db.query(`Select ${columns.join(',')} from "${tableName}"`).then(res => res[0])
    // TODO: selectWhere
    // TODO: add insert
    // TODO: add update
    // TODO: add addColumns
    // TODO: add removeColumns
  })
});

export default createQuery;
