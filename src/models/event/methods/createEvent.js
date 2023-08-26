// @flow
import moment from 'moment';
import type { EventInputType, EventUpsertType } from '../types';
import { STALL_PRODUCT_X_REF_TYPE_ID, RV_PRODUCT_X_REF_TYPE_ID } from 'Constants';
import { Op } from 'sequelize';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

const SECURED = 'secured';
const UNSECURED = 'unsecured';

export const getDelayGroupName = (eventName: string) => `Delayed Payments - Event ${eventName}`;

const createGroupForDelayPayment = async (renterGroupCodeMode: string, eventName: string, venueId: number, roleId, group, transaction) => {
  if (renterGroupCodeMode === UNSECURED) {
    return await group.createGroup(
      {
        name: getDelayGroupName(eventName)
      },
      venueId,
      roleId,
      { transaction }
    );
  }
};

async function createEvent(input: EventInputType, venueId: number, roleId: number): Promise<EventUpsertType> {
  validateAction(MENU.EVENTS, ACTIONS[MENU.EVENTS].CREATE_EVENT, roleId);
  const { StallProduct, StallProductStall, RVProduct, RVProductRVSpot, AddOnProduct, ProductQuestion, Group } = this.sequelize.models;
  const transaction = await this.sequelize.transaction();

  try {
    const { stallFlip, rvFlip, stallProducts = [], rvProducts = [], addOnProducts = [], stallQuestions = [], rvQuestions = [], ...eventInput } = input;

    const payload = {
      ...eventInput,
      venueId,
      startDate: moment.utc(eventInput.startDate).format('YYYY-MM-DD'),
      endDate: moment.utc(eventInput.endDate).format('YYYY-MM-DD'),
      closeDate: moment(eventInput.closeDate),
      openDate: moment(eventInput.openDate),
      isGroupCodeRequired: eventInput.renterGroupCodeMode === SECURED ? true : eventInput.renterGroupCodeMode.length ? false : null,
      stallFlip,
      rvFlip
    };

    const existingEvents = await this.findAll({
      where: {
        venueId,
        [Op.or]: {
          startDate: { [Op.between]: [payload.startDate, payload.endDate] },
          endDate: { [Op.between]: [payload.startDate, payload.endDate] },
          [Op.and]: {
            startDate: { [Op.lte]: payload.startDate },
            endDate: { [Op.gte]: payload.endDate }
          }
        }
      }
    });

    for (const event of existingEvents) {
      if ((event.stallFlip != stallFlip && stallProducts.length) || (event.rvFlip != rvFlip && rvProducts.length)) {
        throw new Error(
          `Unable to create event because '${String(event.name).toUpperCase()}' has Stall flipping ${
            event.stallFlip ? 'enabled' : 'disabled'
          } and RV flipping ${event.rvFlip ? 'enabled' : 'disabled'}`
        );
      }
    }

    const [newEvent] = await this.upsert(payload, { returning: true, transaction });
    const eventId = newEvent.id;

    for (const stallProduct of stallProducts) {
      const newStallProduct = await StallProduct.create({ ...stallProduct, eventId }, { transaction });
      const newStallProductStallData = stallProduct.stalls.map(stall => ({
        stallProductId: newStallProduct.id,
        stallId: stall
      }));
      const { id: stallProductId } = newStallProduct;
      for (const question of stallProduct.questions || []) {
        await ProductQuestion.create({ ...question, stallProductId }, { transaction });
      }
      await StallProductStall.bulkCreate(newStallProductStallData, { transaction });
    }

    for (const rvProduct of rvProducts) {
      const newRVPRoduct = await RVProduct.create({ ...rvProduct, eventId }, { transaction });
      const newRVProductStallData = rvProduct.rvSpots.map(rvSpot => ({
        rvProductId: newRVPRoduct.id,
        rvSpotId: rvSpot
      }));

      const { id: rvProductId } = newRVPRoduct;
      for (const question of rvProduct.questions || []) {
        await ProductQuestion.create({ ...question, rvProductId }, { transaction });
      }
      await RVProductRVSpot.bulkCreate(newRVProductStallData, { transaction });
    }

    for (const question of stallQuestions) {
      await ProductQuestion.createProductQuestion({ ...question, productXRefType: STALL_PRODUCT_X_REF_TYPE_ID, eventId, venueId }, { transaction });
    }

    for (const question of rvQuestions) {
      await ProductQuestion.createProductQuestion({ ...question, productXRefType: RV_PRODUCT_X_REF_TYPE_ID, eventId, venueId }, { transaction });
    }

    for (const addOnProduct of addOnProducts) {
      await AddOnProduct.create({ ...addOnProduct, eventId }, { transaction });
    }

    await createGroupForDelayPayment(eventInput.renterGroupCodeMode, eventInput.name, venueId, roleId, Group, transaction);

    await transaction.commit();
    return {
      event: newEvent,
      success: true,
      error: null
    };
  } catch (error) {
    await transaction.rollback();
    return {
      event: null,
      success: false,
      error: `${error}`
    };
  }
}

export default createEvent;
