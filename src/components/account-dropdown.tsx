import { LifeBuoy, Settings, User, UserPlus, Users } from 'lucide-react';
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

type Props = { children: React.ReactNode };

export function AccountDropdown({ children }: Props) {
  const dropdownGroups = [
    [
      { Icon: User, name: 'Profile', href: '#' },
      { Icon: Settings, name: 'Edit profile', href: '#' },
    ],
    [{ Icon: LifeBuoy, name: 'Support', href: '#' }],
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: 'c-secondary', size: 'icon' }),
          'rounded-full'
        )}
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
