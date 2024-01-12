const { ARGeneratedContentType } = require('@prisma/client');

const { ARTemplates } = require('../data/ar-template');
const { db } = require('../db');

exports.ARTemplateSeeder = async () => {
  await db.aRTemplate.upsert({
    where: {
      contentType_name: {
        contentType: ARGeneratedContentType.ACTIVITY_PROPOSAL,
        name: 'Table',
      },
    },
    update: {},
    create: {
      name: 'Table',
      contentType: ARGeneratedContentType.ACTIVITY_PROPOSAL,
      content: JSON.stringify(ARTemplates.APPROVED_ACTIVITY_PROPOSAL.Table),
      isActive: true,
    },
  });

  await db.aRTemplate.upsert({
    where: {
      contentType_name: {
        contentType: ARGeneratedContentType.ACTIVITY_PROPOSAL,
        name: 'Message',
      },
    },
    update: {},
    create: {
      name: 'Message',
      contentType: ARGeneratedContentType.ACTIVITY_PROPOSAL,
      content: JSON.stringify(ARTemplates.APPROVED_ACTIVITY_PROPOSAL.Message),
      isActive: true,
    },
  });
};
