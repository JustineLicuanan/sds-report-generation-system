import { financialStatementSchemas } from '~/zod-schemas/financial-statement';
import { reportSemesterSchemas } from '~/zod-schemas/report-semester';
import { reportSignatorySchemas } from '~/zod-schemas/report-signatory';

export const schemas = {
  admin: {
    reportSignatory: reportSignatorySchemas.admin,
    reportSemester: reportSemesterSchemas.admin,
    FS: financialStatementSchemas.admin,
  },

  shared: {
    reportSignatory: reportSignatorySchemas.shared,
    FS: financialStatementSchemas.shared,
  },
};
