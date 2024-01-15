const { OrganizationCategory } = require('@prisma/client');

const { db } = require('../db');

exports.organizationSeeder = async () => {
  await db.organization.upsert({
    where: { id: 'clrco4fh4000008lbec6k8vkb' },
    update: {},
    create: {
      id: 'clrco4fh4000008lbec6k8vkb',
      name: 'Builders of Innovative Technologist Society',
      acronym: 'BITS',
      contactEmail: 'bits@cvsu-imus.com',
      category: OrganizationCategory.ACADEMIC_ORGANIZATION,
      signatoryInfo: { create: {} },
    },
  });
};
