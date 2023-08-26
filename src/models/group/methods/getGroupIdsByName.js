// @flow
async function getGroupIdsByName(name: string): Promise<[number]> {
  const groups = await this.findAll({
    where: {
      name: this.sequelize.where(this.sequelize.fn('LOWER', this.sequelize.col('Group.name')), 'LIKE', `%${name.toLowerCase()}%`)
    },
    attributes: ['id']
  });

  const groupIds = groups.map(group => group.id);

  return groupIds;
}

export default getGroupIdsByName;
