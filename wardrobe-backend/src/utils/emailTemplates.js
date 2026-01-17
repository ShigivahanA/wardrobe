export const otpEmail = (otp) => {
  const digits = otp.split('')

  return {
    subject: 'Your Wardrobe Login Code',
    text: `Your login code is ${otp}. It expires in 5 minutes.`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Your Login Code</title>
</head>
<body style="
  margin:0;
  padding:0;
  background:#f7f7f7;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,Arial,sans-serif;
">

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:48px 16px;">
        
        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
          style="
            max-width:480px;
            background:#ffffff;
            border-radius:20px;
            padding:40px 32px;
            box-shadow:0 20px 40px rgba(0,0,0,0.08);
          "
        >
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <img
                src="https://res.cloudinary.com/dax0gizdq/image/upload/v1768669039/logoo_kngfmc.png"
                alt="Wardrobe"
                width="120"
                style="display:block;opacity:0.9;"
              />
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td align="center" style="padding-bottom:6px;">
              <h2 style="
                margin:0;
                font-size:20px;
                font-weight:600;
                color:#111;
              ">
                Your login code
              </h2>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-bottom:24px;">
              <p style="
                margin:0;
                font-size:14px;
                color:#666;
                max-width:360px;
              ">
                Use the code below to sign in securely to your Wardrobe account.
              </p>
            </td>
          </tr>

          <!-- OTP boxes -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  ${digits.map(d => `
                    <td style="padding:0 6px;">
                      <div style="
                        width:44px;
                        height:52px;
                        line-height:52px;
                        text-align:center;
                        border-radius:12px;
                        border:1px solid #e5e5e5;
                        font-size:22px;
                        font-weight:600;
                        color:#111;
                        background:#fafafa;
                      ">
                        ${d}
                      </div>
                    </td>
                  `).join('')}
                </tr>
              </table>
            </td>
          </tr>

          <!-- Reassurance message -->
          <tr>
            <td align="center" style="padding-bottom:8px;">
              <p style="
                margin:0;
                font-size:13px;
                color:#777;
                max-width:360px;
                line-height:1.6;
              ">
                This code is valid for <strong>5 minutes</strong> and can only be used once.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center">
              <p style="
                margin:0;
                font-size:12px;
                color:#999;
                line-height:1.6;
              ">
                If you didn’t request this login, you can safely ignore this email.
              </p>
            </td>
          </tr>

        </table>

        <!-- Footer -->
        <p style="
          margin-top:24px;
          font-size:11px;
          color:#aaa;
        ">
          © ${new Date().getFullYear()} Wardrobe
        </p>

      </td>
    </tr>
  </table>

</body>
</html>
    `
  }
}



export const resetPasswordEmail = (resetLink) => ({
  subject: 'Reset your Wardrobe password',
  text: `
You requested a password reset.

Open the link below to set a new password.
This link is valid for 15 minutes.

${resetLink}

If you didn’t request this, you can safely ignore this email.
  `,
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Password Reset</h2>
      <p>You requested a password reset.</p>
      <p>
        <a href="${resetLink}" style="
          display: inline-block;
          padding: 10px 16px;
          background: #000;
          color: #fff;
          text-decoration: none;
          border-radius: 6px;
        ">
          Reset Password
        </a>
      </p>
      <p>This link is valid for <strong>15 minutes</strong>.</p>
      <p>If you didn’t request this, you can ignore this email.</p>
    </div>
  `
})
