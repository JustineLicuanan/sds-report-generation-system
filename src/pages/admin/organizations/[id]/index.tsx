import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import AdminSideBarMenu from '~/components/admin-side-bar-menu';
import NavBar from '~/components/navigation-bar';
import ReportList from '~/components/report-list';
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

export default function ListOfReportPage() {
  const reports = [
    { id: 1, subject: 'Subject 1', date: '02/03/23', status: 'Pending' },
    { id: 2, subject: 'Subject 2', date: '02/04/23', status: 'Approved' },
    { id: 3, subject: 'Subject 3', date: '02/05/23', status: 'Approved' },
    { id: 4, subject: 'Subject 4', date: '02/06/23', status: 'Rejected' },
    { id: 5, subject: 'Subject 5', date: '02/07/23', status: 'Rejected' },
  ];

  reports.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <>
      <Head>
        <title>{`List of Reports ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <NavBar showNotificationButton={true} />

      <main className="flex">
        {/* SIDE BAR*/}
        <AdminSideBarMenu />

        <div id="main-content" className="mx-5 w-full md:mx-10 md:w-8/12">
          <div className="my-2 h-2 rounded-md bg-green"> </div>
          <div className="flex">
            <div className=" my-4 me-1 h-20 w-20 rounded-full bg-green md:h-24 md:w-24 lg:h-28 lg:w-28"></div>
            <div className="self-center">
              <div className="ms-4 text-base font-extrabold md:text-lg lg:text-xl">
                Organization Name
              </div>
              <div className="ms-12 text-base font-extrabold md:text-lg lg:text-xl">Category</div>
            </div>
          </div>
          <div className="my-2 h-2 rounded-md bg-green"> </div>
          <div>
            <h1 className=" my-2 text-3xl font-bold tracking-tight">Report</h1>
            {reports.some((report) => report.status === 'Pending') ? (
              <ReportList reports={reports.filter((report) => report.status === 'Pending')} />
            ) : (
              <h3 className="flex items-center justify-center text-lg font-semibold text-black/80">
                There is no pending report.
                <Image width={25} height={25} src="/pending_icon.png" alt="Pending Icon" />
              </h3>
            )}
          </div>
          <div className="my-2 h-2 rounded-md bg-green"> </div>
          <ReportList
            reports={reports.filter(
              (report) => report.status === 'Approved' || report.status === 'Rejected'
            )}
          />
        </div>
      </main>
    </>
  );
}
