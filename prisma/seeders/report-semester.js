const { SemesterTerm } = require('@prisma/client');
const { db } = require('../db');

exports.reportSemesterSeeder = async () => {
  await db.reportSemester.upsert({
    where: { archivedAt: '' },
    update: {},
    create: {
      yearStart: '2021',
      yearEnd: '2022',
      term: SemesterTerm.SECOND,
      dueDateAR: new Date().toISOString(),
      dueDateFS: new Date().toISOString(),
    },
  });
};
