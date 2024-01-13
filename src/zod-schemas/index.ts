import { accomplishmentReportSchemas } from '~/zod-schemas/accomplishment-report';
import { appointmentSchemas } from '~/zod-schemas/appointment';
import { ARGeneratedSchemas } from '~/zod-schemas/ar-generated';
import { ARTemplateSchemas } from '~/zod-schemas/ar-template';
import { ARUploadSchemas } from '~/zod-schemas/ar-upload';
import { financialStatementSchemas } from '~/zod-schemas/financial-statement';
import { FSInflowSchemas } from '~/zod-schemas/fs-inflow';
import { FSInflowRowSchemas } from '~/zod-schemas/fs-inflow-row';
import { FSMonthlySchemas } from '~/zod-schemas/fs-monthly';
import { FSOutflowSchemas } from '~/zod-schemas/fs-outflow';
import { FSOutflowRowSchemas } from '~/zod-schemas/fs-outflow-row';
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
    FSInflow: FSInflowSchemas.admin,
    FSInflowRow: FSInflowRowSchemas.admin,
    FSOutflow: FSOutflowSchemas.admin,
    FSOutflowRow: FSOutflowRowSchemas.admin,
  },

  shared: {
    AR: accomplishmentReportSchemas.shared,
    ARUpload: ARUploadSchemas.shared,
    ARGenerated: ARGeneratedSchemas.shared,
    ARTemplate: ARTemplateSchemas.shared,
    FS: financialStatementSchemas.shared,
    FSMonthly: FSMonthlySchemas.shared,
    FSInflow: FSInflowSchemas.shared,
    FSInflowRow: FSInflowRowSchemas.shared,
    FSOutflow: FSOutflowSchemas.shared,
    FSOutflowRow: FSOutflowRowSchemas.shared,
  },
};
