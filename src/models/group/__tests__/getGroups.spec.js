import { Group, GroupOrder } from 'Models';

const groupTrue = {
  name: 'Group True',
  allowDeferred: true,
  contactName: 'Borris Helrat',
  email: 'bhelrat@mail.com',
  phone: '5555555555'
};

describe('Test GetGroups Function', () => {
  it('Get All, Get allowDeferred = true', async () => {
    const groupWithDeferredPayment = await Group.createGroup(groupTrue, 1, 1);
    expect(!!groupWithDeferredPayment.id).toBe(true);

    const groupsAll = await Group.getGroups(1, undefined, 1);
    expect(groupsAll.length).toBe(1);

    const groupsTrue = await Group.getGroups(1, true, 1);
    expect(groupsTrue.length).toBe(1);
    expect(groupsTrue[0].allowDeferred).toBe(true);
  });

  beforeEach(async () => {
    await GroupOrder.destroy({ where: {}, restartIdentity: true });
    await Group.destroy({ where: {}, restartIdentity: true });
  });
});
