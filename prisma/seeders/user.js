const { db } = require('../db');

exports.userSeeder = async () => {
  await db.user.upsert({
    where: { email: 'stu.dev.services.25@gmail.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'stu.dev.services.25@gmail.com',
      role: 'ADMIN',
      isActive: true,
    },
  });

  await db.user.upsert({
    where: { email: 'sec@bits.com' },
    update: {},
    create: {
      name: 'Secretary',
      email: 'sec@bits.com',
      isActive: true,
      organizationId: 'clrco4fh4000008lbec6k8vkb',
      organizationName: 'Builders of Innovative Technologist Society',
      organizationIsArchived: false,
    },
  });

  await db.user.upsert({
    where: { email: 'auditor@bits.com' },
    update: {},
    create: {
      name: 'Auditor',
      email: 'auditor@bits.com',
      isActive: true,
      organizationId: 'clrco4fh4000008lbec6k8vkb',
      organizationName: 'Builders of Innovative Technologist Society',
      organizationIsArchived: false,
    },
  });
};
