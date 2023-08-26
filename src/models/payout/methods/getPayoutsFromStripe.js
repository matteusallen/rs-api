// @flow
const stripe = require('stripe')(process.env.STRIPE_PK);
const moment = require('moment');

type QueryType = {|
  expand?: Array<string>,
  limit: number,
  payout?: string,
  starting_after?: string,
  status?: string,
  type?: string,
  arrival_date?: {
    gt: string
  }
|};

type StripeResponseType = {|
  amount?: number,
  arrival_date?: number,
  id?: string,
  source: {
    source_transfer: {
      source_transaction?: string
    },
    source_transfer_reversal: {
      source_refund?: string
    }
  }
|};

type UpdatingPayoutsFromStripeType = {|
  paymentsUpdated: number,
  payoutsAdded: number
|};

async function getPayoutsFromStripe(): Promise<[?UpdatingPayoutsFromStripeType, ?string]> {
  const { Payment, Venue } = this.sequelize.models;
  try {
    const getMoreFromStripe = async (venueStripeAccountId: string, resultArray: Array<StripeResponseType>, query: QueryType, type: string): Promise<void> => {
      if (resultArray.length) {
        query.starting_after = resultArray[resultArray.length - 1].id;
      }
      const second = {
        stripeAccount: venueStripeAccountId
      };
      const stripeResponse = await stripe[type].list(query, second);
      resultArray.push(...stripeResponse.data);
      if (stripeResponse.has_more) {
        await getMoreFromStripe(venueStripeAccountId, resultArray, query, type);
      }
    };

    let payoutsAdded = 0;
    let paymentsUpdated = 0;
    const daysToTake = Number(process.env.DAYS_TO_GET_PAYOUTS ?? 10);
    // eslint-disable-next-line no-console
    console.log(`The payouts from ${daysToTake} days ago until now will be processed`);
    const daysToGetPayouts = moment().subtract(daysToTake, 'days').unix();

    const venues = await Venue.findAll();
    const localPayouts = await this.findAll({
      attributes: ['stripePayoutId']
    });

    const localPayoutsMap = localPayouts.reduce((map, currentPayout) => {
      map[currentPayout.stripePayoutId] = currentPayout;
      return map;
    }, {});

    for (const venue of venues) {
      try {
        const stripePayouts = [];
        const queryForPayouts: QueryType = {
          limit: 100,
          status: 'paid',
          arrival_date: {
            gt: daysToGetPayouts
          }
        };
        await getMoreFromStripe(venue.stripeAccount, stripePayouts, queryForPayouts, 'payouts');

        const missingPayouts = stripePayouts.filter(stripePayout => {
          const localPayoutExist = !!localPayoutsMap[stripePayout.id];
          return !localPayoutExist;
        });

        for (const missingPayout of missingPayouts) {
          const addedLocalPayout = await this.create({
            venueId: venue.id,
            stripePayoutId: missingPayout.id,
            amount: missingPayout.amount,
            paidDate: moment.unix(missingPayout.arrival_date).toDate()
          });
          payoutsAdded++;

          const paymentsForPayout = [];
          const paymentsQuery: QueryType = {
            limit: 100,
            type: 'payment',
            payout: missingPayout.id,
            expand: ['data.source.source_transfer']
          };
          await getMoreFromStripe(venue.stripeAccount, paymentsForPayout, paymentsQuery, 'balanceTransactions');
          for (const payment of paymentsForPayout) {
            const matchingPayment = await Payment.findOne({
              where: { ssChargeId: payment.source.source_transfer.source_transaction }
            });
            if (matchingPayment) {
              matchingPayment.payoutId = addedLocalPayout.id;
              await matchingPayment.save();
              paymentsUpdated++;
            }
          }

          const refundsForPayout = [];
          const refundQuery: QueryType = {
            limit: 100,
            type: 'payment_refund',
            payout: missingPayout.id,
            expand: ['data.source.source_transfer_reversal']
          };
          await getMoreFromStripe(venue.stripeAccount, refundsForPayout, refundQuery, 'balanceTransactions');
          for (const refund of refundsForPayout) {
            const matchingPayment = await Payment.findOne({
              where: { ssRefundId: refund.source.source_transfer_reversal.source_refund }
            });
            if (matchingPayment) {
              matchingPayment.payoutId = addedLocalPayout.id;
              await matchingPayment.save();
              paymentsUpdated++;
            }
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        // eslint-disable-next-line no-console
        console.log(`skipping stripe payout pull for ${venue.name}`);
        continue;
      }
    }

    const result = {
      payoutsAdded,
      paymentsUpdated
    };

    // eslint-disable-next-line no-console
    console.log('Successful execution with result:', result);
    return [result, undefined];
  } catch (error) {
    return [undefined, error.message];
  }
}

export default getPayoutsFromStripe;
