import { accomplishmentReportSchemas } from '~/zod-schemas/accomplishment-report';
import { ARUploadSchemas } from '~/zod-schemas/ar-upload';
import { reportSemesterSchemas } from '~/zod-schemas/report-semester';

export enum OrderBy {
  ASC = 'asc',
  DESC = 'desc',
}

export const schemas = {
  admin: {
    reportSemester: reportSemesterSchemas.admin,
    AR: accomplishmentReportSchemas.admin,
    ARUpload: ARUploadSchemas.admin,
  },

  shared: { AR: accomplishmentReportSchemas.shared, ARUpload: ARUploadSchemas.shared },
};
