#!/usr/bin/env node
const fetch = require('node-fetch');
require('dotenv-safe').config();
const getApiUrl = require('../src/helpers/getApiUrl');
const { sendMessage } = require('../src/lib/slack');

async function getPayoutsFromStripe() {
  // eslint-disable-next-line no-console
  console.log('Payout worker started');
  try {
    const headers = {
      headers: {
        'Content-Type': 'application/json',
        token: process.env.GATEWAY_TOKEN,
        origin: 'http://open-stalls-api-prod.herokuapp.com'
      },
      method: 'POST'
    };
    const apiUrl = getApiUrl(process.env.DEPLOYMENT_ENV);
    const url = `${apiUrl}/admin/stripe-payouts`;
    const result = await fetch(url, headers);
    const { status } = result;
    if (status !== 200) {
      // eslint-disable-next-line no-console
      console.log('Payouts worker returned invalid response:', result);
      await sendMessage(`Payouts worker failed with message: ${JSON.stringify(result)}`);
      return;
    }
    // eslint-disable-next-line no-console
    console.log('Payouts worker result:', await result.json());
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Payouts worker error:', error);
    await sendMessage(`Payouts worker error: ${JSON.stringify(error)}`);
  }
}

getPayoutsFromStripe();
