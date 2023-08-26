const getForgotPasswordTemplate = resetPasswordToken => {
  const link = `${process.env.APP_URL}/reset-password?token=${resetPasswordToken}`;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" 
"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Confirmation Email</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,600;1,200&display=swap">
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

    p {
      margin: 0;
      padding: 0;
      font-size: 0;
      line-height: 0;
    }

    table td {
      border-collapse: collapse;
      vertical-align: top;
      text-align: center;
    }

    table {
      border-collapse: collapse;
      mso-table-lspace: 0;
      mso-table-rspace: 0;
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

    span {
      font-size: 13px;
      line-height: 17px;
      font-family: 'IBM Plex Sans', sans-serif;
      color: #000001;
    }

    .content-container {
      padding: 0 100px;
    }

    .content-area {
      height: auto;
    }

    .button-container {
      padding: 25px 0;
    }

    @media (max-width: 599px) {
      #mainContainer {
        width: 100%;
      }

      .content-container {
        padding: 0 20px;
      }
    }

    .MuiButton-root {
      color: rgba(0, 0, 0, 0.87);
      padding: 4px 25px;
      min-width: 64px;
      box-sizing: border-box;
      transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
      font-weight: 300;
      line-height: 1.75;
      border-radius: 4px;
      border: none;
      letter-spacing: 0.02857em;
      text-transform: uppercase;
    }

    .MuiButton-root:hover {
      text-decoration: none;
      background-color: rgba(0, 0, 0, 0.04);
    }

    .MuiButton-root:focus {
      outline: none;
    }

    @media (hover: none) {
      .MuiButton-root:hover {
        background-color: transparent;
      }
    }

    .MuiButton-contained {
      color: rgba(0, 0, 0, 0.87);
      box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
      background-color: #e0e0e0;
    }

    .MuiButton-contained:hover {
      box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12);
      background-color: #d5d5d5;
    }

    .MuiButton-contained:active {
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
    }

    @media (hover: none) {
      .MuiButton-contained:hover {
        box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
        background-color: #e0e0e0;
      }
    }

    .MuiButton-containedPrimary {
      color: #fff;
      background-color: #10AC84;
    }

    .MuiButton-containedPrimary:hover {
      background-color: #00936B;
    }

    @media (hover: none) {
      .MuiButton-containedPrimary:hover {
        background-color: #00936B;
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
  </style>
</head>
<body
    style="width:100%; margin:0; padding:0; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; background: #F2F4F7; font-family: 'IBM Plex Sans', sans-serif;">
<table cellpadding="0" cellspacing="0" border="0"
     style="margin:0; padding:0; width:100%; line-height: 25px; !important; background: #F2F4F7;" width="100%">
  <tr>
    <td>
      <!-- container -->
      <table id="mainContainer" cellpadding="0" cellspacing="0" border="0" align="center" width="600">
        <tr>
          <td valign="top">
            <table cellpadding="0" cellspacing="0" border="0" align="center" width="100%">
              <tr>
                <td style="text-align: center; padding-top: 25px; padding-bottom: 5px;">
                     <img
                        class="imgLogo open-stalls"
                        alt="Open Stalls"
                        title="Open Stalls"
                        src="${process.env.AWS_S3}/images/open-stalls-black.png"/>
                     <img
                        class="imgLogo rodeo"
                        alt="Powered by Rodeo Logistics" 
                        title="Powered by Rodeo Logistics" 
                        src="${process.env.AWS_S3}/images/rodeo-logistics-logo-dark.png"/>
                </td>
              </tr>
              <tr>
                <td>
                  <table id='content-area' class="content-area" cellpadding="0" cellspacing="0"
                       border="0" align="center" width="100%"
                       style="background: white; margin-top: 20px;">
                    <tr>
                      <td>
                        <table cellpadding="0" cellspacing="0" border="0" align="center"
                             width="100%">
                          <tr>
                            <td style="padding: 25px 20px 20px;">
                              <h1 style="font-size: 18px;margin-top:0;">We've received
                                a request to reset your password</h1>
                              <div class="content-container">
                                If you submitted this request, click the button below to
                                set a new password.
                              </div>
                              <div class="button-container">
                              <a id="myLink" href="${link}" target="_blank">
                                <button class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary">
                                  SET A NEW PASSWORD
                                </button>
                               </a>
                              </div>
                              <div class="content-container">
                                If you didn't ask to reset your password, you can ignore
                                this email; your account is still secure.
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="emailProviderFill"/>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <!-- container -->
    </td>
  </tr>
</table>
</body>
</html>
`;
};

export default getForgotPasswordTemplate;
