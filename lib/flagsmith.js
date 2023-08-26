import Flagsmith from 'flagsmith-nodejs';

const flagsmith = new Flagsmith({
  environmentKey: process.env.FLAGSMITH_SECRET_KEY
});

export const checkIfFeatureIsEnabled = async flag => {
  const flags = await flagsmith.getEnvironmentFlags();

  return flags.isFeatureEnabled(flag);
};
