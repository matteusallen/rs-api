// @flow
import moment from 'moment';
import { AddOnProduct, Event, Group, Order } from 'Models';
import type { EventInputType, EventUpsertType } from '../types';
import { ACTIONS } from '../../../constants/actions';
import { RENTER_GROUP_CODE_MODE } from '../../../constants/index';
import { MENU } from '../../../constants/menuOptions';
import { validateAction } from '../../../utils/actions';
import { getDelayGroupName } from '../../event/methods/createEvent';
import { getUniqueText } from '../../group/methods/getGroupByUniqueText';

async function editEvent(input: EventInputType, roleId: number): Promise<EventUpsertType> {
  validateAction(MENU.EVENTS, ACTIONS[MENU.EVENTS].EDIT_EVENT, roleId);
  const transaction = await this.sequelize.transaction();

  try {
    const existingEvent = await getExistingEvent(input.id);
    await validateDates(input, existingEvent);
    const updatedEvent = await updateEventData(input, transaction);
    await updateGroup(input, existingEvent, roleId);
    await addOrDeleteAddOns(input, transaction, roleId);
    await transaction.commit();

    return getSuccessResponse(updatedEvent);
  } catch (error) {
    await transaction.rollback();
    return getErrorResponse(error);
  }
}

const getExistingEvent = async eventId => {
  const existingEvent = await Event.findOne({ where: { id: eventId } });
  if (!existingEvent) throw Error('Event not found!');
  return existingEvent;
};

const updateEventData = async (input, transaction) => {
  const FIRST_UPDATED_EVENT = 0;
  const payload = getPayload(input);

  const [, updatedEvents] = await Event.update(payload, { where: { id: input.id }, transaction, returning: true });
  return updatedEvents[FIRST_UPDATED_EVENT];
};

const getPayload = input => {
  const payload = {
    name: input.name,
    description: input.description,
    checkInTime: input.checkInTime,
    checkOutTime: input.checkOutTime,
    venueAgreementDocumentId: input.venueAgreementDocumentId,
    venueMapDocumentId: input.venueMapDocumentId,
    isGroupCodeRequired: getRenterGroupCodeMode(input),
    startDate: moment.utc(input.startDate).format('YYYY-MM-DD'),
    endDate: moment.utc(input.endDate).format('YYYY-MM-DD'),
    openDate: moment(input.openDate),
    closeDate: moment(input.closeDate)
  };

  return payload;
};

const getRenterGroupCodeMode = ({ renterGroupCodeMode }) => {
  return renterGroupCodeMode === RENTER_GROUP_CODE_MODE.SECURED ? true : renterGroupCodeMode.length ? false : null;
};

const updateGroup = async (input, existingEvent, roleId) => {
  const { renterGroupCodeMode, name: eventName } = input;
  const { name: previousEventName, venueId } = existingEvent;

  if (EventNameWasUpdated(eventName, previousEventName)) {
    await updateGroupName(eventName, previousEventName, venueId);
  }
  if (delayedPaymentIsAllowed(renterGroupCodeMode)) {
    await createGroupIfNotFound(eventName, venueId, roleId);
  }
};

const EventNameWasUpdated = (eventName, previousEventName) => eventName !== previousEventName;

const updateGroupName = async (eventName, previousEventName, venueId) => {
  const group = await Group.getGroupByUniqueText({ name: previousEventName, venueId });
  if (group) {
    const newName = getDelayGroupName(eventName);
    const newUniqueText = getUniqueText(eventName, venueId);
    const updatedProps = { name: newName, uniqueText: newUniqueText, venueId: group.venueId };
    await Group.update(updatedProps, { where: { id: group.id } });
  }
};

const delayedPaymentIsAllowed = renterGroupCodeMode => {
  return renterGroupCodeMode === RENTER_GROUP_CODE_MODE.SECURED || renterGroupCodeMode === RENTER_GROUP_CODE_MODE.UNSECURED;
};

const createGroupIfNotFound = async (eventName, venueId, roleId) => {
  const group = await Group.getGroupByUniqueText({ name: eventName, venueId });
  if (!group) {
    const uniqueText = getUniqueText(eventName, venueId);
    const groupPayload = { name: getDelayGroupName(eventName), uniqueText };
    await Group.createGroup(groupPayload, venueId, roleId);
  }
};

const addOrDeleteAddOns = async (input, transaction, roleId) => {
  const { addOnProducts = [] } = input;
  const existingAddOns = await AddOnProduct.findAll({ where: { eventId: input.id }, attributes: ['id', 'addOnId', 'price', 'disabled'] });

  await editAddOns(existingAddOns, addOnProducts, roleId);
  await addNewAddOns(existingAddOns, addOnProducts, transaction, input.id);
  await deleteAddOns(existingAddOns, addOnProducts, transaction, input.id, roleId);
};

const editAddOns = async (existingAddOns, addOnProducts, roleId) => {
  for (const addOnProduct of addOnProducts) {
    const addOnFound = existingAddOns.find(addOn => +addOn.addOnId === +addOnProduct.addOnId);

    if (addOnFound && addOnFound.disabled !== addOnProduct.disabled) {
      await AddOnProduct.toggleAddonAvailability(addOnFound.id, roleId);
    }
    if (addOnFound && +addOnFound.price !== addOnProduct.price) {
      await AddOnProduct.editAddonPrice(addOnFound.id, addOnProduct.price);
    }
  }
};

const addNewAddOns = async (existingAddOns, addOnProducts, transaction, eventId) => {
  const addOnsToAdd = addOnProducts.filter(a => !existingAddOns.some(p => p.addOnId === +a.addOnId));
  addOnsToAdd.map(a => (a.eventId = +eventId));
  await AddOnProduct.bulkCreate(addOnsToAdd, { transaction });
};

const deleteAddOns = async (existingAddOns, addOnProducts, transaction, eventId, roleId) => {
  const addOnsToDelete = existingAddOns.filter(a => !addOnProducts.some(p => +p.addOnId === a.addOnId));

  for (const addOnProduct of addOnsToDelete) {
    await validateDeletingAddOn(addOnProduct.id, eventId, roleId);
    await AddOnProduct.destroy({ where: { id: addOnProduct.id }, transaction });
  }
};

const validateDeletingAddOn = async (addOnProductId, eventId, roleId) => {
  const isBooked = await AddOnProduct.booked(addOnProductId, eventId, roleId);
  if (isBooked) {
    throw new Error('Deleting addOn is not allowed');
  }
};

const getSuccessResponse = updatedEvent => {
  return {
    event: updatedEvent,
    success: true,
    error: null
  };
};

const getErrorResponse = error => {
  return {
    event: null,
    success: false,
    error: `${error}`
  };
};

const validateDates = async (input, existingEvent) => {
  const hasOrders = await checkIfhasOrders(input.id);
  const isDecreasingStartDate = checkIfStartIsDecreasing(existingEvent.startDate, input.startDate);
  const isDecreasingEndDate = checkIfEndIsDecreasing(existingEvent.endDate, input.endDate);

  if (hasOrders && (isDecreasingStartDate || isDecreasingEndDate)) {
    throw new Error('Decreasing dates is not allowed');
  }
};

const checkIfhasOrders = async eventId => {
  const order = await Order.findOne({
    where: { eventId, canceled: null }
  });

  return !!order;
};

const checkIfStartIsDecreasing = (initialDate, newDate) => {
  const utcNewDate = moment.utc(newDate).format('YYYY-MM-DD');
  return moment(utcNewDate).isAfter(moment(initialDate));
};

const checkIfEndIsDecreasing = (initialDate, newDate) => {
  const utcNewDate = moment.utc(newDate).format('YYYY-MM-DD');
  return moment(utcNewDate).isBefore(moment(initialDate));
};

export default editEvent;
