import { Plus, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { AccountDropdown } from '~/components/account-dropdown';
import { CreateDropdown } from '~/components/create-dropdown';
import { ExpandSidebarButton } from '~/components/expanded-sidebar-button';
import { NotificationPopover } from '~/components/notification-popover';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { buttonVariants } from '~/components/ui/button';
import { cn } from '~/lib/utils';
import { meta, paths } from '~/meta';

export default function AdminNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-c-primary text-c-primary-foreground">
      <section className="container flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <ExpandSidebarButton />

          <Link
            href={paths.ADMIN}
            className="flex items-center gap-2 whitespace-nowrap hover:text-c-primary-foreground/80"
          >
            <Image
              src={meta.LOGO}
              alt={`${meta.SHORT_NAME} Logo`}
              height={24}
              width={24}
              className="md:hidden"
            />

            <Image
              src={meta.LOGO}
              alt={`${meta.NAME} Logo`}
              height={32}
              width={32}
              className="hidden md:block"
            />

            <h2 className="font-bold md:hidden">{meta.SHORT_NAME}.</h2>

            <div className="hidden md:block">
              <h2 className="text-lg font-bold">{meta.NAME}</h2>

              <p className="text-sm">{meta.DESCRIPTION}</p>
            </div>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
          <CreateDropdown
            className={cn(
              buttonVariants({ variant: 'c-secondary', size: 'icon' }),
              'fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full md:hidden'
            )}
          >
            <Plus className="h-6 w-6" />
          </CreateDropdown>

          <CreateDropdown
            className={cn(
              buttonVariants({ variant: 'c-primary-ghost', size: 'icon' }),
              'hidden rounded-full md:inline-flex'
            )}
          >
            <Plus className="h-5 w-5" />
          </CreateDropdown>

          <NotificationPopover />

          <AccountDropdown>
            <Avatar>
              <AvatarImage />

              <AvatarFallback className="bg-c-secondary hover:bg-c-secondary/80">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </AccountDropdown>
        </div>
      </section>
    </header>
  );
}
