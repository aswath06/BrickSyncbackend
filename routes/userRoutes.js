const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { getClient } = require('../venomClient'); // ← Use existing Venom client

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// POST /api/users/send-otp
router.post('/send-otp', async (req, res) => {
  const { email, phone } = req.body;

  if (!email || !phone) {
    return res.status(400).json({ message: 'Email and phone are required.' });
  }

  const otp = generateOTP();
  const otpMessage = `Your OTP code is: ${otp}`;

  // Email transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'maswath55@gmail.com',
      pass: 'hccq svbv cwac wgrn'
    }
  });

  const mailOptions = {
    from: '"BrickSync" <bricksynce@gmail.com>',
    to: email,
    subject: 'Your OTP Code',
    html: `<p>Your OTP code is <b>${otp}</b></p>`
  };

  try {
    // Email
    await transporter.sendMail(mailOptions);
    console.log(`📧 Sent OTP to ${email}: ${otp}`);

    // WhatsApp
    const client = getClient();
    if (client) {
      await client.sendText(`${phone}@c.us`, otpMessage);
      console.log(`📲 Sent OTP to WhatsApp: ${phone}`);
    } else {
      console.warn('⚠️ Venom client is not ready yet');
    }

    res.status(200).json({ message: 'OTP sent via email and WhatsApp' });
  } catch (err) {
    console.error('❌ Error sending OTP:', err);
    res.status(500).json({ message: 'Error sending OTP' });
  }
});

module.exports = router;
