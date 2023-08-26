// @flow
import { GroupOrder } from 'Models';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

async function deleteGroup(id: string | number, roleId: number): Promise<boolean> {
  validateAction(MENU.GROUPS, ACTIONS[MENU.GROUPS].DELETE_GROUP, roleId);
  try {
    const groupOrders = await GroupOrder.getOrdersByGroupId(id, roleId);
    const activeGroupOrders = groupOrders.filter(groupOrder => groupOrder.deletedAt === null);

    if (activeGroupOrders.length) {
      throw new Error('Cannot delete groups with associated orders');
    }

    const result = await this.update({ deletedAt: Date.now() }, { where: { id } });

    return Boolean(result[0]);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw new Error(`Unable to delete group: ${error}`);
  }
}

export default deleteGroup;
