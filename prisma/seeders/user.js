const { db } = require('../db');

exports.userSeeder = async () => {
  await db.user.upsert({
    where: { email: 'stu.dev.services.25@gmail.com' },
    update: {},
    create: { name: 'Admin', email: 'stu.dev.services.25@gmail.com', role: 'ADMIN' },
  });
};
