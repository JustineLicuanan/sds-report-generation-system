import { LayoutDashboard, Megaphone, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { buttonVariants } from '~/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { cn } from '~/lib/utils';
import { paths } from '~/meta';
import { useSidebarStore } from '~/stores/sidebar';

export default function OrganizationSidebar() {
  const router = useRouter();
  const isSidebarExpanded = useSidebarStore((state) => state.isSidebarExpanded);

  const links = [
    { Icon: LayoutDashboard, name: 'Dashboard', href: paths.ORGANIZATION },
    { Icon: Users, name: 'My Organization', href: `${paths.ORGANIZATION}${paths.MEMBERS}` },
    { Icon: Megaphone, name: 'Announcements', href: `${paths.ORGANIZATION}${paths.ANNOUNCEMENTS}` },
  ];

  return (
    <aside className="sticky top-14 z-50 flex h-[calc(100vh_-_3.5rem)] flex-col gap-1 bg-c-primary py-4 text-c-primary-foreground">
      <TooltipProvider delayDuration={0} disableHoverableContent>
        {links.map(({ Icon, name, href }) => (
          <Tooltip key={name}>
            <TooltipTrigger asChild>
              <Link
                href={href}
                className={cn(
                  buttonVariants({
                    variant: router.pathname === href ? 'c-secondary' : 'c-primary-ghost',
                  }),
                  'relative justify-start gap-2'
                )}
              >
                <Icon className="h-5 w-5 md:h-6 md:w-6" />{' '}
                {isSidebarExpanded && <span>{name}</span>}
              </Link>
            </TooltipTrigger>

            <TooltipContent side="right" hidden={isSidebarExpanded}>
              <p>{name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </aside>
  );
}
