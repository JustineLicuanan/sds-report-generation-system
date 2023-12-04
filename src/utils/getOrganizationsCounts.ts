import { ReportStatus } from '@prisma/client';
import { inferRouterOutputs } from '@trpc/server';

import { AppRouter } from '~/server/api/root';

export function getOrganizationsCounts(
  organizations: inferRouterOutputs<AppRouter>['admin']['org']['get']
) {
  return organizations.map((organization) => {
    const reportCounts = organization.reports.reduce(
      (acc, { status, due }) => {
        if (status === ReportStatus.APPROVED) {
          acc.status.APPROVED++;
        }

        if (due && due >= new Date()) {
          acc.hasSchedule++;
        }

        return acc;
      },
      { status: { APPROVED: 0 }, hasSchedule: 0 }
    );

    return {
      ...organization,
      _count: { reports: { ...reportCounts, _all: organization.reports.length } },
    };
  });
}
