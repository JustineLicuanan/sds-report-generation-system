import { LogAction } from '@prisma/client';
import { type GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { CldImage } from 'next-cloudinary';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
import Report from '~/components/report';
import { Button } from '~/components/ui/button';
import { meta, paths } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.organization(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function OrganizationPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const getOrgQuery = api.shared.organization.get.useQuery();
  const org = getOrgQuery.data;

  const getSemester = api.shared.reportSemester.get.useQuery();
  const semester = getSemester.data;

  const getReportQuery = api.shared.report.get.useQuery();
  const reportList = getReportQuery.data ?? [];

  reportList.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <>
      <Head>
        <title>{`Consulted Reports ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />

      <main className="flex">
        {/* SIDE BAR*/}
        <OrganizationSideBarMenu />

        <div id="main-content" className="mx-5 w-full">
          <div className="my-2 h-2 rounded-md bg-green"> </div>
          <div className="mx-4 flex justify-between ">
            <div className="flex items-center gap-4">
              {org?.imageId ? (
                <CldImage
                  width="100"
                  height="100"
                  src={`/${org?.imageId}`}
                  alt="Organization Logo"
                  className="my-4 me-1 h-20 w-20 rounded-full bg-green md:h-24 md:w-24 lg:h-28 lg:w-28"
                />
              ) : (
                <div className='className="my-4 me-1 h-20 w-20 rounded-full bg-green md:h-24 md:w-24 lg:h-28 lg:w-28'></div>
              )}
              <div className="">
                <div className="ms-4 text-2xl font-bold lg:text-3xl">
                  {org?.name} - {session?.user.name}
                </div>
                <div className="ms-12 text-lg font-semibold text-black/80 lg:text-xl">
                  {org?.category.replace(/_/g, ' ')}
                </div>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <Button
                variant="c-secondary"
                onClick={() => router.push(`${paths.ORGANIZATION}${paths.ACCOMPLISHMENT_REPORT}`)}
                disabled={!semester}
              >
                View Accomplishment Report
              </Button>

              <Button
                variant="c-secondary"
                onClick={() => router.push(`${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}`)}
                disabled={!semester}
              >
                View Financial Statement
              </Button>
            </div>
          </div>
          <div className="my-2 h-2 rounded-md bg-green"> </div>
          <div>
            <h1 className=" my-2 text-3xl font-bold tracking-tight">Consulted Reports</h1>
            {reportList.filter((report) => report.status === LogAction.PENDING).length > 0 ? (
              <Report logs={reportList.filter((report) => report.status === LogAction.PENDING)} />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="text-center text-xl font-semibold">
                  No pending consulted report.{' '}
                  <Link
                    href={`${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.REPORT_CREATE}`}
                    className="text-xl text-blue-500 hover:underline"
                  >
                    Submit a new one here.
                  </Link>
                </div>
                <Image
                  src="/no_consulted_report.svg"
                  alt="No Consulted Reports"
                  height={100}
                  width={100}
                  className="h-48 w-48"
                />
              </div>
            )}
          </div>
          <div className="my-2 h-2 rounded-md bg-green"> </div>
          {reportList.filter(
            (report) => report.status === LogAction.APPROVED || report.status === LogAction.REJECTED
          ).length > 0 ? (
            <Report
              logs={reportList.filter((report) => {
                return report.status === LogAction.APPROVED || report.status === LogAction.REJECTED;
              })}
            />
          ) : (
            <></>
          )}
        </div>
      </main>
    </>
  );
}
