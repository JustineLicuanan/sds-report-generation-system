import { Plus, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { paths } from '~/meta';

type Props = { className?: string; children: React.ReactNode };

export function CreateDropdown({ className, children }: Props) {
  const dropdownItems = [
    // { Icon: CalendarPlus, name: 'New Appointment', href: `${paths.ADMIN}${paths.APPOINTMENTS}/create` },
    {
      Icon: UserPlus,
      name: 'New Organization',
      href: `${paths.ADMIN}${paths.ORGANIZATIONS}/create`,
    },
    { Icon: Plus, name: 'New Announcement', href: `${paths.ADMIN}${paths.ANNOUNCEMENTS}/create` },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className}>{children}</DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Create a Resource</DropdownMenuLabel>

        <DropdownMenuSeparator />

        {dropdownItems.map(({ Icon, name, href }, idx) => (
          <Fragment key={name}>
            <DropdownMenuItem key={name} asChild>
              <Link href={href}>
                <Icon className="mr-2 h-4 w-4" />

                <span>{name}</span>
              </Link>
            </DropdownMenuItem>

            {idx !== dropdownItems.length - 1 && <DropdownMenuSeparator />}
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
