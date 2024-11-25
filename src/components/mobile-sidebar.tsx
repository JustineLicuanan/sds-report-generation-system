import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { Button, buttonVariants } from '~/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';
import { cn } from '~/lib/utils';
import { meta } from '~/meta';
import { useSidebarStore } from '~/stores/sidebar';

type Props = { className?: string; isOrganization?: true };

export function MobileSidebar({ className, isOrganization }: Props) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const { adminSidebarLinks, organizationSidebarLinks } = useSidebarStore();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="c-primary-outline" size="icon" className={className}>
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="flex flex-col items-center justify-center gap-2 text-center">
            <Image src={meta.LOGO} alt={`${meta.NAME} Logo`} height={32} width={32} />

            <h2>{meta.NAME}</h2>
          </SheetTitle>

          <SheetDescription className="text-center">{meta.DESCRIPTION}</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col justify-center gap-1 py-4">
          {(isOrganization ? organizationSidebarLinks : adminSidebarLinks).map(
            ({ Icon, name, href }) => (
              <Link
                key={name}
                href={href}
                className={cn(
                  buttonVariants({
                    variant: router.pathname === href ? 'c-secondary' : 'c-primary-ghost',
                  }),
                  'relative justify-start gap-2'
                )}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="h-5 w-5" /> {name}
              </Link>
            )
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
