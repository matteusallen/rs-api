import { Group } from 'Models';
import { generateGroupCode } from 'Utils';

const mockGroup1 = {
  name: 'Group Two',
  allowDeferred: false,
  contactName: 'Borris Helrat',
  email: 'bhelrat@mail.com',
  phone: '5555555555'
};

const GROUP_CODE_LENGTH = 5;

describe('Test Group Code', () => {
  it(`creates a group and corresponding group code`, async () => {
    const group = await Group.createGroup(mockGroup1, 1, 1);

    expect(group.code).toBeDefined();
  });

  it(`should refresh a group code by id`, async () => {
    const [group] = await Group.findAll();
    const oldGroupCode = group.code;
    const newCode = await Group.refreshCode(group.id, 1, 1);

    expect(oldGroupCode).not.toBe(newCode);
  });

  it(`generateCode util should generate a code base on the group name and venue id`, async () => {
    const code = generateGroupCode('My cool group name', 1);

    expect(code).toBeDefined();
    expect(code.length).toBe(GROUP_CODE_LENGTH);
  });
});
