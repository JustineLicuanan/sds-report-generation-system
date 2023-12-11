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
  const getReportQuery = api.shared.report.get.useQuery();
  const reportList = getReportQuery.data ?? [];

  const getOrgQuery = api.shared.organization.get.useQuery();
  const org = getOrgQuery.data;

  reportList.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const { data: session } = useSession();
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{`Dashboard ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />

      <main className="flex">
        {/* SIDE BAR*/}
        <OrganizationSideBarMenu />

        <div id="main-content" className="mx-5 w-full md:mx-10 md:w-8/12">
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
                <div className='className="my-4 lg:w-28" me-1 h-20 w-20 rounded-full bg-green md:h-24 md:w-24 lg:h-28'></div>
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
              <button
                onClick={() => router.push(`${paths.ORGANIZATION}${paths.CBL}`)}
                type="button"
                className="rounded-md bg-yellow px-4 py-1 text-lg font-medium"
              >
                View CBL
              </button>
              <button
                type="button"
                onClick={() => router.push(`${paths.ORGANIZATION}${paths.MEMBERS}`)}
                className="rounded-md bg-yellow px-4 py-1 text-lg font-medium"
              >
                View Members
              </button>
            </div>
          </div>
          <div className="my-2 h-2 rounded-md bg-green"> </div>
          <div>
            <h1 className=" my-2 text-3xl font-bold tracking-tight">Report</h1>
            {reportList.filter((report) => report.status === LogAction.PENDING).length > 0 ? (
              <Report logs={reportList.filter((report) => report.status === LogAction.PENDING)} />
            ) : (
              <div className="flex items-center justify-center text-xl font-semibold">
                There are no pending report
                <Image width={25} height={25} src="/pending_icon.png" alt="Pending Icon" />, Create
                a&nbsp;
                <Link
                  href={`${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.REPORT_CREATE}`}
                  className="text-xl text-blue-500 hover:underline"
                >
                  new
                </Link>
                &nbsp;one.
              </div>
            )}
          </div>
          <div className="my-2 h-2 rounded-md bg-green"> </div>
          {reportList.filter(
            (report) => report.status === LogAction.APPROVED || report.status === LogAction.REJECTED
          ).length > 0 ? (
            <Report
              logs={reportList.filter(
                (report) => report.status === LogAction.APPROVED || report.status === LogAction.REJECTED
              )}
            />
          ) : (
            <></>
          )}
        </div>
      </main>
    </>
  );
}
