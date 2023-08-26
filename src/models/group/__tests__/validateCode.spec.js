import { Group } from 'Models';

const mockGroup1 = {
  name: 'Group To Validate',
  allowDeferred: false,
  contactName: 'Borris Helrat',
  email: 'bhelrat@mail.com',
  phone: '5555555555'
};

describe('Test Validate Group Code', () => {
  it(`should validate a correct group code`, async () => {
    const group = await Group.createGroup(mockGroup1, 1, 1);

    expect(group.code).toBeDefined();

    const result = await Group.validateCode({ code: group.code });

    expect(result.code).not.toBe(null);
    expect(result.code).toBe(group.code);
  });

  it(`should validate a wrong group code`, async () => {
    const group = await Group.createGroup(mockGroup1, 1, 1);

    expect(group.code).toBeDefined();

    const result = await Group.validateCode({ code: 'xyz' });

    expect(result).toBe(null);
  });
});

beforeEach(async () => {
  await Group.destroy({ where: {}, restartIdentity: true });
});
