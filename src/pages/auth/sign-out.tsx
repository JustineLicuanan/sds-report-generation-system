import { UserRole } from '@prisma/client';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { signOut } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { meta, paths } from '~/meta';
import { getServerAuthSession } from '~/server/auth';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  return { props: { role: authSession?.user?.role } };
}) satisfies GetServerSideProps;

export default function SignOutPage({
  role,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{`Sign Out ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      <main className="flex flex-col items-center px-4 py-4 md:px-10 md:py-10">
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
        <div className="flex flex-col items-center justify-between md:flex-row">
          <Image
            src="/signout_illustration.svg"
            alt="Sign out"
            height={100}
            width={100}
            id="logo"
            className="mb-4 mt-3 h-[150px] w-fit md:mb-0 md:h-[350px]"
          />
          <div className="relative my-10 h-fit w-[350px] rounded-3xl bg-white shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)]">
            <div className="flex items-center justify-center gap-2">
              <Image
                src="/signout_danger_icon.svg"
                width={50}
                height={50}
                alt="Sign Out Danger"
                className="h-10 w-10"
              />
              <h1 className="py-3 text-center text-3xl font-bold tracking-tight">Sign Out</h1>
            </div>

            <div className="h-[1px] w-full bg-black "></div>
            <div className="px-5 py-3">
              <div className="text-center text-2xl font-medium">
                Are you sure you want to sign out?
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (role === UserRole.ADMIN) {
                      router.push(paths.ADMIN);
                    } else {
                      router.push(paths.ORGANIZATION);
                    }
                  }}
                  className="rounded-md bg-yellow px-8 py-2 text-lg font-medium"
                >
                  Back
                </button>
                <button
                  className="rounded-md bg-red px-8 py-2 text-lg font-medium text-white"
                  onClick={() => signOut({ callbackUrl: paths.SIGN_IN })}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
