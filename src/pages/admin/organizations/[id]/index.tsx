import { ReportStatus } from '@prisma/client';
import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import AdminNavBar from '~/components/admin-navigation-bar';
import AdminSideBarMenu from '~/components/admin-side-bar-menu';
import ReportList from '~/components/report-list';
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

export default function ListOfReportPage() {
  const router = useRouter();
  const getOrgWithReportsQuery = api.admin.org.get.useQuery({
    id: router.query.id as string,
    includeReports: true,
  });

  getOrgWithReportsQuery?.data?.[0]?.reports.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <>
      <Head>
        <title>{`List of Reports ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <AdminNavBar />

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
            {getOrgWithReportsQuery?.data?.[0]?.reports.some(
              (report) => report.status === ReportStatus.PENDING
            ) ? (
              <ReportList
                reports={getOrgWithReportsQuery?.data?.[0]?.reports.filter(
                  (report) => report.status === ReportStatus.PENDING
                )}
              />
            ) : (
              <h3 className="flex items-center justify-center text-lg font-semibold text-black/80">
                There is no pending report.
                <Image width={25} height={25} src="/pending_icon.png" alt="Pending Icon" />
              </h3>
            )}
          </div>
          <div className="my-2 h-2 rounded-md bg-green"> </div>
          <ReportList
            reports={getOrgWithReportsQuery?.data?.[0]?.reports.filter(
              (report) =>
                report.status === ReportStatus.APPROVED || report.status === ReportStatus.REJECTED
            ) ?? []}
          />
        </div>
      </main>
    </>
  );
}
