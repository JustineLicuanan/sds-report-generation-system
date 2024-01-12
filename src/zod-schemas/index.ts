import { accomplishmentReportSchemas } from '~/zod-schemas/accomplishmentReport';
import { reportSemesterSchemas } from '~/zod-schemas/reportSemester';

export enum OrderBy {
  ASC = 'asc',
  DESC = 'desc',
}

export const schemas = {
  admin: { reportSemester: reportSemesterSchemas.admin, AR: accomplishmentReportSchemas.admin },

  shared: { AR: accomplishmentReportSchemas.shared },
};
