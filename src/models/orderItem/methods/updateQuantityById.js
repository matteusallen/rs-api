// @flow
type UpdateQuantityByIdType = {|
  orderItemId: number | string,
  quantity: number | string
|};

async function updateQuantityById(orderItem: UpdateQuantityByIdType, transaction: {}): Promise<void> {
  const { orderItemId: id, quantity } = orderItem;
  const { AddOnProduct } = this.sequelize.models;

  const orderItemRecord = await this.findOne({ where: { id } });
  const product = await AddOnProduct.findOne({ where: { id: orderItemRecord.xProductId } });
  const price = +quantity * +product.price;

  await this.update({ quantity, price }, { where: { id }, transaction });
}

export default updateQuantityById;
