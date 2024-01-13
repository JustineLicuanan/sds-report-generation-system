import { accomplishmentReportRouter } from '~/server/api/routers/shared/accomplishment-report';
import { announcementRouter } from '~/server/api/routers/shared/announcement';
import { appointmentRouter } from '~/server/api/routers/shared/appointment';
import { ARGeneratedRouter } from '~/server/api/routers/shared/ar-generated';
import { ARTemplateRouter } from '~/server/api/routers/shared/ar-template';
import { ARUploadRouter } from '~/server/api/routers/shared/ar-upload';
import { commentRouter } from '~/server/api/routers/shared/comment';
import { curriculumVitaeRouter } from '~/server/api/routers/shared/curriculum-vitae';
import { financialStatementRouter } from '~/server/api/routers/shared/financial-statement';
import { FSInflowRouter } from '~/server/api/routers/shared/fs-inflow';
import { FSInflowRowRouter } from '~/server/api/routers/shared/fs-inflow-row';
import { FSMonthlyRouter } from '~/server/api/routers/shared/fs-monthly';
import { FSOutflowRouter } from '~/server/api/routers/shared/fs-outflow';
import { FSOutflowRowRouter } from '~/server/api/routers/shared/fs-outflow-row';
import { logRouter } from '~/server/api/routers/shared/log';
import { notificationRouter } from '~/server/api/routers/shared/notification';
import { organizationRouter } from '~/server/api/routers/shared/organization';
import { reportRouter } from '~/server/api/routers/shared/report';
import { reportSemesterRouter } from '~/server/api/routers/shared/report-semester';
import { reportSignatoryRouter } from '~/server/api/routers/shared/report-signatory';
import { sessionRouter } from '~/server/api/routers/shared/session';
import { createTRPCRouter } from '~/server/api/trpc';

export const sharedRouter = createTRPCRouter({
  organization: organizationRouter,
  session: sessionRouter,
  comment: commentRouter,
  log: logRouter,

  // Extras
  appointment: appointmentRouter,
  reportSignatory: reportSignatoryRouter,
  reportSemester: reportSemesterRouter,
  AR: accomplishmentReportRouter,
  ARUpload: ARUploadRouter,
  ARGenerated: ARGeneratedRouter,
  ARTemplate: ARTemplateRouter,
  curriculumVitae: curriculumVitaeRouter,
  FS: financialStatementRouter,
  FSMonthly: FSMonthlyRouter,
  FSInflow: FSInflowRouter,
  FSInflowRow: FSInflowRowRouter,
  FSOutflow: FSOutflowRouter,
  FSOutflowRow: FSOutflowRowRouter,

  // TODO: To remove
  announcement: announcementRouter,
  report: reportRouter,
  notification: notificationRouter,
});
