import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { useSidebarStore } from '~/stores/sidebar';

export function ExpandSidebarButton() {
  const { isSidebarExpanded, toggleIsSidebarExpanded } = useSidebarStore();

  return (
    <Button variant="c-primary-outline" size="icon" onClick={() => toggleIsSidebarExpanded()}>
      {isSidebarExpanded ? (
        <PanelLeftOpen className="h-4 w-4" />
      ) : (
        <PanelLeftClose className="h-4 w-4" />
      )}
    </Button>
  );
}
