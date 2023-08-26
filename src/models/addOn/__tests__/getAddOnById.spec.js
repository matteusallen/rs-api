import { AddOn } from 'Models';

describe('When testing getAddOnById method', () => {
  it('should find AddOn by valid id', async () => {
    //insert an addOn
    const addOn = await AddOn.create({
      name: 'Scrubbing Brush',
      description: 'To remove extra fur from horses.'
    });

    const newlyInsertedAddOn = addOn.toJSON();

    //find the newly inserted addOn
    const [res, errorMessage] = await AddOn.getAddOnById(newlyInsertedAddOn.id, 1);
    expect(newlyInsertedAddOn).toStrictEqual(res.toJSON());
    expect(errorMessage).toBeUndefined();
  });

  it('should return null for invalid id', async () => {
    const [res, errorMessage] = await AddOn.getAddOnById(100, 1);
    expect(res).toBeNull();
    expect(errorMessage).toBeUndefined();
  });
});
