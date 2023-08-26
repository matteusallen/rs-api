import { Op } from 'sequelize';
import { getNumberOfNights } from '../../../utils/formatDate';

export const getRvs = async (OrderHistoryPayments, OrderHistory, paymentId) => {
  const historyIds = await getHistoryIds(OrderHistoryPayments, paymentId);
  const histories = await getHistoriesFromIds(OrderHistory, historyIds);

  const rvs = histories.find(h => !!h.newValues?.rvs)?.newValues.rvs;
  return rvs;
};

export const getHistoryIds = async (OrderHistoryPayments, paymentId) => {
  const historyIds = (
    await OrderHistoryPayments.findAll({
      where: { paymentId },
      attributes: ['orderHistoryId']
    })
  ).map(oh => oh.orderHistoryId);

  return historyIds;
};

export const getHistoriesFromIds = async (OrderHistory, historyIds) => {
  const histories = await OrderHistory.findAll({
    where: { id: { [Op.in]: historyIds } },
    attributes: ['newValues']
  });

  return histories;
};

export const getRVProduct = async (RVProduct, id) => {
  const rvProduct = await RVProduct.findOne({
    where: { id },
    attributes: ['name', 'price', 'nightly']
  });

  return rvProduct;
};

export const getRVData = (rvProduct, rvs) => {
  const numberOfNights = rvProduct.nightly ? getNumberOfNights(rvs.startDate, rvs.endDate) : 1;
  return {
    rvSpotName: rvProduct.name,
    rvSpotCount: rvs.quantity,
    rvSpotPrice: rvProduct.price,
    rvSpotSubtotal: rvs.quantity * rvProduct.price * numberOfNights
  };
};
