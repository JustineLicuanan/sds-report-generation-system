import { CalendarClock, FileCog, Layers, Megaphone, Users } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';

import { SignOutDropdownItem } from '~/components/auth-buttons';
import { buttonVariants } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { cn } from '~/lib/utils';
import { paths } from '~/meta';

type Props = { isOrganization?: true; children: React.ReactNode };

export function AccountDropdown({ isOrganization, children }: Props) {
  const dropdownGroups = isOrganization
    ? [
        // [
        //   { Icon: User, name: 'Profile', href: '#' },
        //   { Icon: Settings, name: 'Edit profile', href: '#' },
        // ],
        // [{ Icon: LifeBuoy, name: 'Support', href: '#' }],
        [
          {
            Icon: Users,
            name: 'My Organization',
            href: `${paths.ORGANIZATION}${paths.MY_ORGANIZATION}`,
          },
          { Icon: Layers, name: 'Consulted Reports', href: `${paths.ORGANIZATION}${paths.REPORT}` },
        ],
      ]
    : [
        // [
        //   { Icon: User, name: 'Profile', href: '#' },
        //   { Icon: Settings, name: 'Edit profile', href: '#' },
        // ],
        // [{ Icon: LifeBuoy, name: 'Support', href: '#' }],
        [
          { Icon: Megaphone, name: 'Appointments', href: `${paths.ADMIN}${paths.APPOINTMENTS}` },
          {
            Icon: CalendarClock,
            name: 'Semester Settings',
            href: `${paths.ADMIN}${paths.SEMESTER}${paths.CREATE}`,
          },
          {
            Icon: FileCog,
            name: 'Signatory Settings',
            href: `${paths.ADMIN}${paths.ORGANIZATION_REPORTS}/settings`,
          },
        ],
      ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(buttonVariants({ variant: 'c-secondary', size: 'icon' }), 'rounded-full')}
      >
        {children}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>

        <DropdownMenuSeparator />

        {dropdownGroups.map((group, idx) => (
          <Fragment key={(idx + 1).toString()}>
            <DropdownMenuGroup>
              {group.map(({ Icon, name, href }) => (
                <DropdownMenuItem key={name} asChild>
                  <Link href={href}>
                    <Icon className="mr-2 h-4 w-4" />

                    <span>{name}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
          </Fragment>
        ))}

        <DropdownMenuGroup>
          <SignOutDropdownItem />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
