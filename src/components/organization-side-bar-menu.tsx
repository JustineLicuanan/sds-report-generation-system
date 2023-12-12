import Link from 'next/link';
import { useRouter } from 'next/router';

import { buttonVariants } from '~/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { cn } from '~/lib/utils';
import { useSidebarStore } from '~/stores/sidebar';

export default function OrganizationSidebar() {
  const router = useRouter();

  const { isSidebarExpanded, organizationSidebarLinks } = useSidebarStore();

  return (
    <aside className="sticky top-14 z-50 hidden h-[calc(100vh_-_3.5rem)] flex-col gap-1 bg-c-primary py-4 text-c-primary-foreground md:flex">
      <TooltipProvider delayDuration={0} disableHoverableContent>
        {organizationSidebarLinks.map(({ Icon, name, href }) => (
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
