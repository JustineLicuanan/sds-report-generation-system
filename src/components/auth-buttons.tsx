import { Loader2, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

import { DropdownMenuItem } from '~/components/ui/dropdown-menu';
import { useToast } from '~/components/ui/use-toast';

export function SignOutDropdownItem() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  async function handleClick() {
    setIsLoading(() => true);
    await signOut();
    setIsLoading(() => false);
    toast({ variant: 'c-primary', description: '✔️ You have been signed out.' });
  }

  return (
    <DropdownMenuItem onClick={handleClick} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="mr-2 h-4 w-4" />
      )}
      <span>Sign out</span>
    </DropdownMenuItem>
  );
}
