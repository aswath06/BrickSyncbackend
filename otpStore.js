// Temporary in-memory OTP store
const otpStore = {}; // key can be phone or email

// Clean up expired OTPs every 5 minutes (optional for demo)
setInterval(() => {
  const now = Date.now();
  for (const key in otpStore) {
    if (otpStore[key].expiresAt < now) {
      delete otpStore[key];
    }
  }
}, 5 * 60 * 1000);

module.exports = otpStore;
