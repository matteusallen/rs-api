/**
 * Returns line items in totals section
 */
import { dividerRow, emptyHTMLElement } from './commonElementConstants';

const getReceiptTransactions = (transactions, showDescriptions) => {
  let returnValue = '';
  if (transactions && showDescriptions) {
    for (let transaction of transactions) {
      returnValue +=
        transaction.amount > 0
          ? `<tr>
              <td class="item-row">
                <div class="flex-column" style="text-align: left">
                  ${transaction.desc}
                </div>
                <div class="flex-column right" style="text-align: right">
                  $${Number(transaction.amount).toFixed(2)}
                </div>
              </td>
            </tr>`
          : '';
    }
  }
  return returnValue;
};

const getPaymentMethods = payments => {
  let returnValue = '';
  if (payments) {
    payments.forEach(payment => {
      returnValue += `<tr>
          <td class="item-row">
            <h3 class="flex-column" style="text-align: left">
              $${payment.amount.toFixed(2)} Payment with
            </h3>
            <div class="flex-column right" style="text-align: right">
              ${payment.cardPayment ? `${payment.cardBrand.toUpperCase()} ${payment.last4}` : 'Cash or Check'}
            </div>
          </td>
        </tr>`;
    });
  }
  return returnValue;
};

const getDiscountSection = discount => {
  let returnValue = '';
  if (discount && discount > 0) {
    returnValue = `<tr>
      <td class="item-row">
        <div class="flex-column" style="text-align: left">
          Discount
        </div>
        <div class="flex-column right" style="text-align: right">
          -$${Number(discount).toFixed(2)}
        </div>
      </td>
    </tr>`;
  }
  return returnValue;
};

/**
 * Returns Totals section table row
 */
const getReceiptSection = (receipt, payment, showDescriptions = true) => {
  if (!receipt) return emptyHTMLElement;
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
            
             ${getPaymentMethods(receipt.payments)}
            
            ${showDescriptions ? dividerRow : emptyHTMLElement}
            
            ${getReceiptTransactions(receipt.lineItems, showDescriptions)}

            ${getDiscountSection(receipt.discount)}

            <tr>
              <td class="item-row">
                <div class="flex-column" style="text-align: left">
                ${Number(receipt?.discount) ? 'Discount' : ''}
                </div>
                <div class="flex-column right" style="text-align: right">
                  ${Number(receipt?.discount) ? '-$' + Number(receipt.discount).toFixed(2) : ''}
                </div>
              </td>
            </tr>

            ${dividerRow}
            
            <tr>
              <td class="item-row">
                <div class="flex-column">
                  <h3>
                    Total Paid
                  </h3>
                </div>
                <div class="flex-column right">
                  <h3 style="text-align: right">
                    $${receipt.amount.toFixed(2)}
                  </h3>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </td>
</tr>`;
};

export { getReceiptSection };
