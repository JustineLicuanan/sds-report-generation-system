const { db } = require('../db');

exports.userSeeder = async () => {
  await db.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
};
