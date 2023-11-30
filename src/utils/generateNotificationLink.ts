import { NotificationType, Notification as TNotification } from '@prisma/client';

export function generateNotificationLink(notification: TNotification) {
  switch (notification.type) {
    case NotificationType.REPORT:
      return `/reports/${notification.reportId}`;
    case NotificationType.REPORT_COMMENT:
      return `/reports/${notification.reportId}#${notification.commentId}`;
    default:
      return `/announcements`;
  }
}
