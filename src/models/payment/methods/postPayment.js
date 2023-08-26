// @flow
import { ssPost } from 'Utils/ssNetworkRequests';

type PostPaymentInputType = {|
  amount: number,
  application_fee_amount: number,
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

type PostPaymentReturnType = {|
  chargeId: number | string,
  paymentDetails: {
    card: {
      brand: string,
      last4: string
    }
  }
|};

async function postPayment(paymentInfo: PostPaymentInputType, isRenter: string): Promise<[PostPaymentReturnType | void, string | void]> {
  try {
    const { data } = await ssPost(`/payment/charge?renter=${isRenter || 'false'}`, paymentInfo);
    if (!data.success) throw Error(data.error.raw ? data.error.raw.message : JSON.stringify(data));
    return [data.data, undefined];
  } catch (error) {
    return [undefined, error.message];
  }
}

export default postPayment;
