// @flow
import type { GroupByUniqueTextType } from '../types';
import type { GroupType } from '../types';

async function getGroupByUniqueText(input: GroupByUniqueTextType): Promise<GroupType | void> {
  try {
    const { name, venueId } = input;
    const group = await this.findOne({
      where: {
        uniqueText: getUniqueText(name, venueId),
        deletedAt: null
      }
    });

    return group;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw new Error('Unable to find group');
  }
}

export const getUniqueText = (eventName: string, venueId: number) => {
  return `delayed payments - event ${eventName.toLowerCase()}-${venueId}`;
};

export default getGroupByUniqueText;
