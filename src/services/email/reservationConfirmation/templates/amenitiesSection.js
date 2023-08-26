import { emptyHTMLElement } from './commonElementConstants';

/**
 * Returns power/power icon and label
 */
const getPowerElement = power => {
  if (!power) return emptyHTMLElement;
  return `
    <div>
      <img
        class="imgAmenities"
        alt="Open Stalls"
        title="Open Stalls"
        src="${process.env.AWS_S3}/images/Electric.png"/>
    </div>
    <div class="amenity-label">${power}amp</div>`;
};

/**
 * Returns water icon and label
 */
const getWaterElement = hasWater => {
  if (!hasWater) return emptyHTMLElement;
  return `
    <div>
      <img
        class="imgAmenities"
        alt="Open Stalls"
        title="Open Stalls"
        src="${process.env.AWS_S3}/images/Water.png"/>
    </div>
    <div class="amenity-label">Water</div>`;
};

/**
 * Returns sewer icon and label
 */
const getSewerElement = hasSewer => {
  if (!hasSewer) return emptyHTMLElement;
  return `                  
    <div>
      <img
        class="imgAmenities"
        alt="Open Stalls"
        title="Open Stalls"
        src="${process.env.AWS_S3}/images/Sewer.png"/>
    </div>
    <div class="amenity-label">Sewer</div>`;
};

/**
 * Returns Amenities for RV Section table row
 */
const getAmenitiesSection = rvSummary => {
  if (!rvSummary || (!rvSummary.power && !rvSummary.water && !rvSummary.sewer)) return emptyHTMLElement;
  return `<tr>
            <td style="padding: 15px 20px 5px;">
              <h3>Amenities</h3>
            </td>
          </tr>
          <tr>
            <td class="subSection">
              <div class="flex-me" style="height: 20px;">
                <!-- Power -->
                ${getPowerElement(rvSummary.power)}

                <!-- Water -->
                ${getWaterElement(rvSummary.water)}

                <!-- Sewer -->
                ${getSewerElement(rvSummary.sewer)}
              </div>
            </td>
          </tr>`;
};

export { getAmenitiesSection };
