import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { useSidebarStore } from '~/stores/sidebar';

type Props = { className?: string };

export function ExpandSidebarButton({ className }: Props) {
  const { isSidebarExpanded, toggleIsSidebarExpanded } = useSidebarStore();

  return (
    <Button
      variant="c-primary-outline"
      size="icon"
      onClick={() => toggleIsSidebarExpanded()}
      className={className}
    >
      {isSidebarExpanded ? (
        <PanelLeftOpen className="h-4 w-4" />
      ) : (
        <PanelLeftClose className="h-4 w-4" />
      )}
    </Button>
  );
}
