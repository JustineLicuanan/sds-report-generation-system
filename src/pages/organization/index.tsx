import { CalendarCheck2, CalendarDays, Megaphone } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { CldImage } from 'next-cloudinary';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
import { cn } from '~/lib/utils';
import { meta, paths } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';
import { OrderBy } from '~/zod-schemas/shared/notification';

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
  const report = getReportQuery.data ?? [];

  const getOrganization = api.shared.organization.get.useQuery();
  const organization = getOrganization.data;

  const getAnnouncementQuery = api.shared.announcement.get.useQuery({
    includeAudience: true,
    orderByDue: OrderBy.ASC,
  });
  const announcement = getAnnouncementQuery.data ?? [];

  const getReportSemester = api.shared.reportSemester.get.useQuery();
  const reportSemester = getReportSemester.data;

  // const getAR = api.shared.AR.getOrCreate.useQuery();
  // const AR = getAR.data;

  // const getFS = api.shared.FS.getOrCreate.useQuery();
  // const FS = getFS.data;

  report.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const { data: session } = useSession();

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

        <div id="main-content" className="mx-4 my-4 grid w-full grid-cols-4 grid-rows-6  gap-8">
          <div className="col-span-2 row-span-1 flex flex-col items-center justify-center gap-2 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="text-4xl font-semibold">
              {session?.user.name ? `Hi, ${organization?.acronym} ${session.user.name}!` : 'Hi!'}
            </div>
          </div>

          <div className="col-span-2 row-span-1 flex flex-col items-center justify-center gap-2 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="text-lg font-bold">Accomplishment Report Submission Date:</div>
            <div className="flex items-center gap-2 ">
              <div
                className={cn(
                  'text-2xl font-semibold',
                  reportSemester?.dueDateFS
                    ? reportSemester.dueDateFS > new Date()
                      ? 'text-c-primary'
                      : 'text-destructive'
                    : 'text-c-secondary'
                )}
              >
                {reportSemester?.dueDateAR?.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }) ?? 'N/A'}
              </div>
              <Link
                href={`${paths.ORGANIZATION}${paths.ACCOMPLISHMENT_REPORT}`}
                className="hover:text-yellow active:scale-95"
              >
                <CalendarDays />
              </Link>
            </div>
          </div>

          <div className="col-span-2 row-span-3 flex flex-col items-center justify-between rounded-sm px-4 py-4 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="flex flex-col items-center gap-4">
              {organization?.imageId ? (
                <CldImage
                  width="100"
                  height="100"
                  src={`/${organization?.imageId}`}
                  alt="Organization Logo"
                  className=" me-1 h-20 w-20 rounded-full bg-green md:h-24 md:w-24 lg:h-36 lg:w-36"
                />
              ) : (
                <div className='className=" me-1 h-20 w-20 rounded-full bg-green md:h-24 md:w-24 lg:h-28 lg:w-28'></div>
              )}
              <div className="text-2xl font-bold">{organization?.name}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-lg font-bold">Current Semester:</div>
              <div className="text-2xl font-semibold capitalize text-yellow">
                {reportSemester
                  ? `${reportSemester.term.replace(/_/g, ' ').toLowerCase()} Semester (
                ${reportSemester.yearStart}-${reportSemester.yearEnd})`
                  : 'N/A'}
              </div>
            </div>
          </div>

          <div className="col-span-2 row-span-1 flex flex-col items-center justify-center gap-2 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="text-lg font-bold">Financial Statement Submission Date:</div>
            <div className="flex items-center gap-2 ">
              <div
                className={cn(
                  'text-2xl font-semibold',
                  reportSemester?.dueDateFS
                    ? reportSemester.dueDateFS > new Date()
                      ? 'text-c-primary'
                      : 'text-destructive'
                    : 'text-c-secondary'
                )}
              >
                {reportSemester?.dueDateFS?.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }) ?? 'N/A'}
              </div>
              <Link
                href={`${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}`}
                className="hover:text-yellow active:scale-95"
              >
                <CalendarDays />
              </Link>
            </div>
          </div>

          {/* <div className="col-span-2 row-span-1 flex flex-col items-center justify-center gap-2 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="text-lg font-bold">Accomplishment Report Status:</div>
            <div className="text-2xl font-semibold text-green">PENDING</div>
          </div>

          <div className="col-span-2 row-span-1 flex flex-col items-center justify-center  gap-2 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="text-lg font-bold">Financial Report Status:</div>
            <div className="text-2xl font-semibold text-green">{FS?.status}</div>
          </div> */}

          <div className="col-span-2 row-span-2">
            <div className=" rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl font-bold group-hover:text-blue-500 group-hover:underline">
                  Announcements
                </h1>
                <Megaphone />
              </div>
              <div className="my-1 h-[23vh] overflow-auto ">
                {announcement.length ? (
                  announcement.map((announcement, index) => (
                    <div
                      key={index}
                      className="border-sm my-2 flex flex-col items-center gap-2 border border-input p-2"
                    >
                      <div className="text-lg font-medium">
                        {announcement.createdAt.toLocaleString('en-US', {
                          timeZone: 'Asia/Manila',
                        })}
                      </div>
                      <div className="text-xl font-bold">{announcement.subject}</div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center ">
                    <div className="text-lg font-medium">No announcements</div>
                    <Image src="/empty_data_icon.svg" alt="Empty Data" width={100} height={100} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-4 row-span-2">
            <div className=" rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl font-bold group-hover:text-blue-500 group-hover:underline">
                  Upcoming Appointments
                </h1>
                <CalendarCheck2 />
              </div>
              <div className="my-1 h-[23vh] overflow-auto ">
                {report.length ? (
                  report
                    .filter((report) => report.due !== null)
                    .map((report, index) => (
                      <div
                        key={index}
                        className="border-sm my-2 flex flex-col items-center gap-2 border border-input p-2"
                      >
                        <div className="text-xl font-medium">{report.due?.toLocaleString()}</div>
                      </div>
                    ))
                ) : (
                  <div className="flex flex-col items-center ">
                    <div className="text-lg font-medium">No appointments</div>
                    <Image
                      src="/no_appointment_icon.svg"
                      alt="No Appointment"
                      width={140}
                      height={100}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
