import { GetServerSideProps } from 'next';
import Head from 'next/head';
import AdminNavBar from '~/components/admin-navigation-bar';
import AdminSideBarMenu from '~/components/admin-side-bar-menu';
import { meta } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { authRedirects } from '~/utils/auth-redirects';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.admin(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function MemberPage() {
  return (
    <>
      <Head>
        <title>{`Members ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <AdminNavBar />

      <main className="flex">
        {/* SIDE BAR*/}
        <AdminSideBarMenu />

        <div className="mx-3 my-4 w-full">
          <div className="mx-auto my-0 min-h-[87vh] max-w-5xl rounded-3xl px-5 py-5 shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)] md:px-9">
            {/* <div className="flex justify-between"> */}
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">Members</h1>
            <div className="my-4">
              <div className="text-center text-xl font-medium  md:text-2xl lg:text-3xl">
                This organization doesn't have a member.
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
