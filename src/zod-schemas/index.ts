import { z } from 'zod';

import { accomplishmentReportSchemas } from '~/zod-schemas/accomplishment-report';
import { ARGeneratedSchemas } from '~/zod-schemas/ar-generated';
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
    ARGenerated: ARGeneratedSchemas.admin,
  },

  shared: {
    AR: accomplishmentReportSchemas.shared,
    ARUpload: ARUploadSchemas.shared,
    ARGenerated: ARGeneratedSchemas.shared,
  },
};

// JSON Schema
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
export const jsonSchema: z.ZodType<Json> = z.lazy(() => {
  return z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]);
});
