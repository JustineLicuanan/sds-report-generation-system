import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { GoogleIcon } from '~/components/svg/google';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { useToast } from '~/components/ui/use-toast';

export function SignIn() {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const signInSchema = z.object({ email: z.string().trim().toLowerCase().email() });
  type SignInInputs = z.infer<typeof signInSchema>;

  const signInForm = useForm<SignInInputs>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '' },
  });

  const onSubmitSignIn: SubmitHandler<SignInInputs> = async ({ email }) => {
    if (isLoading) return;

    setIsLoading(() => true);

    try {
      const res = await signIn('email', { email, redirect: false });
      setIsLoading(() => false);

      if (res?.error) {
        if (res.error === 'AccessDenied') {
          signInForm.setError(
            'email',
            { message: 'Email is incorrect or has no permission to sign in' },
            { shouldFocus: true }
          );

          return;
        }

        toast({
          variant: 'destructive',
          title: '❌ Internal Server Error',
          description: 'Sign in failed.',
        });
        return;
      }

      toast({
        variant: 'c-primary',
        title: '✔️ Email has been sent',
        description: "Check your spam folder in case it doesn't appear in your inbox.",
      });
    } catch (err) {
      setIsLoading(() => false);
      toast({
        variant: 'destructive',
        title: '❌ Internal Server Error',
        description: 'Sign in failed.',
      });
    }
  };

  return (
    <Form {...signInForm}>
      <form
        className="flex flex-col justify-center gap-4"
        onSubmit={signInForm.handleSubmit(onSubmitSignIn)}
      >
        <FormField
          control={signInForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  placeholder="e.g.: juan.delacruz@cvsu.edu.ph"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant="c-secondary" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Sign in with Email
        </Button>
      </form>
    </Form>
  );
}

export function GoogleSignIn() {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    try {
      setIsLoading(() => true);
      await signIn('google');
      setIsLoading(() => false);
    } catch (err) {
      setIsLoading(() => false);
      toast({
        variant: 'destructive',
        title: '❌ Internal Server Error',
        description: 'Sign in failed.',
      });
    }
  }

  return (
    <Button variant="outline" onClick={handleClick} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <GoogleIcon className="mr-2 h-4 w-4" />
      )}
      Google
    </Button>
  );
}
