import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { SubmitErrorHandler, useForm, type SubmitHandler } from 'react-hook-form';
import { type z } from 'zod';
import NavBar from '~/components/navigation-bar';
import { meta } from '~/meta';
import { userSchemas } from '~/zod-schemas/shared/user';

type Inputs = z.infer<typeof userSchemas.signIn>;

export default function SignInPage() {
  const signInForm = useForm<Inputs>({ resolver: zodResolver(userSchemas.signIn) });
  const [alertMessage, setAlertMessage] = useState('');

  const onSubmit: SubmitHandler<Inputs> = async ({ email }) => {
    const respo = await signIn('email', { email, redirect: false });

    if (respo?.error) {
      setAlertMessage('error');
      return;
    }
    setAlertMessage('success');
  };

  const onSubmitError: SubmitErrorHandler<Inputs> = async (error) => {
    if (error.email) {
      setAlertMessage('invalid');
      return;
    }
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
        <Image
          width={50}
          height={50}
          src="/login.svg"
          alt="Undraw Illustration Image"
          className="mb-4 mt-3 h-1/5 w-fit md:mb-0 md:h-3/5"
        />

        {/* GOOGLE FORM */}
        <form
          id="google-form"
          className="flex w-3/4 flex-col items-center px-3 md:max-w-[426px]"
          onSubmit={signInForm.handleSubmit(onSubmit, onSubmitError)}
        >
          {alertMessage === 'invalid' && (
            <div
              className="mb-4 flex w-full items-center rounded-lg bg-red-50 p-4 text-base text-red-800 dark:bg-gray-800 dark:text-red-400"
              role="alert"
            >
              <svg
                className="mr-3 inline h-4 w-4 flex-shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <div className="font-medium">
                <span className="font-bold">Error! </span>
                Your email is invalid! Please enter again.
              </div>
            </div>
          )}
          {alertMessage === 'error' && (
            <div
              className="mb-4 flex w-full items-center rounded-lg bg-red-50 p-4 text-base text-red-800 dark:bg-gray-800 dark:text-red-400"
              role="alert"
            >
              <svg
                className="mr-3 inline h-4 w-4 flex-shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <div className="font-medium">
                <span className="font-bold">Access Denied! </span>
                You do not have permission to sign in.
              </div>
            </div>
          )}
          {alertMessage === 'success' && (
            <div
              className="mb-4 flex items-center rounded-lg border border-green-300 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800 dark:bg-gray-800 dark:text-green-400"
              role="alert"
            >
              <svg
                className="mr-3 inline h-4 w-4 flex-shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <div className="font-medium">
                <span className="font-bold">Sign in success!</span> A sign in link has been sent to
                your email address.
              </div>
            </div>
          )}
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

            {/* {signInForm.formState.errors.email && (
              <span className="text-lg font-medium text-red-600 md:text-xl">
                {signInForm.formState.errors.email.message}
              </span>
            )} */}
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
