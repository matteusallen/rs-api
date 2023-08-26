// @flow
import { ssPost } from 'Utils/ssNetworkRequests';

type SaveCardInputType = {|
  amount: number,
  description?: string,
  saveCard?: boolean,
  selectedCard?: string,
  ssGlobalId: string,
  stripeAccountType: string,
  token?: string,
  transfer_data: {
    destination: string
  }
|};

type SaveCardReturnType = {|
  card: {
    last4: string
  }
|};

async function saveCard(paymentInfo: SaveCardInputType): Promise<[SaveCardReturnType | void, string | void]> {
  try {
    const { data } = await ssPost(`/payment/saveCard`, paymentInfo);
    if (!data.success) throw Error(data.error.raw ? data.error.raw.message : JSON.stringify(data));
    return [data.data, undefined];
  } catch (error) {
    return [undefined, error.message];
  }
}

export default saveCard;
