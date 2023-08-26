import moment from 'moment';

import { dividerRow, emptyHTMLElement } from './commonElementConstants';

/**
 * Returns zero to many stall reservations
 */
const getStallReservations = stallReservation => {
  if (!stallReservation) return emptyHTMLElement;
  let returnValue = '';
  stallReservation.forEach(stall => {
    returnValue += `
    <tr>
      <td class="subSection flex">
        <div class="flex-column">
          <h3>Check In</h3>
          <div class="content-container">
             ${moment(stall.startDate).format('dddd, MMM D, YYYY')}
          </div>
          <div class="content-container">
            After ${moment(stall.checkInTime, 'HH:mm:ss').format('h:mm A')}
          </div>
        </div>
        <div class="flex-column right">
          <h3>Number of Stalls </h3>
          <div class="content-container">
             ${stall.quantity} ${stall.quantity > 1 ? 'Stalls' : 'Stall'}
          </div>
        </div>
      </td>
    </tr>
    <tr>
      <td class="subSection">
        <h3>Check Out</h3>
        <div class="content-container">
           ${moment(stall.endDate).format('dddd, MMM D, YYYY')}
        </div>
        <div class="content-container">
          By ${moment(stall.checkOutTime, 'HH:mm:ss').format('h:mm A')}
        </div>
      </td>
    </tr>
    ${stallReservation.length > 1 ? `${dividerRow}` : ''}`;
  });
  return returnValue;
};

/**
 * Returns Stalls section table row
 */
const getStallsSection = stalls => {
  if (!stalls || !stalls.length) return emptyHTMLElement;
  return `
    <tr id="stalls-section">
      <td>
        <table class="content-area">
          ${dividerRow}
            <tr>
              <td>
                <table>
                  <tr>
                    <td class="sectionTitle">
                      <h2>Stall Summary</h2>
                    </td>
                  </tr>
                  ${getStallReservations(stalls)}
                </table>
              </td>
            </tr>
        </table>
      </td>
    </tr>`;
};

export { getStallsSection };
