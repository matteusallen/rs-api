//@flow
import { dividerRow } from './templates/commonElementConstants';
import { getRvSection } from './templates/rvSection';
import { getStallsSection } from './templates/stallsSection';
import { getAddOnsSection } from './templates/addOnsSection';
import { getReceiptSection } from './templates/receiptSection';
import moment from 'moment';
import { formatPhoneNumber } from 'Utils';

import type { UserType } from 'Models/user/types';
import type { OrderType } from 'Models/order/types';

type ReservationConfirmationTemplateRequestType = {|
  addOns: {
    desc: string,
    name: string
  }[],
  isRefund?: boolean,
  isUpdatedReservation: boolean,
  lineItems: {
    amount: number,
    desc: string
  }[],
  order: OrderType,
  rvs: {
    amount: number,
    checkInTime: string,
    checkOutTime: string,
    desc: string,
    endDate: string,
    name: string,
    power: string,
    quantity: number,
    sewer: boolean,
    startDate: string,
    water: boolean
  }[],
  stalls: {
    amount: number,
    checkInTime: string,
    checkOutTime: string,
    desc: string,
    endDate: string,
    name: string,
    quantity: number,
    startDate: string
  }[],
  user: UserType,
  venueMapUrl: string,
  payment: [{}],
  total: number,
  fee: number
|};

/**
 * Return the full email template.
 * To create Reservation Updated template, pass 'isUpdated = true' as the second argument
 */
const newChargeEmailTemplate = (request: ReservationConfirmationTemplateRequestType): string => {
  const { order: orderVal, venueMapUrl, total, fee } = request;
  const order = orderVal || {};
  const eventData = order.event || {};
  const venueData = eventData.venue || {};
  const paymentData = order.payments ? order.payments : [];
  const receiptPayment = paymentData.slice(paymentData.length - 1)[0];
  const receiptAssociatedPayments = paymentData.filter(el => moment(el.createdAt).unix() === moment(receiptPayment.createdAt).unix());

  const receipt = {
    amount: total ? total : 0,
    payments: receiptAssociatedPayments,
    fee: fee ? fee : 0,
    total: total ? total : 0,
    lineItems: request.lineItems
  };

  const htmlString: string = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title id="title">Reservation Updated</title>
  <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,600;1,200&display=swap">
  <style type="text/css">
    * {
      font-family: 'IBM Plex Sans', sans-serif;
      color: #2B3138;
      font-size: 16px;
      letter-spacing: 0.02857em;
    }

    h1 {
      font-size: 24px;
      margin-top: 0;
      text-align: left;
    }

    h2 {
      font-size: 18px;
      margin-top: 0;
      text-align: left;
    }

    h3 {
      margin-top: 0;
      margin-bottom: 0;
      text-align: left;
    }

    hr {
      color: #D2DEEA;
      border-style: ridge;
      margin: 0 20px;
    }

    p {
      margin: 0;
      padding: 0;
      font-size: 0;
      line-height: 0;
    }

    #outlook a {
      padding: 0;
    }

    a {
      font-size: 15px;
      text-decoration: none;
      color: #000001;
    }

    a img {
      border: none;
    }
    
    a[href^="tel:"] {
      color: #387FC7;
    }

    .mainContainer {
      padding: 0;
      border-spacing: 0;
      align: center; /* deprecated, but added for older clients */
      margin-left: auto;
      margin-right: auto;
      width: 600px;
    }

    table {
      border-collapse: collapse;
      mso-table-lspace: 0;
      mso-table-rspace: 0;
      padding: 0;
      border-spacing: 0;
      align: center; /* deprecated, but added for older clients */
      margin-left: auto;
      margin-right: auto;
      width: 100%;
    }

    table td {
      border-collapse: collapse;
      vertical-align: top;
      text-align: center;
      padding: 0;
    }

    table td.sectionTitle {
      padding: 15px 20px 5px;
    }

    table td.subSection {
      padding: 0 20px 20px;
    }
    
     /* Gmail randomly wraps the sub-section <td> in a span. 
     This ensures that if it does exist, it doesn't squash the right-side elements*/
     table td.subSection span {
      width: 100%;
      display: inherit;
    }
    
    table td.subSection span > .flex-column.right{
        width: auto;
        min-width: 180px;
    }

    table td.subSection.flex {
      display: -webkit-box;
      display: -moz-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
    }

    img {
      display: block;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }

    span {
      font-size: inherit;
    }
    
    .flex-me {
      display: -webkit-box;
      display: -moz-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
    }
    
    .flex-me span {
      display: -webkit-box;
      display: -moz-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      width: 100%;
    }
  
    .flex-column {
      flex-direction: column;
      -webkit-box-direction: normal;
      -webkit-box-orient: vertical;
      -moz-box-direction: normal;
      -moz-box-orient: vertical;
      font-size: 15px;
    }
    
    .flex-column span {
      width: 100% !important;
      display: inherit !important;
    }
    
    .flex-column.right {
      width: 32%;
      margin-left: auto;
    }

    .content-container {
      font-size: 15px;
      text-align: left;
    }

    .content-area {
      height: auto;
      background: white
    }
    
    .item-row {
      padding: 5px 20px 5px; 
      display: -webkit-box;
      display: -moz-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
    }

    @media (max-width: 599px) {
      #mainContainer {
        width: 100%;
      }

      .content-container {
        padding: 0 0;
      }
    }

    .imgLogo {
      margin: auto;
      height: auto;
    }

    .imgLogo.open-stalls {
      width: 300px;
      max-height: 68px;
    }

    .imgLogo.rodeo {
      width: 250px;
      max-height: 44px;
    }

    .emailProviderFill {
      min-height: 48px;
    }
    
    .imgAmenities {
      width: 18px;
      height: auto;
      margin: auto;
      padding-right: 5px;
    }

    .amenity-label {
      color: #677481;
      padding-right: 24px;
      font-size: 14px;
    }

    .refund-amount-section {
      color: #11181F;
      font-weight: bold;
    }

    .refund-timing-section {
      font-size: 11px;
    }
  </style>
</head>
<body
    style="width:100%; margin:0; padding:0; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; background: #F2F4F7; font-family: 'IBM Plex Sans', sans-serif;">
<table
       style="margin:0; padding:0; width:100%; line-height: 25px; !important; background: #F2F4F7;" width="100%">
  <tr>
    <td>
      <!-- container -->
      <table id="mainContainer" class="mainContainer">
        <tr>
          <td valign="top">
            <table>
              <tr>
                <td style="padding-top: 25px; padding-bottom: 5px;">
                  <img
                      class="imgLogo open-stalls"
                      alt="Open Stalls"
                      title="Open Stalls"
                      src="${process.env.AWS_S3 || ''}/images/open-stalls-black.png"/>
                  <img
                      class="imgLogo rodeo"
                      alt="Powered by Rodeo Logistics"
                      title="Powered by Rodeo Logistics"
                      src="${process.env.AWS_S3 || ''}/images/rodeo-logistics-logo-dark.png"/>
                </td>
              </tr>

              <!-- Top table section -->
              <tr>
                <td>
                  <table class="content-area" style="margin-top: 20px;">
                    <tr>
                      <td>
                        <table>
                          <tr>
                            <td style="padding: 25px 20px 20px;">
                              <h1>Reservation Updated</h1>
                              <div class="content-container">
                              <span id="update-text">Your reservation has been successfully updated with the details below.</span>
                              If you need to make any changes, please contact ${venueData.name || 'the venue'} at <a href="tel:${venueData.phone}"> ${
    formatPhoneNumber(venueData.phone) || 'the venue'
  }</a>
                              </div>
                            </td>
                          </tr>
                          ${dividerRow}
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Event details -->
              <tr>
                <td>
                  <table class="content-area">
                    <tr>
                      <td>
                        <table>
                          <tr>
                            <td style="padding: 10px 20px 20px;">
                              <h3>Event</h3>
                              <div class="content-container">
                                ${eventData.name}
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td class="subSection">
                              <h3>Location</h3>
                              <div class="content-container">
                                ${venueData.name}
                              </div>
                              <div class="content-container">
                               ${venueData.street}
                              </div>
                              ${
                                venueData.street2
                                  ? `<div class="content-container">
                               ${venueData.street2}
                              </div>`
                                  : ''
                              }
                              <div class="content-container">
                                 ${venueData.city}, ${venueData.state} ${venueData.zip}
                              </div>
                              ${
                                venueMapUrl
                                  ? `<div class="content-container">
                                        <a href=${venueMapUrl} class="content-container">
                                          Download Venue Map
                                        </a>
                                    </div>`
                                  : ''
                              }
                            </td>
                          </tr>
                          ${
                            venueData.description
                              ? `<tr>
                            <td class="subSection">
                              <h3>Description</h3>
                              <div class="content-container">
                                ${venueData.description}
                              </div>
                            </td>
                          </tr>`
                              : ''
                          }
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Stall summary -->
              ${getStallsSection(request.stalls)}

              <!-- RV Summary -->
              ${getRvSection(request.rvs)}
              
              <!-- Add ons -->
              ${getAddOnsSection(request.addOns)}
              
              <!-- Totals -->
              <!-- Hiding descriptions. Totals per product, stripeFee and total don't match -->
              ${getReceiptSection(receipt, paymentData.slice(paymentData.length - 1)[0], false)}
              
              <tr>
                <td>
                  <div class="emailProviderFill"></div>
                </td>
              </tr>
            </table>

          </td>
        </tr>
      </table>
</table>
</body>
</html>`;

  return htmlString;
};

export default newChargeEmailTemplate;
