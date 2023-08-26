import moment from 'moment';
import { ProductDiscount } from 'Models';

async function calculateProductDiscount(xRefTypeId, xProductId, reservationStartDate, reservationEndDate, productPrice, quantity) {
  let numberOfDiscountNights = 0,
    discountAmount = 0;
  const productDiscount = await ProductDiscount.findOne({ where: { xProductId: +xProductId, xRefTypeId } });

  if (productDiscount) {
    const reservationNightlyDatesObj = {};
    const reservationNightlyDates = Array.from(moment.range(moment.utc(reservationStartDate), moment.utc(reservationEndDate)).by('day')).map(day =>
      day.format('YYYY-MM-DD')
    );
    reservationNightlyDates.pop();

    reservationNightlyDates.forEach(date => (reservationNightlyDatesObj[date] = false));

    const discountNightlyDates = Array.from(moment.range(moment.utc(productDiscount.startDate), moment.utc(productDiscount.endDate)).by('day')).map(day =>
      day.format('YYYY-MM-DD')
    );
    discountNightlyDates.pop();

    discountNightlyDates.forEach(date => {
      if (reservationNightlyDatesObj[date] === false) reservationNightlyDatesObj[date] = true;
    });

    for (const key in reservationNightlyDatesObj) {
      if (reservationNightlyDatesObj[key] === true) numberOfDiscountNights += 1;
    }

    //console.log('numberOfDiscountNights', numberOfDiscountNights);

    if (productDiscount.rate)
      discountAmount = quantity * numberOfDiscountNights * (productPrice > productDiscount.rate ? productPrice - productDiscount.rate : productPrice);
    else discountAmount = quantity * numberOfDiscountNights * productPrice;
  }

  return {
    amount: discountAmount,
    start: productDiscount?.startDate ? productDiscount.startDate : null,
    end: productDiscount?.endDate ? productDiscount.endDate : null
  };
}

export default calculateProductDiscount;
