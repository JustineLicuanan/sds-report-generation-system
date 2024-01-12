import { accomplishmentReportSchemas } from '~/zod-schemas/accomplishment-report';
import { ARGeneratedSchemas } from '~/zod-schemas/ar-generated';
import { ARTemplateSchemas } from '~/zod-schemas/ar-template';
import { ARUploadSchemas } from '~/zod-schemas/ar-upload';
import { reportSemesterSchemas } from '~/zod-schemas/report-semester';

export const schemas = {
  admin: {
    reportSemester: reportSemesterSchemas.admin,
    AR: accomplishmentReportSchemas.admin,
    ARUpload: ARUploadSchemas.admin,
    ARGenerated: ARGeneratedSchemas.admin,
    ARTemplate: ARTemplateSchemas.admin,
  },

  shared: {
    AR: accomplishmentReportSchemas.shared,
    ARUpload: ARUploadSchemas.shared,
    ARGenerated: ARGeneratedSchemas.shared,
    ARTemplate: ARTemplateSchemas.shared,
  },
};
