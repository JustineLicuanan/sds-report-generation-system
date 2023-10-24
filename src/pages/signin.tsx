import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Head from 'next/head';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { type z } from 'zod';
import NavBar from '~/components/navigation-bar';
import { meta } from '~/meta';
import { orgSchemas } from '~/zod-schemas/org';

type Inputs = z.infer<typeof orgSchemas.signIn>;

export default function SignInPage() {
  const signInForm = useForm<Inputs>({ resolver: zodResolver(orgSchemas.signIn) });

  const onSubmit: SubmitHandler<Inputs> = async ({ email }) => {
    const respo = await signIn('email', { email, redirect: false });

    if (respo?.error) {
      alert('Access Denied! You do not have permission to sign in.');
      return;
    }

    alert('A sign in link has been sent to your email address.');
  };

  return (
    <>
      {/* HEAD */}
      <Head>
        <title>{`Sign In ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <NavBar showNotificationButton={false} />

      {/* MAIN CONTENT */}
      <main className="flex h-[90vh] flex-col items-center px-2 md:flex-row md:items-center md:justify-around">
        <img
          src="login.svg"
          alt="Undraw Illustration Image"
          className="mb-4 mt-3 h-3/5 md:mb-0 md:h-3/5"
        />

        {/* GOOGLE FORM */}
        <form
          id="google-form"
          className="flex w-3/4 flex-col items-center px-3 md:max-w-[426px]"
          onSubmit={signInForm.handleSubmit(onSubmit)}
        >
          <div className="pb-7 text-center text-2xl font-medium tracking-tight md:pb-14 md:text-3xl lg:text-4xl">
            Sign in to your account!
          </div>

          <div className="flex w-full flex-col">
            <label htmlFor="email-address" className="text-lg font-medium md:text-xl">
              Email
            </label>

            <input
              type="text"
              id="email-address"
              className="mt-1 rounded border-[1px] border-[#2A9134] px-2 py-1 text-lg outline-none lg:text-2xl"
              placeholder="john.doe@gmail.com"
              {...signInForm.register('email')}
            />

            {signInForm.formState.errors.email && (
              <span className="text-lg font-medium text-red-600 md:text-xl">
                {signInForm.formState.errors.email.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            id="raise"
            className="mt-3 inline-block w-full rounded px-7 py-3 text-center text-xl shadow-[0_4px_10px_0px_rgba(0,0,0,0.25)] hover:translate-y-[-0.10em] active:translate-y-0 lg:px-11 lg:py-4 lg:text-2xl"
          >
            Sign in with Email
          </button>
        </form>
      </main>
    </>
  );
}
