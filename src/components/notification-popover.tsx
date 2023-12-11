import { Bell } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '~/components/ui/badge';
import { Button, buttonVariants } from '~/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Separator } from '~/components/ui/separator';
import { cn } from '~/lib/utils';
import { paths } from '~/meta';
import { api } from '~/utils/api';
import { generateNotificationLink } from '~/utils/generateNotificationLink';
import { OrderBy } from '~/zod-schemas/shared/notification';

export function NotificationPopover() {
  const utils = api.useContext();

  const [isOpen, setIsOpen] = useState(false);

  const getUnreadNotifications = api.admin.notification.get.useQuery({
    isRead: false,
    orderByCreatedAt: OrderBy.DESC,
  });

  const getReadNotifications = api.admin.notification.get.useQuery({
    isRead: true,
    orderByCreatedAt: OrderBy.DESC,
  });

  const readNotifications = api.admin.notification.read.useMutation({
    onSuccess: async () => await utils.admin.notification.invalidate(),
  });

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="c-secondary" size="icon" className="relative rounded-full">
          {!!getUnreadNotifications.data?.length && (
            <Badge variant="destructive" className="absolute -right-0.5 -top-0.5 z-50 px-1.5">
              {getUnreadNotifications.data.length}
            </Badge>
          )}

          <Bell className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="flex w-80 flex-col justify-center gap-2">
        <h3 className="text-center text-xl font-semibold">Notifications</h3>

        <Separator />

        <ScrollArea className="h-96">
          <section className="flex flex-col justify-center gap-2">
            <h4 className="text-center text-lg">Unread Notifications:</h4>

            <Button
              variant="c-secondary"
              onClick={() => readNotifications.mutate()}
              disabled={!getUnreadNotifications.data?.length}
            >
              Mark all as read
            </Button>

            {!!getUnreadNotifications.data?.length ? (
              getUnreadNotifications.data.map((notification) => (
                <Link
                  key={notification.id}
                  href={`${paths.ADMIN}${generateNotificationLink(notification)}`}
                  className={cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-auto flex-col items-start justify-center gap-2 whitespace-normal'
                  )}
                  onClick={() => {
                    readNotifications.mutate({ id: notification.id });
                    setIsOpen(() => false);
                  }}
                >
                  <p className="text-sm text-muted-foreground">
                    {notification.createdAt.toLocaleString('en-US', { timeZone: 'Asia/Manila' })}
                  </p>

                  <p>
                    {notification.message.slice(0, 150).trim()}
                    {notification.message.length > 150 && '...'}
                  </p>
                </Link>
              ))
            ) : (
              <h4 className="text-center text-lg text-c-primary">You're all caught up! 🎉</h4>
            )}

            {!!getReadNotifications.data?.length && (
              <>
                <Separator className="mt-8" />

                <h4 className="text-center text-lg">Read Notifications:</h4>

                <Button
                  variant="c-secondary"
                  onClick={() => readNotifications.mutate({ isRead: false })}
                  disabled={!getReadNotifications.data?.length}
                >
                  Mark all as unread
                </Button>

                {getReadNotifications.data.map((notification) => (
                  <Link
                    key={notification.id}
                    href={`${paths.ADMIN}${generateNotificationLink(notification)}`}
                    className={cn(
                      buttonVariants({ variant: 'outline' }),
                      'h-auto flex-col items-start justify-center gap-2 whitespace-normal bg-muted text-muted-foreground hover:bg-muted/80 hover:text-muted-foreground/80'
                    )}
                    onClick={() => setIsOpen(() => false)}
                  >
                    <p className="text-sm text-muted-foreground">
                      {notification.createdAt.toLocaleString('en-US', { timeZone: 'Asia/Manila' })}
                    </p>

                    <p>
                      {notification.message.slice(0, 150).trim()}
                      {notification.message.length > 150 && '...'}
                    </p>
                  </Link>
                ))}
              </>
            )}
          </section>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
