import { accomplishmentReportSchemas } from '~/zod-schemas/accomplishment-report';
import { activityProposalSchemas } from '~/zod-schemas/activity-proposal';
import { ARUploadSchemas } from '~/zod-schemas/ar-upload';
import { financialStatementSchemas } from '~/zod-schemas/financial-statement';
import { generatedARSchemas } from '~/zod-schemas/generated-ar';
import { inflowCollectionFSSchemas } from '~/zod-schemas/inflow-collection-fs';
import { inflowCollectionRowFSSchemas } from '~/zod-schemas/inflow-collection-row-fs';
import { inflowIgpFSSchemas } from '~/zod-schemas/inflow-igp-fs';
import { inflowIgpRowFSSchemas } from '~/zod-schemas/inflow-igp-row-fs';
import { MonthlyFSSchemas } from '~/zod-schemas/monthly-fs';
import { orgSignatoryInfoSchemas } from '~/zod-schemas/org-signatory-info';
import { outflowFSSchemas } from '~/zod-schemas/outflow-fs';
import { outflowRowFSSchemas } from '~/zod-schemas/outflow-row-fs';
import { reportSemesterSchemas } from '~/zod-schemas/report-semester';
import { reportSignatorySchemas } from '~/zod-schemas/report-signatory';

export const schemas = {
  admin: {
    orgSignatoryInfo: orgSignatoryInfoSchemas.admin,
    reportSignatory: reportSignatorySchemas.admin,
    reportSemester: reportSemesterSchemas.admin,
    AR: accomplishmentReportSchemas.admin,
    ARUpload: ARUploadSchemas.admin,
    activityProposal: activityProposalSchemas.admin,
    FS: financialStatementSchemas.admin,
    monthlyFS: MonthlyFSSchemas.admin,
    inflowCollectionFS: inflowCollectionFSSchemas.admin,
    inflowCollectionRowFS: inflowCollectionRowFSSchemas.admin,
    inflowIgpFS: inflowIgpFSSchemas.admin,
    inflowIgpRowFS: inflowIgpRowFSSchemas.admin,
    outflowFS: outflowFSSchemas.admin,
    outflowRowFS: outflowRowFSSchemas.admin,
  },

  shared: {
    orgSignatoryInfo: orgSignatoryInfoSchemas.shared,
    reportSignatory: reportSignatorySchemas.shared,
    AR: accomplishmentReportSchemas.shared,
    ARUpload: ARUploadSchemas.shared,
    generatedAR: generatedARSchemas.shared,
    FS: financialStatementSchemas.shared,
    monthlyFS: MonthlyFSSchemas.shared,
    inflowCollectionFS: inflowCollectionFSSchemas.shared,
    inflowCollectionRowFS: inflowCollectionRowFSSchemas.shared,
    inflowIgpFS: inflowIgpFSSchemas.shared,
    inflowIgpRowFS: inflowIgpRowFSSchemas.shared,
    outflowFS: outflowFSSchemas.shared,
    outflowRowFS: outflowRowFSSchemas.shared,
  },
};
