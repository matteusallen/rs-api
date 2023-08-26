import getReservationConfirmationTemplate from '../../src/services/email/reservationConfirmation/confirmationEmailTemplate';
import { getAddOnsSection } from '../../src/services/email/reservationConfirmation/templates/addOnsSection';
import { getRvSection } from '../../src/services/email/reservationConfirmation/templates/rvSection';
import { getStallsSection } from '../../src/services/email/reservationConfirmation/templates/stallsSection';

const request = {
  order: {
    reservation: {
      statusId: 1,
      startDate: '2034-01-02T06:00:00.000Z',
      endDate: '2034-01-03T06:00:00.000Z'
    },
    payments: [
      {
        amount: 351.04,
        cardBrand: 'Visa',
        last4: '8901'
      }
    ],
    event: {
      name: 'Rising Stars Calf Roping',
      venue: {
        name: 'Lazy E Arena',
        phone: '5946242442',
        street: '38873 Verdie Shores',
        street2: 'Suite 760',
        city: 'Lake Jamirchester',
        state: 'RI',
        zip: '20909',
        description: 'Eight enclosed barns with wash racks and a page system from both arenas. Stall floors are dirt and every stall has an electric outlet.'
      }
    }
  },
  lineItems: [
    {
      desc: '5 Stalls x 2 nights',
      amount: 100.0
    },
    {
      desc: '5 RV spots x 3 nights',
      amount: 100.09
    },
    {
      desc: '5 RV spots x 3 nights',
      amount: 100.09
    }
  ],
  stalls: [
    {
      quantity: 5,
      desc: 'Nightly',
      name: 'Nightly',
      amount: 32,
      startDate: '2034-01-02T06:00:00.000Z',
      endDate: '2034-01-03T06:00:00.000Z',
      checkInTime: '2020-07-28T16:11:55.565Z',
      checkOutTime: '2020-07-28T16:11:55.565Z'
    }
  ],
  rvs: [
    {
      name: 'Rv Lot #1',
      quantity: 5,
      desc: 'Lot down by the river',
      amount: 59,
      startDate: '2034-01-02T06:00:00.000Z',
      endDate: '2034-01-03T06:00:00.000Z',
      checkInTime: '2020-07-28T16:11:55.565Z',
      checkOutTime: '2020-07-28T16:11:55.565Z',
      type: 'Blue Lot RV Spot',
      power: '50',
      water: true,
      sewer: true
    }
  ],
  addOns: [
    {
      name: 'shavings',
      description: 'Bags of shavings for bedding',
      priceType: 'perUnit',
      unitName: 'bag',
      count: 3
    },
    {
      name: 'other',
      description: 'Some other add-on',
      priceType: 'perUnit',
      unitName: 'pound',
      count: 2
    }
  ]
};

describe('Confirmation email template tests', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should return add on section if data provided', () => {
    // Execute
    const response = getAddOnsSection(request.addOns);

    // Assert
    expect(response.indexOf('addons-section') > -1).toBe(true);
  });

  it('should not return add on section if data missing, but still return a span', () => {
    // Execute
    const response = getAddOnsSection([]);

    // Assert
    expect(response).toEqual(`<span></span>`);
    expect(response.indexOf('id="addons-section"') > -1).toBe(false);
  });

  it('should return RV section if data provided', () => {
    // Execute
    const response = getRvSection(request.rvs);

    // Assert
    expect(response.indexOf('id="rv-section"') > -1).toBe(true);
  });

  it('should not return RV section if data missing, but still return a span', () => {
    // Execute
    const response = getRvSection({});

    // Assert
    expect(response).toEqual(`<span></span>`);
    expect(response.indexOf('id="rv-section"') > -1).toBe(false);
  });

  it('should return Stalls section if data provided', () => {
    // Execute
    const response = getStallsSection(request.stalls);

    // Assert
    expect(response.indexOf('id="stalls-section"') > -1).toBe(true);
  });

  it('should not return Stalls section if data missing, but still return a span', () => {
    // Execute
    const response = getStallsSection({});

    // Assert
    expect(response).toEqual(`<span></span>`);
    expect(response.indexOf('id="stalls-section"') > -1).toBe(false);
  });

  it('should return a reservation CREATED confirmation email template, with all sub-sections', async () => {
    //Execute
    const response = await getReservationConfirmationTemplate(request);

    // Assert
    expect(response.indexOf('Reservation Confirmation') > -1).toBe(true);
    expect(response.indexOf('Reservation Updated') > -1).toBe(false);
    expect(response.indexOf('addons-section') > -1).toBe(true);
    expect(response.indexOf('id="stalls-section"') > -1).toBe(true);
    expect(response.indexOf('id="rv-section"') > -1).toBe(true);
  });

  it('should return a reservation UPDATED confirmation email template, with all sub-sections', async () => {
    //Set up
    request.isUpdatedReservation = true;

    //Execute
    const response = await getReservationConfirmationTemplate(request);

    // Assert
    expect(response.indexOf('Reservation Confirmation') > -1).toBe(false);
    expect(response.indexOf('Reservation Updated') > -1).toBe(true);
    expect(response.indexOf('addons-section') > -1).toBe(true);
    expect(response.indexOf('id="stalls-section"') > -1).toBe(true);
    expect(response.indexOf('id="rv-section"') > -1).toBe(true);
  });
});
