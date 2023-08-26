//@flow
import db, { Event, StallProduct, RVProduct, AddOn } from 'Models';
import { superAdmin } from 'Lib/auth';
import type { ContextType } from 'Types/context';

const updateEventAndProductInfo = async (_, { input }, context: ContextType) => {
  const t = await db.sequelize.transaction();
  try {
    const addOn = input.products.filter(product => product.type === 'ao');
    const rvSpotProduct = input.products.filter(product => product.type === 'rv');
    const stallProduct = input.products.filter(product => product.type === 'st');

    await Promise.all([
      await Event.updateEventInfo(input.event, t, context?.user?.roleId),
      await RVProduct.updateRVProductInfo(rvSpotProduct, t, context?.user?.roleId),
      await StallProduct.updateStallProductInfo(stallProduct, t, context?.user?.roleId),
      await AddOn.updateAddOnInfo(addOn, t, context?.user?.roleId)
    ]);

    await t.commit();
    return { success: true, error: '' };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    await t.rollback();
    return { success: false, error };
  }
};

const Mutation = {
  updateEventAndProductInfo: superAdmin(updateEventAndProductInfo)
};

const resolvers = {
  Mutation
};

export default resolvers;
