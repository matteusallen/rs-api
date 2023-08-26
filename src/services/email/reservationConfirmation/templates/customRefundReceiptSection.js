/**
 * Returns line items in totals section
 */
import { dividerRow, emptyHTMLElement } from './commonElementConstants';

const getRefundLines = refunds => {
  if (!refunds || !refunds.length) return emptyHTMLElement;

  let returnValue = '';

  refunds.forEach(refund => {
    returnValue += `
    <tr>
      <td class="flex-me" style="padding: 5px 20px 5px;">
        <div class="flex-column">
          <div class="refund-amount-section">
            Refund amount ${refund.cardBrand ? `- ${refund.cardBrand} ${refund.last4}` : '- Cash/Check'}
          </div>
        </div>
        <div class="flex-column right">
          <div class="refund-amount-section" style="text-align: right">
            -$${Math.abs(refund.amount).toFixed(2)}
          </div>
        </div>
      </td>
    </tr>

    ${
      refund.cardBrand
        ? `<tr>
      <td class="flex-me" style="padding-left: 20px;">
        <div class="flex-column">
          <div class="refund-timing-section">
            You should receive your refund within 10 business days
          </div>
        </div>
      </td>
    </tr>`
        : ``
    }`;
  });

  return returnValue;
};

/**
 * Returns Totals section table row
 */
const getCustomRefundReceiptSection = (receipt, refunds) => {
  if (!receipt) return emptyHTMLElement;
  const refundArray = Array.isArray(refunds) ? refunds : [refunds];
  return `<tr id="totals-section">
  <td>
    <table class="content-area" style="margin-top: 20px;">
      <tr>
        <td>
          <table style="margin-bottom: 10px;">
            <tr>
              <td style="padding: 25px 20px 5px;">
                <h1>Receipt</h1>
              </td>
            </tr>

            ${dividerRow}

            ${getRefundLines(refundArray)}

          </table>
        </td>
      </tr>
    </table>
  </td>
</tr>`;
};

export { getCustomRefundReceiptSection };
