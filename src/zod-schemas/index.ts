import { financialStatementSchemas } from '~/zod-schemas/financial-statement';
import { generatedARSchemas } from '~/zod-schemas/generated-ar';
import { MonthlyFSSchemas } from '~/zod-schemas/monthly-fs';
import { orgSignatoryInfoSchemas } from '~/zod-schemas/org-signatory-info';
import { reportSemesterSchemas } from '~/zod-schemas/report-semester';
import { reportSignatorySchemas } from '~/zod-schemas/report-signatory';

export const schemas = {
  admin: {
    orgSignatoryInfo: orgSignatoryInfoSchemas.admin,
    reportSignatory: reportSignatorySchemas.admin,
    reportSemester: reportSemesterSchemas.admin,
    FS: financialStatementSchemas.admin,
    monthlyFS: MonthlyFSSchemas.admin,
  },

  shared: {
    orgSignatoryInfo: orgSignatoryInfoSchemas.shared,
    reportSignatory: reportSignatorySchemas.shared,
    generatedAR: generatedARSchemas.shared,
    FS: financialStatementSchemas.shared,
    monthlyFS: MonthlyFSSchemas.shared,
  },
};
