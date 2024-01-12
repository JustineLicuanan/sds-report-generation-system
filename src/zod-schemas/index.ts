import { accomplishmentReportSchemas } from '~/zod-schemas/accomplishment-report';
import { reportSemesterSchemas } from '~/zod-schemas/report-semester';

export enum OrderBy {
  ASC = 'asc',
  DESC = 'desc',
}

export const schemas = {
  admin: { reportSemester: reportSemesterSchemas.admin, AR: accomplishmentReportSchemas.admin },

  shared: { AR: accomplishmentReportSchemas.shared },
};
