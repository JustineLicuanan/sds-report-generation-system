import { Loader2, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

import { toast } from 'react-toastify';
import { DropdownMenuItem } from '~/components/ui/dropdown-menu';

export function SignOutDropdownItem() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(() => true);
    await signOut();
    setIsLoading(() => false);
    toast.success('You have been signed out.', { position: 'bottom-right' });
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
