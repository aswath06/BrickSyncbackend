const venom = require('venom-bot');

let client;

const startVenom = async () => {
  try {
    client = await venom.create(
      'session-name',
      undefined,
      undefined,
      {
        multidevice: true,
        browserArgs: ['--headless=new'], // ✅ Fix for new Chrome versions
      }
    );
    console.log("✅ Venom client created");
    return client;
  } catch (err) {
    console.error("❌ Failed to initialize venom client:", err.message);
    return null;
  }
};

module.exports = {
  startVenom,
  getClient: () => client,
};
