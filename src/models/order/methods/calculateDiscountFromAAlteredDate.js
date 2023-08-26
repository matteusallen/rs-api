import { getDbDateRange, addToDate } from 'Utils/formatDate';

async function calculateDiscountFromAlteredDate(existingOrderItems, orderItems) {
  if (!existingOrderItems.length) return 0;
  const { ProductXRefType, Order } = this.sequelize.models;
  let discount = 0;
  for (let oldItem of existingOrderItems) {
    let targeItem = orderItems.find(oi => oi.xRefTypeId === oldItem.xRefTypeId);
    const oldDates = getDbDateRange(oldItem.startDate, oldItem.endDate);

    const newDates = getDbDateRange(targeItem.startDate, targeItem.endDate);

    const removedDates = oldDates.filter(date => !newDates.includes(date));

    const itemType = await ProductXRefType.findOne({ where: { id: oldItem.xRefTypeId } });

    const productWhereClause = {
      where: { id: oldItem.xProductId }
    };

    const product = await this.sequelize.models[itemType.name].findOne(productWhereClause);
    let val = 0;

    for (let date of removedDates) {
      const startDate = date;
      const endDate = addToDate(date, 1, 'days');
      if (product.nightly) {
        const productDiscount = await Order.calculateProductDiscount(
          oldItem.xRefTypeId,
          oldItem.xProductId,
          startDate,
          endDate,
          product.price,
          oldItem.quantity
        );
        val += productDiscount.amount;
      }
    }

    discount += val;
  }

  return discount;
}

export default calculateDiscountFromAlteredDate;
