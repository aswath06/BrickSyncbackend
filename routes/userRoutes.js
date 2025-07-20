const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { initClient, getClient } = require('../venomClient');
const userController = require('../controllers/userController');
const { User } = require('../models'); // Sequelize User model
// const {authenticateJWT} = require ('../middleware/authMiddleware')
// import {authenticateJWT} from '../middleware/authMiddleware.jsx';
const { authenticateJWT } = require('../middleware/authMiddleware');
const { jwt } = require('twilio');
// const {dotenv} = require('dotenv');
// In-memory OTP store
const otpStore = {};
// dotenv.config();

// ========== USER CRUD ROUTES ==========
router.get('/by-phone', userController.getUserByPhone);
router.get('/',authenticateJWT, userController.getAllUsers);
router.get('/:id', authenticateJWT,userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get('/by-userid/:userid', userController.getUserByUserId);

// ========== Generate OTP ==========
const generateOTP = () => Math.floor(1000 + Math.random() * 9000);

// ========== Send OTP via Email ==========
router.post('/send-otp/email', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  const otp = generateOTP();
  otpStore[email] = { otp, createdAt: Date.now() };

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'maswath55@gmail.com',
      pass: 'hccq svbv cwac wgrn' // Use an app-specific password for Gmail
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

// ========== Send OTP via WhatsApp ==========
router.post('/send-otp/whatsapp', async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: 'Phone is required.' });
  }

  const otp = generateOTP();
  otpStore[phone] = { otp, createdAt: Date.now() };
  const otpMessage = `Your OTP code is: ${otp}`;

  try {
    let client = getClient();

    if (!client) {
      console.log('ℹ️ Venom client not ready — initializing...');
      client = await initClient();
    }

    if (!client) {
      return res.status(500).json({ message: 'Venom client still not ready.' });
    }

    await client.sendText(`${phone}@c.us`, otpMessage);
    console.log(`✅ OTP sent via WhatsApp (${phone}): ${otp}`);
    res.status(200).json({ message: 'OTP sent via WhatsApp' });
  } catch (err) {
    console.error('❌ Error sending OTP WhatsApp:', err);
    res.status(500).json({ message: 'Failed to send OTP via WhatsApp' });
  }
});

// ========== Verify OTP ==========
router.post('/verify-otp', (req, res) => {
  const { email, phone, otp } = req.body;
  const key = email || phone;

  if (!key || !otp) {
    return res.status(400).json({ message: 'Email or Phone and OTP are required.' });
  }

  const stored = otpStore[key];
  if (!stored) {
    return res.status(400).json({ message: 'OTP not found. Please request a new one.' });
  }

  if (Date.now() - stored.createdAt > 5 * 60 * 1000) {
    delete otpStore[key];
    return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
  }

  if (parseInt(otp) === stored.otp) {
    delete otpStore[key];
    console.log(`✅ OTP verified for ${key}`);
    return res.status(200).json({ message: 'OTP verified successfully.' });
  }

  console.log(`❌ Incorrect OTP attempt for ${key}`);
  return res.status(400).json({ message: 'Incorrect OTP.' });
});

// ========== Get User by Phone ==========
// router.get('/by-phone', async (req, res) => {
//   const { phone } = req.query;

//   if (!phone) {
//     return res.status(400).json({ error: 'Phone number is required' });
//   }

//   try {
//     const user = await User.findOne({ where: { phone } });

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     const token = jwt.sign({ id: user.userid },'your_secret_key', { expiresIn: '1h' });
//     // const token = jwt.sign({id:user.userid}),process.env.JWT_SECRET,{expiresIn: '1h'};
//     console.log("tokens : " , token);
//     res.status(200).json(token , user);
//   } catch (err) {
//     console.error('Error fetching user by phone:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

module.exports = router;
