import fetch from 'node-fetch';

export const sendMessage = async text => {
  try {
    const options = {
      method: 'post',
      body: JSON.stringify({ text })
    };
    return await fetch(process.env.SLACK_WEBHOOK_URL, options);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};
