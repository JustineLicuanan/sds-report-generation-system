import { LogAction, ReportStatus } from '@prisma/client';
import { type GetServerSideProps } from 'next';
import { CldImage } from 'next-cloudinary';
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
  const org = getOrgWithReportsQuery?.data?.[0];

  org?.reports.sort((a, b) => {
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
            <div className=""></div>
            {org?.imageId ? (
              <CldImage
                width="100"
                height="100"
                src={`/${org?.imageId}`}
                alt="Organization Logo"
                className="my-4 me-1 h-20 w-20 rounded-full bg-green md:h-24 md:w-24 lg:h-28 lg:w-28"
              />
            ) : (
              <div className="my-4 me-1 h-20 w-20 rounded-full bg-green md:h-24 md:w-24 lg:h-28 lg:w-28"></div>
            )}
            <div className="ms-4 self-center">
              <div className="text-2xl font-bold lg:text-3xl">{org?.name}</div>
              <div className="text-lg font-semibold text-black/80 lg:text-xl">
                {org?.category.replace(/_/g, ' ')}
              </div>
            </div>
          </div>
          <div className="my-2 h-2 rounded-md bg-green"> </div>
          <div>
            <h1 className=" my-2 text-3xl font-bold tracking-tight">Report</h1>
            {org?.reports?.filter((log) => log.status === LogAction.PENDING)?.length ? (
              <ReportList
                reports={org?.reports?.filter((log) => log.status === LogAction.PENDING) ?? []}
              />
            ) : (
              <div className="flex items-center justify-center text-xl font-semibold">
                There are no pending reports
                <Image width={25} height={25} src="/pending_icon.png" alt="Pending Icon" />
              </div>
            )}
            <div className="my-2 h-2 rounded-md bg-green"> </div>
            <ReportList
              reports={
                org?.reports?.filter(
                  (report) =>
                    report.status === ReportStatus.APPROVED ||
                    report.status === ReportStatus.REJECTED
                ) ?? []
              }
            />
          </div>
        </div>
      </main>
    </>
  );
}
