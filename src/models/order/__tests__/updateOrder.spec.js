import fetch from 'node-fetch';
import db, { Order, Payment, OrderItem, OrderHistory, OrderHistoryPayments, Reservation, GroupOrder, Group, GroupOrderBill } from 'Models';
import {
  order6,
  order1,
  order4,
  order7,
  order8,
  updateOrder1,
  updateOrder2,
  updateOrder3,
  updateOrder4,
  updateOrder5,
  updateOrder6,
  updateOrder7,
  updateOrder8,
  updateOrder9,
  updateOrder10,
  updateOrder11,
  paymentInput,
  paymentInput1,
  paymentInput2,
  ssPostPaymentResponse
} from 'Tests/__fixtures__';
import { ORDER_HISTORY_CHANGE_TYPES } from 'Constants';
jest.mock('node-fetch', () => jest.fn());

describe.skip('When testing update order method', () => {
  it(`should ${updateOrder1.title}`, async () => {
    //create order
    const parentTransaction = await db.sequelize.transaction();
    const [orderData] = await Order.createOrder(order1.input, order1.cost, parentTransaction);
    await parentTransaction.commit();

    updateOrder1.input.orderId = orderData.toJSON().id;
    const [updatedOrderData, errorMessage] = await Order.updateOrder(updateOrder1.input, 1, 1);

    expect(errorMessage).toBeUndefined();

    const order = orderData.toJSON();
    const updatedOrder = updatedOrderData.toJSON();
    expect(updatedOrder).toHaveProperty('orderItems', 'event', 'payments');
    expect(updatedOrder.orderItems.length).toEqual(1);
    expect(updatedOrder.event.id).toEqual(1);
    expect(Date.parse(updatedOrder.updatedAt.toISOString())).toBeGreaterThanOrEqual(Date.parse(order.updatedAt.toISOString()));
  });

  it(`should ${updateOrder2.title}`, async () => {
    //create order
    let parentTransaction = await db.sequelize.transaction();
    const [orderData, createOrderError] = await Order.createOrder(order1.input, order1.cost, parentTransaction);
    await parentTransaction.commit();
    expect(createOrderError).toBeUndefined();

    const orderId = orderData.toJSON().id;

    //create payment record
    parentTransaction = await db.sequelize.transaction();
    paymentInput.orderId = orderId;
    const [payment, addPaymentError] = await Payment.addPayment(paymentInput, parentTransaction);
    await parentTransaction.commit();
    expect(payment.ssChargeId).toEqual(paymentInput.ssChargeId);
    expect(addPaymentError).toBeNull();

    const response = Promise.resolve(ssPostPaymentResponse);
    fetch.mockImplementation(() => response);

    //updateOrder
    updateOrder2.input.orderId = orderId;
    updateOrder2.input.refundInformation = updateOrder2.input.refundInformation.map(refundInfo => ({ ...refundInfo, orderId }));
    const [, errorMessage] = await Order.updateOrder(updateOrder2.input, 1, 1);

    expect(errorMessage).toBeUndefined();

    //check payment table for refund
    const refund = await Payment.findOne({ where: { amount: -updateOrder2.input.refundInformation[0].amount } });
    expect(refund.amount).toBe(-updateOrder2.input.refundInformation[0].amount);
  });

  it(`should ${updateOrder3.title}`, async () => {
    //create order
    let parentTransaction = await db.sequelize.transaction();
    const [orderData, createOrderError] = await Order.createOrder(order6.input, order6.cost, parentTransaction);
    await parentTransaction.commit();
    expect(createOrderError).toBeUndefined();

    const orderId = orderData.toJSON().id;

    //updateOrder
    updateOrder3.input.orderId = orderId;
    const [, errorMessage] = await Order.updateOrder(updateOrder3.input, 1, 1);

    expect(errorMessage).toBeUndefined();

    //check group order bill table for refund
    const refund = await GroupOrderBill.findOne({ where: { amount: updateOrder3.input.groupOrderPayment.amount } });
    expect(refund.amount).toBe(updateOrder3.input.groupOrderPayment.amount);
  });

  it(`should ${updateOrder4.title}`, async () => {
    //create order
    let parentTransaction = await db.sequelize.transaction();
    const [orderData, createOrderError] = await Order.createOrder(order4.input, order4.cost, parentTransaction);
    await parentTransaction.commit();
    expect(createOrderError).toBeUndefined();

    const orderId = orderData.toJSON().id;
    const data = await OrderItem.findOne({ where: { orderId, xRefTypeId: 4 } });
    //expect(data).toBeUndefined()
    updateOrder4.input.reservations[0].reservationId = data.xProductId;

    //updateOrder
    updateOrder4.input.orderId = orderId;
    const [, errorMessage] = await Order.updateOrder(updateOrder4.input, 1, 1);

    expect(errorMessage).toBeUndefined();

    //check order history for no refund details
    const { newValues, id } = await OrderHistory.findOne({ where: { orderId, changeType: ORDER_HISTORY_CHANGE_TYPES.orderChange } });
    const result = await OrderHistoryPayments.findOne({ where: { orderHistoryId: id } }); // returns null
    const { quantity } = await OrderItem.findOne({ where: { orderId, xProductId: data.xProductId, xRefTypeId: 4 } });
    expect(quantity).toEqual(updateOrder4.output.quantity);
    expect(result).toBeDefined();
    expect(newValues.noRefundReason).toBe(`NO REFUND: ${updateOrder4.input.noRefund.notes}`);
  });

  it(`should ${updateOrder5.title}`, async () => {
    //create order
    let parentTransaction = await db.sequelize.transaction();
    const [orderData, createOrderError] = await Order.createOrder(order4.input, order4.cost, parentTransaction);
    await parentTransaction.commit();
    expect(createOrderError).toBeUndefined();

    const orderId = orderData.toJSON().id;

    //updateOrder
    updateOrder5.input.orderId = orderId;
    updateOrder5.input.refundInformation = updateOrder5.input.refundInformation.map(refundInfo => ({ ...refundInfo, orderId }));
    const { xProductId } = await OrderItem.findOne({ where: { orderId, xRefTypeId: 4 } });
    updateOrder5.input.reservations = updateOrder5.input.reservations.map(r => ({ ...r, reservationId: xProductId }));
    //updateOrder5.input.reservations[0].reservationId = xProductId
    const [, errorMessage] = await Order.updateOrder(updateOrder5.input, 1, 1);

    expect(errorMessage).toBeUndefined();

    //check order history for no refund details
    const history = await OrderHistory.findAll({ where: { orderId, changeType: ORDER_HISTORY_CHANGE_TYPES.orderChange } });
    expect(history).toBeDefined();

    let id = history[0].id;
    const result = await OrderHistoryPayments.findOne({ where: { orderHistoryId: id } });
    expect(result.paymentId).not.toEqual(-1);
    expect(result.paymentId).toBeGreaterThanOrEqual(1);
  });

  //test for product change
  it(`should ${updateOrder6.title}`, async () => {
    //create order
    let parentTransaction = await db.sequelize.transaction();
    const [orderData, createOrderError] = await Order.createOrder(order1.input, order1.cost, parentTransaction);
    await parentTransaction.commit();
    expect(createOrderError).toBeUndefined();

    const orderId = orderData.toJSON().id;

    //updateOrder
    updateOrder6.input.orderId = orderId;
    const { xProductId } = await OrderItem.findOne({ where: { orderId } });
    expect(xProductId).toBeDefined();

    updateOrder6.input.reservations = updateOrder6.input.reservations.map(reservation => ({ ...reservation, reservationId: xProductId }));
    const [, errorMessage] = await Order.updateOrder(updateOrder6.input, 1, 1);
    expect(errorMessage).toBeUndefined();

    const results = await Reservation.findOne({ where: { id: xProductId } });
    expect(results.xProductId).toBeDefined();
    expect(results.xProductId).toBe(updateOrder6.output.xProductId);
  });

  it(`should ${updateOrder7.title}`, async () => {
    //create order
    let parentTransaction = await db.sequelize.transaction();
    const [orderData, createOrderError] = await Order.createOrder(order1.input, order1.cost, parentTransaction);
    await parentTransaction.commit();
    expect(createOrderError).toBeUndefined();

    const orderId = orderData.toJSON().id;

    //updateOrder
    updateOrder7.input.orderId = orderId;
    const { xProductId } = await OrderItem.findOne({ where: { orderId } });
    expect(xProductId).toBeDefined();

    updateOrder7.input.reservations = updateOrder7.input.reservations.map(reservation => ({ ...reservation, reservationId: xProductId }));
    const [, errorMessage] = await Order.updateOrder(updateOrder7.input, 1, 1);
    expect(errorMessage).toBeDefined();
    expect(errorMessage).toEqual(updateOrder7.output.errorMessage);
  });

  it(`should ${updateOrder8.title}`, async () => {
    //create order
    let parentTransaction = await db.sequelize.transaction();
    const [orderData, createOrderError] = await Order.createOrder(order7.input, order7.cost, parentTransaction);
    await parentTransaction.commit();
    expect(createOrderError).toBeUndefined();

    const orderId = orderData.toJSON().id;
    paymentInput1.orderId = orderId;

    parentTransaction = await db.sequelize.transaction();
    const [, addPaymentError] = await Payment.addPayment(paymentInput1, parentTransaction);
    await parentTransaction.commit();
    expect(addPaymentError).toBeNull();

    //updateOrder
    updateOrder8.input.orderId = orderId;
    const { xProductId } = await OrderItem.findOne({ where: { orderId } });
    expect(xProductId).toBeDefined();

    updateOrder8.input.reservations = updateOrder8.input.reservations.map(reservation => ({ ...reservation, reservationId: xProductId }));
    const [, errorMessage] = await Order.updateOrder(updateOrder8.input, 1, 1);
    expect(errorMessage).toBeUndefined();

    const payments = await Payment.findAll({ where: { orderId } });
    const total = payments.reduce((acc, curr) => (acc += curr.amount), 0);
    expect(total.toFixed(2)).toEqual(updateOrder8.output.total.toFixed(2));
  });

  it(`should ${updateOrder9.title}`, async () => {
    //create order
    let parentTransaction = await db.sequelize.transaction();
    const [orderData, createOrderError] = await Order.createOrder(order7.input, order7.cost, parentTransaction);
    await parentTransaction.commit();
    expect(createOrderError).toBeUndefined();

    const orderId = orderData.toJSON().id;
    paymentInput1.orderId = orderId;

    parentTransaction = await db.sequelize.transaction();
    const [, addPaymentError] = await Payment.addPayment(paymentInput1, parentTransaction);
    await parentTransaction.commit();
    expect(addPaymentError).toBeNull();

    //updateOrder
    updateOrder9.input.orderId = orderId;
    const { xProductId } = await OrderItem.findOne({ where: { orderId } });
    expect(xProductId).toBeDefined();

    updateOrder9.input.reservations = updateOrder9.input.reservations.map(reservation => ({ ...reservation, reservationId: xProductId }));
    const [, errorMessage] = await Order.updateOrder(updateOrder9.input, 1, 1);
    expect(errorMessage).toBeUndefined();

    const payments = await Payment.findAll({ where: { orderId } });
    const total = payments.reduce((acc, curr) => (acc += curr.amount), 0);
    expect(total.toFixed(2)).toEqual(updateOrder9.output.total.toFixed(2));
  });

  it(`should ${updateOrder9.title}`, async () => {
    //create order
    let parentTransaction = await db.sequelize.transaction();
    const [orderData, createOrderError] = await Order.createOrder(order7.input, order7.cost, parentTransaction);
    await parentTransaction.commit();
    expect(createOrderError).toBeUndefined();

    const orderId = orderData.toJSON().id;
    paymentInput1.orderId = orderId;

    parentTransaction = await db.sequelize.transaction();
    const [, addPaymentError] = await Payment.addPayment(paymentInput1, parentTransaction);
    await parentTransaction.commit();
    expect(addPaymentError).toBeNull();

    //updateOrder
    updateOrder9.input.orderId = orderId;
    const { xProductId } = await OrderItem.findOne({ where: { orderId } });
    expect(xProductId).toBeDefined();

    updateOrder9.input.reservations = updateOrder9.input.reservations.map(reservation => ({ ...reservation, reservationId: xProductId }));
    const [, errorMessage] = await Order.updateOrder(updateOrder9.input, 1, 1);
    expect(errorMessage).toBeUndefined();

    const payments = await Payment.findAll({ where: { orderId } });
    const total = payments.reduce((acc, curr) => (acc += curr.amount), 0);
    expect(total.toFixed(2)).toEqual(updateOrder9.output.total.toFixed(2));
  });

  it(`should ${updateOrder10.title}`, async () => {
    //create order
    let parentTransaction = await db.sequelize.transaction();
    const [orderData, createOrderError] = await Order.createOrder(order8.input, order8.cost, parentTransaction);
    await parentTransaction.commit();
    expect(createOrderError).toBeUndefined();

    const orderId = orderData.toJSON().id;
    paymentInput2.orderId = orderId;

    parentTransaction = await db.sequelize.transaction();
    const [, addPaymentError] = await Payment.addPayment(paymentInput2, parentTransaction);
    await parentTransaction.commit();
    expect(addPaymentError).toBeNull();

    //updateOrder
    updateOrder10.input.orderId = orderId;

    const orderItem = await OrderItem.findOne({ where: { orderId: orderId } });
    const orderItemId = orderItem.id;
    updateOrder10.input.addOns[0].orderItemId = orderItemId;

    const [, errorMessage] = await Order.updateOrder(updateOrder10.input, 1, 1);
    expect(errorMessage).toBeUndefined();

    const payments = await Payment.findAll({ where: { orderId } });
    const total = payments.reduce((acc, curr) => (acc += curr.amount), 0);
    expect(total.toFixed(2)).toEqual(updateOrder10.output.total.toFixed(2));
  });

  it(`should ${updateOrder11.title}`, async () => {
    //create order
    let parentTransaction = await db.sequelize.transaction();
    const [orderData, createOrderError] = await Order.createOrder(order8.input, order8.cost, parentTransaction);
    await parentTransaction.commit();
    expect(createOrderError).toBeUndefined();

    const orderId = orderData.toJSON().id;
    paymentInput2.orderId = orderId;

    parentTransaction = await db.sequelize.transaction();
    const [, addPaymentError] = await Payment.addPayment(paymentInput2, parentTransaction);
    await parentTransaction.commit();
    expect(addPaymentError).toBeNull();

    //updateOrder
    updateOrder11.input.orderId = orderId;

    const orderItem = await OrderItem.findOne({ where: { orderId: orderId } });
    const orderItemId = orderItem.id;
    updateOrder11.input.addOns.forEach(addOn => {
      if (addOn.type !== 'add') addOn.orderItemId = orderItemId;
    });

    const [, errorMessage] = await Order.updateOrder(updateOrder11.input, 1, 1);
    expect(errorMessage).toBeUndefined();

    const payments = await Payment.findAll({ where: { orderId } });
    const total = payments.reduce((acc, curr) => (acc += curr.amount), 0);
    expect(total.toFixed(2)).toEqual(updateOrder11.output.total.toFixed(2));
  });

  beforeEach(async () => {
    await Payment.destroy({ where: {}, restartIdentity: true });
    await Reservation.destroy({ where: {}, restartIdentity: true });
    await OrderItem.destroy({ where: {}, restartIdentity: true });
    await OrderHistoryPayments.destroy({ where: {}, restartIdentity: true });
    await OrderHistory.destroy({ where: {}, restartIdentity: true });
    await GroupOrder.destroy({ where: {}, restartIdentity: true });
    await GroupOrderBill.destroy({ where: {}, restartIdentity: true });
    await Group.destroy({ where: {}, restartIdentity: true });
    await Order.destroy({ where: {}, restartIdentity: true });
  });
});
