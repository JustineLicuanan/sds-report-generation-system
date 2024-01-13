import { accomplishmentReportSchemas } from '~/zod-schemas/accomplishment-report';
import { appointmentSchemas } from '~/zod-schemas/appointment';
import { ARGeneratedSchemas } from '~/zod-schemas/ar-generated';
import { ARTemplateSchemas } from '~/zod-schemas/ar-template';
import { ARUploadSchemas } from '~/zod-schemas/ar-upload';
import { financialStatementSchemas } from '~/zod-schemas/financial-statement';
import { FSMonthlySchemas } from '~/zod-schemas/fs-monthly';
import { reportSemesterSchemas } from '~/zod-schemas/report-semester';

export const schemas = {
  admin: {
    appointment: appointmentSchemas.admin,
    reportSemester: reportSemesterSchemas.admin,
    AR: accomplishmentReportSchemas.admin,
    ARUpload: ARUploadSchemas.admin,
    ARGenerated: ARGeneratedSchemas.admin,
    ARTemplate: ARTemplateSchemas.admin,
    FS: financialStatementSchemas.admin,
    FSMonthly: FSMonthlySchemas.admin,
  },

  shared: {
    AR: accomplishmentReportSchemas.shared,
    ARUpload: ARUploadSchemas.shared,
    ARGenerated: ARGeneratedSchemas.shared,
    ARTemplate: ARTemplateSchemas.shared,
    FS: financialStatementSchemas.shared,
    FSMonthly: FSMonthlySchemas.shared,
  },
};
