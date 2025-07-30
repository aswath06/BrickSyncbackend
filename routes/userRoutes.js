const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { initClient, getClient } = require('../venomClient');
const userController = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// OTP in-memory store
const otpStore = {};

// ========== USER ROUTES ==========
router.get('/by-phone', userController.getUserByPhone);
router.get('/', authenticateJWT, userController.getAllUsers);
router.get('/:id', authenticateJWT, userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get('/by-userid/:userid', userController.getUserByUserId);
// router.post('/add-statement/:userId', userController.addStatement);
router.get('/:userId/statements', userController.getUserStatements);
router.post('/add-statement/:userId', userController.addStatement);
router.get('/statements/:userId', userController.getUserStatements);
router.get('/:userId', userController.getUserById);

// ========== OTP GENERATION ==========
const generateOTP = () => Math.floor(1000 + Math.random() * 9000);

// ========== OTP EMAIL ==========
router.post('/send-otp/email', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required.' });

  const otp = generateOTP();
  otpStore[email] = { otp, createdAt: Date.now() };

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
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP sent to email (${email}): ${otp}`);
    res.status(200).json({ message: 'OTP sent via email' });
  } catch (err) {
    console.error('❌ Error sending OTP email:', err);
    res.status(500).json({ message: 'Failed to send OTP via email' });
  }
});

// ========== OTP WHATSAPP ==========
router.post('/send-otp/whatsapp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: 'Phone is required.' });

  const otp = generateOTP();
  otpStore[phone] = { otp, createdAt: Date.now() };

  try {
    let client = getClient();
    if (!client) {
      console.log('ℹ️ Venom client not ready — initializing...');
      client = await initClient();
    }
    if (!client) return res.status(500).json({ message: 'Venom client not ready' });

    await client.sendText(`${phone}@c.us`, `Your OTP code is: ${otp}`);
    console.log(`✅ OTP sent via WhatsApp (${phone}): ${otp}`);
    res.status(200).json({ message: 'OTP sent via WhatsApp' });
  } catch (err) {
    console.error('❌ Error sending OTP WhatsApp:', err);
    res.status(500).json({ message: 'Failed to send OTP via WhatsApp' });
  }
});

// ========== VERIFY OTP ==========
router.post('/verify-otp', (req, res) => {
  const { email, phone, otp } = req.body;
  const key = email || phone;
  if (!key || !otp) return res.status(400).json({ message: 'Email or Phone and OTP required.' });

  const stored = otpStore[key];
  if (!stored) return res.status(400).json({ message: 'OTP not found. Request a new one.' });

  if (Date.now() - stored.createdAt > 5 * 60 * 1000) {
    delete otpStore[key];
    return res.status(400).json({ message: 'OTP expired.' });
  }

  if (parseInt(otp) === stored.otp) {
    delete otpStore[key];
    return res.status(200).json({ message: 'OTP verified successfully.' });
  }

  return res.status(400).json({ message: 'Incorrect OTP.' });
});

module.exports = router;
