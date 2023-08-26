import { ssPost } from 'Utils/ssNetworkRequests';

async function refund(input) {
  try {
    const { data } = await ssPost('/payment/refund', input);
    if (!data.success) throw Error(data.error.raw ? data.error.raw.message : 'Error refunding payment');
    return data;
  } catch (error) {
    return {
      error: `There was a problem refunding: ${error.message}`,
      success: false
    };
  }
}

export default refund;
