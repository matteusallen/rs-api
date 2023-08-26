async function getUserRoleById(id) {
  const { UserRole } = this.sequelize.models;
  return await UserRole.findOne({
    attributes: ['id', 'name'],
    where: { id },
    raw: true
  });
}

export default getUserRoleById;
