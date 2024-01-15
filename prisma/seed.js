const { db } = require('./db');
const { settingsSeeder } = require('./seeders/settings');
const { reportSemesterSeeder } = require('./seeders/report-semester');
const { reportSignatorySeeder } = require('./seeders/report-signatory');
const { organizationSeeder } = require('./seeders/organization');
const { userSeeder } = require('./seeders/user');

(async () => {
  try {
    // Seeders
    await settingsSeeder();
    await reportSemesterSeeder();
    await reportSignatorySeeder();
    await organizationSeeder();
    await userSeeder();

    // Disconnect after seeding
    await db.$disconnect();
  } catch (error) {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  }
})();
