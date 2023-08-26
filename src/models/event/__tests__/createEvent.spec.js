import { Event, Group } from 'Models';

import { getDelayGroupName } from '../methods/createEvent';

const mockEvent = {
  name: 'Test event',
  description: '',
  startDate: '2025-11-09T00:00:00.000Z',
  endDate: '2025-11-30T00:00:00.000Z',
  openDate: '2025-11-09T06:00:00.000Z',
  closeDate: '2025-12-01T05:59:00.000Z',
  checkInTime: '15:00',
  checkOutTime: '12:00',
  stallProducts: [],
  stallQuestions: [],
  rvQuestions: [],
  venueMapDocumentId: '2',
  venueAgreementDocumentId: '1',
  stallFlip: true,
  rvFlip: true,
  stallMinNights: 1,
  rvMinNights: 1
};

describe('Test Create Event', () => {
  it(`should create an event`, async () => {
    const { event } = await Event.createEvent({ ...mockEvent, renterGroupCodeMode: '' }, 1, 1);

    expect(event.isGroupCodeRequired).toBe(null);
  });
  it(`should create a secured event`, async () => {
    const { event } = await Event.createEvent({ ...mockEvent, renterGroupCodeMode: 'secured' }, 1, 1);

    expect(event.isGroupCodeRequired).toBe(true);
  });

  it(`should create an unsecured event and create delay group`, async () => {
    const { event } = await Event.createEvent({ ...mockEvent, renterGroupCodeMode: 'unsecured' }, 1, 1);
    const delayGroup = await Group.findOne({ where: { venueId: event.venueId, name: getDelayGroupName(event.name) } });

    expect(event.isGroupCodeRequired).toBe(false);
    expect(delayGroup.name).toBe('Delayed Payments - Event Test event');
  });
});
