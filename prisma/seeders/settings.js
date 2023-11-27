const { db } = require('../db');

exports.settingsSeeder = async () => {
  await db.settings.upsert({
    where: { ofAdmin: true },
    update: {},
    create: {
      ofAdmin: true,
      appName: 'Office of Student Development Services',
      appDescription: 'Scheduling System For Reporting and File Management',
    },
  });
};
