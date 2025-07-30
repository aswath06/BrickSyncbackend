// firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./firebaseServiceAccountKey.json'); // Use correct path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'bricksync-1f263.appspot.com', // ✅ Your project bucket name
});

const bucket = admin.storage().bucket();
module.exports = bucket;
