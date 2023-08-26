import { unallowedActionsByroles } from 'Constants';
import logger from 'Config/winston';

export const validateAction = (modelName, action, roleId) => {
  logger.info(`Model: ${modelName} | Action: ${action} | RoleId: ${roleId}`);

  if (!roleId) {
    throw Error(`User role is unknown for action ${action}`);
  }

  if (unallowedActionsByroles[`${roleId}`][modelName]?.includes(action)) {
    throw Error(`You are not allowed to perform action ${action}.`);
  }
};
