import { UserRole } from '@prisma/client';
import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { GoogleSignIn, SignIn } from '~/components/sign-in-form';
import { UndrawLogin } from '~/components/svg/undraw-login';
import { Separator } from '~/components/ui/separator';
import { useToast } from '~/components/ui/use-toast';
import { meta, paths } from '~/meta';
import { getServerAuthSession } from '~/server/auth';

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

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (router.query.error) {
      const timeout = setTimeout(() => {
        switch (router.query.error) {
          case 'AccessDenied':
            toast({
              variant: 'destructive',
              description: '❌ Email has no permission to sign in.',
            });

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            router.replace('/auth/sign-in');
            return;

          case 'Verification':
            toast({
              variant: 'destructive',
              description: '❌ Token has expired.',
            });

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            router.replace('/auth/sign-in');
            return;

          default:
            toast({
              variant: 'destructive',
              title: '❌ Internal Server Error',
              description: 'Sign in failed.',
            });

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            router.replace('/auth/sign-in');
            return;
        }
      }, 0);

      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>{`Sign In ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      <div className="relative flex min-h-screen flex-col">
        <section className="container flex flex-col items-center justify-center gap-1 pt-6 text-center">
          <Image
            src={meta.LOGO}
            alt={`${meta.SHORT_NAME} Logo`}
            height={40}
            width={40}
            className="md:hidden"
          />

          <Image
            src={meta.LOGO}
            alt={`${meta.NAME} Logo`}
            height={48}
            width={48}
            className="hidden md:block"
          />

          <h1 className="text-xl font-semibold md:text-3xl">{meta.NAME}</h1>

          <p className="text-sm text-muted-foreground">{meta.DESCRIPTION}</p>
        </section>

        <div className="flex flex-1">
          <main className="flex-1 pb-24">
            <section className="container grid h-full grid-cols-1 justify-items-center pb-6 pt-2 md:grid-cols-2">
              <div className="hidden items-center px-4 md:flex">
                <UndrawLogin className="w-full" />
              </div>

              <div className="flex flex-col justify-center gap-4 md:px-4">
                <div className="flex flex-col justify-center gap-2 text-center">
                  <h2 className="text-2xl">Sign in to your account</h2>

                  <p className="text-sm text-muted-foreground">
                    Enter your email below to sign in to your account
                  </p>
                </div>

                <SignIn />

                <div className="flex items-center justify-center gap-2">
                  <Separator className="flex-1" />

                  <p className="flex-2 whitespace-nowrap text-xs uppercase text-muted-foreground">
                    Or continue with
                  </p>

                  <Separator className="flex-1" />
                </div>

                <GoogleSignIn />
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
