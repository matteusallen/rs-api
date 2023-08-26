import { Op } from 'sequelize';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function updateReservationSpaces(reservationId, spaceIds, transaction, roleId) {
  validateAction(MENU.ORDERS, ACTIONS[MENU.RESERVATION_SPACES].PRODUCT_ASSIGNMENT, roleId);
  try {
    const { ReservationSpace } = this.sequelize.models;

    const existingSpaceIds = await ReservationSpace.findAll({
      attributes: ['spaceId'],
      where: { reservationId }
    }).then(data => data.map(rs => rs.spaceId));

    await ReservationSpace.destroy({
      where: { reservationId, spaceId: { [Op.in]: existingSpaceIds } },
      transaction
    });
    if (spaceIds.length) {
      const newSpaceData = spaceIds.reduce((acc, spaceId) => {
        acc.push({ spaceId, reservationId });
        return acc;
      }, []);
      const newSpaces = await ReservationSpace.bulkCreate(newSpaceData, { transaction });
      return [newSpaces, undefined];
    }
    return [[], undefined];
  } catch (error) {
    return [undefined, error];
  }
}

export default updateReservationSpaces;
