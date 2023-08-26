import { ssPost } from 'Utils/ssNetworkRequests';
import { supportWebmaster } from 'Config/vars';

async function adminReportsEmail(email, reportType, link) {
  try {
    const htmlTemplate = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Report is Ready</title>
        <style type="text/css">
          * {
            font-family: 'IBM Plex Sans', sans-serif;
            color: #2B3138;
            font-size: 16px;
            letter-spacing: 0.02857em;
          }
          #outlook a {
            padding: 0;
          }
          .ExternalClass {
            width: 100%;
          }
          .ExternalClass,
          .ExternalClass p,
          .ExternalClass span,
          .ExternalClass font,
          .ExternalClass td,
          .ExternalClass div {
            line-height: 100%;
          } /* Forces Hotmail to display normal line spacing.  More on that: http://www.emailonacid.com/forum/viewthread/43/ */
          p {
            margin: 0;
            padding: 0;
            font-size: 0px;
            line-height: 0px;
          }
          table td {
            border-collapse: collapse;
          }
          table {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
          }
          img {
            display: block;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
          }
          a img {
            border: none;
          }
          a {
            text-decoration: none;
            color: #000001;
          }
          a.phone {
            text-decoration: none;
            color: #000001 !important;
            pointer-events: auto;
            cursor: default;
          }
          span {
            font-size: 13px;
            line-height: 17px;
            font-family: monospace;
            color: #000001;
          }
        </style>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,600;1,200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style="width:100%; margin:0; padding:0; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; background: #f2f4f7; font-family: 'IBM Plex Sans', sans-serif; color: #11181F;"
      >
        <table
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="margin:0; padding:0; width:100%; line-height: 100% !important;"
        >
          <tr>
            <td valign="top">
              <table cellpadding="0" cellspacing="0" border="0" align="center" width="600" style="background: #f2f4f7;">
                <tr>
                  <td valign="top">
                    <table
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      align="center"
                      width="560"
                      style="background: white; margin-top: 25px"
                    >
                      <tr>
                        <td valign="top" style="vertical-align: top;">
                          <!-- header image -->
                          <table
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            align="center"
                            valign="middle"
                            width="560"
                            height="300"
                            background="${process.env.AWS_S3}/images/horse-in-stall-email.jpeg"
                          >
                            <tr>
                              <td valign="bottom" style="vertical-align: bottom;" align="center">
                                <img
                                  src="${process.env.AWS_S3}/images/open-stalls-white.png"
                                  alt="Open Stalls"
                                  title="Open Stalls"
                                  width="200"
                                  style="width: 200px;"
                                />
                              </td>
                            </tr>
                            <tr>
                              <td valign="top" style="vertical-align: top;" align="center">
                                <img
                                  src="${process.env.AWS_S3}/images/rodeo-logistics-logo-white.png"
                                  alt="Rodeo Logistics"
                                  title="Rodeo Logistics"
                                  width="215"
                                  style="width: 215px;"
                                />
                              </td>
                            </tr>
                          </table>
    
                          <table
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            align="center"
                            width="450"
                            style="width: 450px;
                            margin-top: 30px;"
                          >
                            <tr>
                              <td
                                style="text-align: center; font-size: .9em; line-height: 20px; letter-spacing: 0.65px; padding-bottom: 25px; font-weight: 500;"
                              >
                                <!-- ///////////////////////////////////////////////////// -->
                                <table cellpadding="0" cellspacing="0" border="0" align="center">
                                  <tr>
                                    <td
                                      valign="top"
                                      style="padding: 25px; line-height: 15px; letter-spacing: 0.8px; font-size: 18px; font-weight: 600; font-family: 'IBM Plex Sans', sans-serif; font-size: 18px;"
                                    >
                                      Your report is ready!
                                    </td>
                                  </tr>
                                </table>
    
                                <table cellpadding="0" cellspacing="0" border="0" align="center">
                                  <tr>
                                    <td valign="top" style="padding: 20px 0;">
                                    Please download 
                                      <a
                                        href="${link}"
                                        target="_blank"
                                        style="color: blue; text-decoration: underline;"
                                        > here.</a
                                      >
                                    </td>
                                  </tr>
                                  <tr>
                                    <td valign="top" style="padding: 20px 0;">
                                        Please note: This link expires after 24 hours.
                                    </td>
                                  </tr>
                                </table>
    
                                <!-- //////////// -->
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    
    `;

    const config = {
      key: 'admin-reports',
      message: {
        html: htmlTemplate,
        subject: `Open Stalls - ${reportType} report`,
        from_email: supportWebmaster,
        from_name: 'Open Stalls',
        to: [
          {
            email,
            type: 'to'
          }
        ],
        headers: {
          'Reply-To': supportWebmaster
        },
        async: false
      }
    };

    const response = await ssPost('/email/send', { config });
    return response;
  } catch (error) {
    return {
      error: `There was a problem sending admin report email: ${error}`,
      success: false
    };
  }
}

export default adminReportsEmail;
