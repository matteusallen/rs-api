import sendDetailsSMS from './sendDetailsSMS';
import createReservation from './createReservation';
import getReservationById from './getReservationById';
import getReservationsByOrderId from './getReservationsByOrderId';
import getReservationProductsByOrderId from './getReservationProductsByOrderId';
import updateReservationDates from './updateReservationDates';
import updateReservationProduct from './updateReservationProduct';
import getReservationReport from './reservationReport/getReservationReport';

export default {
  sendDetailsSMS,
  createReservation,
  getReservationById,
  getReservationsByOrderId,
  getReservationProductsByOrderId,
  updateReservationDates,
  updateReservationProduct,
  getReservationReport
};
