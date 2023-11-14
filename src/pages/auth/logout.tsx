import { signOut } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { meta, paths } from '~/meta';

export default function LogoutPage() {
  return (
    <>
      <Head>
        <title>{`Logout ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>
      <main className="flex h-[100vh] items-center justify-center">
        <div className="relative h-[200px] w-[350px]  rounded-3xl bg-white shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)]">
          <h1 className="py-3 text-center text-3xl font-bold tracking-tight">Logout</h1>
          <div className="h-[1px] w-full bg-black "></div>
          <div className="flex items-center justify-around p-2">
            <Image
              src="/logout_danger_icon.svg"
              width={50}
              height={50}
              alt="Logout Danger"
              className=""
            />
            <div className="py-3 text-center text-2xl font-medium">
              Are you sure you want to logout?
            </div>
          </div>
          <div className="absolute bottom-3 left-7">
            <Link href={paths.ADMIN} className="rounded-md bg-yellow px-8 py-2 text-lg font-medium">
              Back
            </Link>
          </div>
          <div className="absolute bottom-3 right-7">
            <button
              className="rounded-md bg-red px-8 py-2 text-lg font-medium"
              onClick={() => signOut({ callbackUrl: paths.SIGN_IN })}
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
