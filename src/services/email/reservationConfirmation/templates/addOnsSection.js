import { dividerRow, emptyHTMLElement } from './commonElementConstants';
import { upperFirst } from 'Utils/stringHelpers';

/**
 * Returns AddOns line items
 */
const getAddOns = addOns => {
  let returnValue = '';
  if (addOns) {
    for (let addOn of addOns) {
      returnValue += `<tr>
        <td class="subSection">
          <h3>${upperFirst(addOn.name || '')}</h3>
          <div class="content-container">
             ${addOn.desc || ''}
          </div>
        </td>
      </tr>`;
    }
  }
  return returnValue;
};

/**
 * Returns AddOns section table row
 */
const getAddOnsSection = addOns => {
  if (!addOns || !addOns.length) return emptyHTMLElement;
  return `<tr id="addons-section">
  <td>
    <table class="content-area">
      ${dividerRow}
      <tr>
        <td>
          <table id="addOnsTable">
            <tr>
              <td class="sectionTitle">
                <h2>Add Ons</h2>
              </td>
            </tr>
            ${getAddOns(addOns)}
          </table>
        </td>
      </tr>
    </table>
  </td>
</tr>`;
};

export { getAddOnsSection };
