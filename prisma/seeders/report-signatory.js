const { db } = require('../db');

exports.reportSignatorySeeder = async () => {
  await db.reportSignatory.upsert({
    where: { position: 'CSG Secretary' },
    update: {},
    create: { position: 'CSG Secretary', name: 'Karylle D. Delicana' },
  });

  await db.reportSignatory.upsert({
    where: { position: 'CSG President' },
    update: {},
    create: { position: 'CSG President', name: 'Van Ellis V. Mercado' },
  });

  await db.reportSignatory.upsert({
    where: { position: 'CSG Treasurer' },
    update: {},
    create: { position: 'CSG Treasurer', name: 'Van Ellis V. Mercado' },
  });

  await db.reportSignatory.upsert({
    where: { position: 'SDS Coordinator' },
    update: {},
    create: { position: 'SDS Coordinator', name: 'Armand G. Aton, MAEd' },
  });

  await db.reportSignatory.upsert({
    where: { position: 'OSAS Head' },
    update: {},
    create: { position: 'OSAS Head', name: 'Engr. Delilah B. Antolin' },
  });

  await db.reportSignatory.upsert({
    where: { position: 'Campus Administrator' },
    update: {},
    create: { position: 'Campus Administrator', name: 'Dr. Jenny Beb F. Espineli' },
  });

  await db.reportSignatory.upsert({
    where: { position: 'Chairperson of Department of Physical Education' },
    update: {},
    create: { position: 'Chairperson of Department of Physical Education', name: 'Mr. Sixto Ras' },
  });
};
