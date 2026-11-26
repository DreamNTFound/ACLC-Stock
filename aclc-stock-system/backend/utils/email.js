const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

const sendPickupEmail = async (recipientEmail, userName, itemName) => {
  const mailOptions = {
    from: `ACLC College of Tacloban <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject: "Your Reservation is Ready for Pickup",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Your reservation is ready! 🎉</h2>

        <p>Hello ${userName},</p>

        <p>
          Your reserved ${itemName} is now ready for pickup.
        </p>

        <p>
          Please visit at ACLC College of Tacloban to collect your reservation.
        </p>

        <p>
          Thank you for shopping with us!
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendResetPasswordEmail = async (recipientEmail, resetLink) => {
  const mailOptions = {
    from: `ACLC College of Tacloban <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject: "Reset Your Password",
    html: `
      <div style="
        font-family: Arial, sans-serif;
        padding: 20px;
        max-width: 600px;
        margin: auto;
      ">
        <h2>Password Reset Request</h2>

        <p>Hello,</p>

        <p>
          We received a request to reset your password for the
          ACLC College of Tacloban Merchandise Management System.
        </p>

        <p>
          Click the button below to create a new password:
        </p>

        <p style="margin: 30px 0;">
          <a
            href="${resetLink}"
            style="
              background-color: #1e3a5f;
              color: #ffffff;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              display: inline-block;
              font-weight: bold;
            "
          >
            Reset Password
          </a>
        </p>

        <p>
          This password reset link will expire in <strong>1 hour</strong>.
        </p>

        <p>
          If you did not request a password reset, you can safely ignore
          this email.
        </p>

        <p>
          Thank you,<br />
          ACLC College of Tacloban
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendPickupEmail,
  sendResetPasswordEmail,
};
