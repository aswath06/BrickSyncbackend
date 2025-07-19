// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Utility: Generate a 6-digit numeric OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// POST /api/users/send-otp
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email address is required.' });
  }

  const otp = generateOTP();

  // Configure mail transporter (Gmail with app password)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'maswath55@gmail.com', // Replace with sender Gmail
      pass: 'hccq svbv cwac wgrn'   // Gmail App Password (not regular password)
    }
  });

  // Mail content configuration
  const mailOptions = {
    from: '"BrickSync" <bricksync@gmail.com>', // Display name and sender email
    to: email,
    subject: 'Your One-Time Password (OTP)',
    html: `
      <div style="font-family: Arial, sans-serif; font-size: 16px;">
        <p>Dear User,</p>
        <p>Your One-Time Password (OTP) is:</p>
        <h2 style="color: #2e6da4;">${otp}</h2>
        <p>Please use this code to proceed. This OTP will expire in 5 minutes.</p>
        <br />
        <p>Best regards,</p>
        <p>BrickSync Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);

    // ✅ In production: Save OTP with expiry in database/Redis here

    console.log(`✅ OTP sent to ${email}: ${otp}`);
    res.status(200).json({ message: 'OTP sent successfully', email });

  } catch (error) {
    console.error('❌ Email sending error:', error);
    res.status(500).json({
      message: 'Failed to send OTP. Please try again later.',
      error: error.message
    });
  }
});

module.exports = router;
