import { FilePlus2, Plus, UserPlus } from 'lucide-react';
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

type Props = { className?: string; isOrganization?: true; children: React.ReactNode };

export function CreateDropdown({ className, isOrganization, children }: Props) {
  const dropdownItems = isOrganization
    ? [
        {
          Icon: FilePlus2,
          name: 'New Report',
          href: `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.REPORT_CREATE}`,
        },
        {
          Icon: UserPlus,
          name: 'Add Member',
          href: `${paths.ORGANIZATION}${paths.MEMBERS}`,
        },
      ]
    : [
        // { Icon: CalendarPlus, name: 'New Appointment', href: `${paths.ADMIN}${paths.APPOINTMENTS}/create` },
        {
          Icon: UserPlus,
          name: 'New Organization',
          href: `${paths.ADMIN}${paths.ORGANIZATIONS}${paths.ORGANIZATION_CREATE}`,
        },
        {
          Icon: Plus,
          name: 'New Announcement',
          href: `${paths.ADMIN}${paths.ANNOUNCEMENTS}/create`,
        },
      ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className}>{children}</DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Create...</DropdownMenuLabel>

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
