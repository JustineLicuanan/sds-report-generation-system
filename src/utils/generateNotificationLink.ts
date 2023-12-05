import { NotificationType, type Notification as TNotification } from '@prisma/client';
import { type inferRouterOutputs } from '@trpc/server';

import { type AppRouter } from '~/server/api/root';

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

export function getNotificationsCount(notifications: TNotification[]) {
  return {
    _count: notifications.reduce(
      (acc, { isRead }) => {
        if (!isRead) {
          acc.isUnread++;
        }

        if (isRead) {
          acc.isRead++;
        }

        return acc;
      },
      { isRead: 0, isUnread: 0 }
    ),
  };
}
