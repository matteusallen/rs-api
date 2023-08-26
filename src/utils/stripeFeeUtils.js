// @flow
export const getStripeFee = (amount: number, platformFee: number, useCard: boolean = true, isNonUSCard: boolean): number => {
  if (!amount) amount = 0;
  if (useCard) {
    return amount + platformFee > 0 ? (amount + platformFee + 0.3) / (isNonUSCard ? 0.961 : 0.971) - (amount + platformFee) : 0;
  }
  return 0;
};

export const getTotalAndStripeFee = (
  amount: number,
  platformFee: number = 0,
  useCard: boolean = true,
  includeStripeFee: boolean = true,
  isNonUSCard: boolean = false
): [number, number] => {
  if (!amount) amount = 0;
  if (!platformFee || platformFee < 0) platformFee = 0;
  const stripeFee = includeStripeFee ? getStripeFee(amount, platformFee, useCard, isNonUSCard) : 0;
  const total = amount + stripeFee + platformFee;
  return [total, stripeFee];
};

export const getPercentageFee = (subtotal: number, applyPercentageFee: boolean = true, event: any): number => {
  if (!event && !event.venue) {
    throw new Error('unable to calculate percentage fee');
  }

  let percentageFee = 0;
  if (event.venue.percentageFee && subtotal > 0 && applyPercentageFee) {
    const totalPercentageFee = (event.venue.percentageFee / 100) * subtotal;
    percentageFee = totalPercentageFee > event.venue.feeCap && event.venue.feeCap > 0 ? event.venue.feeCap : totalPercentageFee;
  }

  return percentageFee;
};
