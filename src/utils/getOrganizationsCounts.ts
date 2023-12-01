import { ReportStatus } from '@prisma/client';
import { inferRouterOutputs } from '@trpc/server';

import { AppRouter } from '~/server/api/root';

export function getOrganizationsCounts(
  organizations: inferRouterOutputs<AppRouter>['admin']['org']['get']
) {
  return organizations.map((organization) => ({
    ...organization,
    _count: {
      reports: {
        _all: organization.reports.length,
        status: {
          APPROVED: organization.reports.reduce(
            (acc, { status }) => (status === ReportStatus.APPROVED ? acc + 1 : acc),
            0
          ),
        },
        hasSchedule: organization.reports.reduce(
          (acc, { due }) => (due && due >= new Date() ? acc + 1 : acc),
          0
        ),
      },
    },
  }));
}
