const { db } = require('./db');
const { settingsSeeder } = require('./seeders/settings');
const { userSeeder } = require('./seeders/user');

(async () => {
  try {
    // Seeders
    await settingsSeeder();
    await userSeeder();

    // Disconnect after seeding
    await db.$disconnect();
  } catch (error) {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  }
})();
