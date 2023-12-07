import { zodResolver } from '@hookform/resolvers/zod';
import { UserRole } from '@prisma/client';
import { type GetServerSideProps } from 'next';
import { signIn } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { useForm, type SubmitErrorHandler, type SubmitHandler } from 'react-hook-form';
import { type z } from 'zod';
import { meta, paths } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { userSchemas } from '~/zod-schemas/shared/user';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);

  if (authSession?.user?.role === UserRole.STUDENT_LEADER) {
    return { redirect: { destination: paths.ORGANIZATION, permanent: false } };
  }

  if (authSession?.user?.role === UserRole.ADMIN) {
    return { redirect: { destination: paths.ADMIN, permanent: false } };
  }

  return { props: {} };
}) satisfies GetServerSideProps;

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

  const onSubmitError: SubmitErrorHandler<Inputs> = (error) => {
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

      {/* MAIN CONTENT */}
      <main className="flex flex-col items-center px-10 py-5">
        <Image
          src="/cvsu_logo.png"
          alt="CVSU Logo"
          height={100}
          width={100}
          id="logo"
          className="h-16 w-16 rounded-full md:h-20  md:w-20"
        />
        <div className="leading-3">
          <div
            id="title"
            className="text-center text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl"
          >
            Office of Student Development Services
          </div>
          <div
            id="sub-title"
            className="text-center text-base font-medium sm:text-lg md:text-xl lg:text-2xl"
          >
            Scheduling System For Reporting and File Management
          </div>
        </div>
        <div className="flex flex-col items-center justify-between py-4 md:flex-row">
          <Image
            width={20}
            height={20}
            src="/login.svg"
            alt="Undraw Illustration Image"
            className="mb-4 mt-3 h-1/5 w-fit md:mb-0 md:h-[350px]"
          />

          {/* GOOGLE FORM */}
          <form
            id="google-form"
            className="flex w-3/4 flex-col items-center px-3 md:max-w-[426px]"
            onSubmit={signInForm.handleSubmit(onSubmit, onSubmitError)}
          >
            {alertMessage === 'invalid' && (
              <div
                className=" mb-4 flex w-full items-center rounded-lg bg-red/5 p-4 text-base text-red/80"
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
                className=" mb-4 flex w-full items-center rounded-lg bg-red/5 p-4 text-base text-red/80"
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
                className="mb-4 flex items-center rounded-lg border border-green/30 bg-green/5 p-4 text-sm text-green/80"
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
                  <span className="font-bold">Sign in success!</span> A sign in link has been sent
                  to your email address.
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
                className="mt-1 rounded border-[1px] border-green px-2 py-1 text-lg outline-none lg:text-2xl"
                placeholder="john.doe@gmail.com"
                {...signInForm.register('email')}
              />
              {/* <label className="mt-2 hover:cursor-pointer">
                <input
                  className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-yellow checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-yellow checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-yellow checked:focus:bg-yellow checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-yellow dark:checked:after:bg-yellow dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                  type="checkbox"
                  role="switch"
                />
                Save email to this device
              </label> */}
            </div>
            <button
              type="submit"
              id="raise"
              className="mt-3 inline-block w-full rounded bg-yellow px-7 py-3 text-center text-xl hover:translate-y-[-0.10em] active:translate-y-0 lg:px-11 lg:py-4 lg:text-2xl"
            >
              Sign in with Email
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
