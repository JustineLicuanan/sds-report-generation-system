import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import AdminCalendar from '~/components/admin-calendar';
import AdminNavBar from '~/components/admin-navigation-bar';
import AdminSideBarMenu from '~/components/admin-side-bar-menu';
import { meta } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.admin(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function AppointmentPage() {
  const getReportQuery = api.admin.report.get.useQuery({ includeCreatedBy: true });
  const report = getReportQuery.data ?? [];

  return (
    <>
      {/* HEADER */}
      <Head>
        <title>{`Appointments ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <AdminNavBar />
      <main className="flex">
        {/* SIDE BAR */}
        <AdminSideBarMenu />

        {/* MAIN CONTENT */}

        <div className="mx-3 my-4 w-full">
          <div className="mx-auto my-0 min-h-[87vh] max-w-5xl rounded-sm p-4 shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)] md:p-8">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
              Appointments
            </h1>
            <div className="my-5 p-1 shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)]">
              <AdminCalendar date={report} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
