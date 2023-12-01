import { NotificationType } from '@prisma/client';
import { inferRouterOutputs } from '@trpc/server';

import { AppRouter } from '~/server/api/root';

export function generateNotificationLink(
  notification:
    | inferRouterOutputs<AppRouter>['shared']['notification']['get'][0]
    | inferRouterOutputs<AppRouter>['admin']['notification']['get'][0]
) {
  switch (notification.type) {
    case NotificationType.ANNOUNCEMENT:
      return `/announcements#${notification.announcementId}`;
    case NotificationType.REPORT:
      return `/reports/${notification.reportId}`;
    case NotificationType.REPORT_COMMENT:
      return `/reports/${notification.reportId}#${notification.commentId}`;
    default:
      return `/announcements`;
  }
}
