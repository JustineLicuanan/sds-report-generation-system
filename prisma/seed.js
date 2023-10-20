const { db } = require('./db');
const { userSeeder } = require('./seeders/user');

(async () => {
  try {
    // Seeders
    await userSeeder();

    // Disconnect after seeding
    await db.$disconnect();
  } catch (error) {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  }
})();
