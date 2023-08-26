//@flow
import logger from 'Config/winston';

const shuffleCode = (code: string) =>
  code
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('')
    .replace(/ /g, '')
    .toUpperCase();

export const generateGroupCode = (groupName: string, venueId: number) => {
  logger.info(`Generating group code for: ${groupName}`);

  const nameWithoutSpaces = groupName.replace(/ /g, '');
  const nameLength = nameWithoutSpaces.length;
  const firstRandomNum = Math.floor(Math.random() * nameLength);
  const secondRandomNum = Math.floor(Math.random() * nameLength);
  const firstLetter = nameWithoutSpaces.charAt(firstRandomNum);
  const secondLetter = nameWithoutSpaces.charAt(secondRandomNum);
  const randomString = Math.random().toString(36).slice(2).toUpperCase();
  const randomNumber = Math.ceil(Math.random() * 9);
  const randomLetter = randomString.charAt(randomNumber);
  const venueIdLength = `${venueId}`.length;
  const generatedVenueId = venueIdLength === 1 ? venueId : `${venueId}`[0];
  const code = shuffleCode(`${firstLetter}${secondLetter}${generatedVenueId}${randomNumber}${randomLetter}`);

  return code;
};
