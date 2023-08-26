// @flow
async function editAddonPrice(addOnId: number | string, price: number) {
  const addOnProduct = await this.findOne({ where: { id: addOnId } });
  addOnProduct.price = price;
  await addOnProduct.save();
}

export default editAddonPrice;
