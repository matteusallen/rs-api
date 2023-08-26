import { Group } from 'Models';

const mockGroup1 = {
  name: 'Group One',
  allowDeferred: false,
  contactName: 'Borris Helrat',
  email: 'bhelrat@mail.com',
  phone: '5555555555'
};

describe('', () => {
  it(`creates and then deletes a group`, async () => {
    const group = await Group.createGroup(mockGroup1, 1, 1);
    expect(!!group.id).toBe(true);

    const deletedGroup = await Group.deleteGroup(group.id, 1);

    expect(deletedGroup).toBe(true);
  });
});
