import moment from 'moment';

import { dividerRow, emptyHTMLElement } from './commonElementConstants';
import { getAmenitiesSection } from './amenitiesSection';

/**
 * Returns zero to many RV Reservations
 */
const getRvReservations = rvReservations => {
  if (!rvReservations || !rvReservations.length) return emptyHTMLElement;
  let returnValue = '';
  rvReservations.forEach(rvReservation => {
    returnValue += `
    <tr>
      <td class="subSection flex">
        <div class="flex-column">
          <h3>Check In</h3>
          <div class="content-container">
             ${moment(rvReservation.startDate).format('dddd, MMM D, YYYY')}
          </div>
          <div class="content-container">
            By  ${moment(rvReservation.checkInTime, 'HH:mm:ss').format('h:mm A')}
          </div>
        </div>
        <div class="flex-column right">
          <h3>Number of Spots</h3>
          <div class="content-container">
            ${rvReservation.quantity} ${rvReservation.quantity > 1 ? 'Spots' : 'Spot'}
          </div>
        </div>
      </td>
    </tr>
    <tr>
      <td class="subSection flex" style="padding-bottom: 5px;">
        <div class="flex-column">
          <h3>Check Out</h3>
          <div class="content-container">
             ${moment(rvReservation.endDate).format('dddd, MMM D, YYYY')}
          </div>
          <div class="content-container">
            By  ${moment(rvReservation.checkOutTime, 'HH:mm:ss').format('h:mm A')}
          </div>
        </div>
        <div class="flex-column right">
          <h3>Spot Type</h3>
          <div class="content-container">
            ${rvReservation.name}
          </div>
        </div>
      </td>
    </tr>
    
    <!-- Amenities section -->
    ${getAmenitiesSection(rvReservation)}
    
    ${rvReservations.length > 1 ? `${dividerRow}` : ''}`;
  });

  return returnValue;
};

/**
 * Returns RV Section table row
 */
const getRvSection = rvReservations => {
  if (!rvReservations || !rvReservations.length) return emptyHTMLElement;
  return `<tr id="rv-section">
      <td>
        <table class="content-area">
        ${dividerRow}
          <tr>
            <td>
              <table>
                <tr>
                  <td class="sectionTitle">
                    <h2>RV Summary</h2>
                  </td>
                </tr>
                
                ${getRvReservations(rvReservations)}
    
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
};

export { getRvSection };
