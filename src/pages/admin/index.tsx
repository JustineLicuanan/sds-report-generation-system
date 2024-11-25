import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { CalendarCheck2, CalendarDays } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import { CldImage } from 'next-cloudinary';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminNavBar from '~/components/admin-navigation-bar';
import AdminSideBarMenu from '~/components/admin-side-bar-menu';
import { cn } from '~/lib/utils';
import { meta, paths } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';
import { getOrganizationsCounts } from '~/utils/getOrganizationsCounts';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.admin(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function AdminDashboardPage() {
  const router = useRouter();

  const getOrgQuery = api.admin.org.get.useQuery({ includeReports: true });
  const data = getOrgQuery.data ?? [];

  const getSemester = api.admin.reportSemester.get.useQuery({ current: true });
  const semester = getSemester.data?.[0];

  const getReportQuery = api.admin.report.get.useQuery({ includeCreatedBy: true });
  const report = getReportQuery.data ?? [];

  return (
    <>
      <Head>
        <title>{`Dashboard ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <AdminNavBar />

      <main className="flex">
        {/* SIDE BAR MENU */}

        <AdminSideBarMenu />
        <div
          id="main-content"
          className="mx-4 my-4 grid w-full grid-cols-3 grid-rows-6 flex-col gap-4"
        >
          {/* Carousel */}
          <div className="col-span-3 row-span-2">
            <div className="rounded-sm px-2 py-4 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
              <Splide
                aria-label="My Favorite Images"
                options={{
                  perPage: 3,
                  focus: 'center',
                  pagination: false,
                  autoplay: true,
                  breakpoints: {
                    1024: {
                      perPage: 1,
                      padding: '2rem',
                    },
                  },
                }}
                data-splide='{"type":"loop"}'
              >
                {getOrganizationsCounts(data).map((item) => (
                  <SplideSlide key={item.id}>
                    <div className="mx-2 rounded-md border border-input pb-4 pt-2 hover:bg-gray/20">
                      <button
                        onClick={() =>
                          router.push(`${paths.ADMIN}${paths.ORGANIZATIONS}/${item.id}`)
                        }
                        className="w-full"
                      >
                        <div>
                          <div className="my-1 text-center text-lg font-bold">{item.name}</div>
                          <div className="flex  items-center justify-center">
                            {item.imageId ? (
                              <CldImage
                                width="100"
                                height="100"
                                src={`/${item.imageId}`}
                                alt="Organization logo"
                                className="mx-2 h-24 w-24 rounded-full bg-green lg:h-20  lg:w-20 xl:h-28 xl:w-28"
                              />
                            ) : (
                              <div className="mx-2 h-24 w-24 rounded-full bg-green lg:h-20  lg:w-20 xl:h-28 xl:w-28"></div>
                            )}

                            <div className="mx-5">
                              <div className="border-b-2 border-b-black px-1 text-center text-lg font-medium">
                                Pending Appointment <br />
                                <span className="text-2xl font-semibold text-yellow">
                                  {item._count.reports.hasSchedule}
                                </span>
                              </div>
                              <div className="flex  text-center ">
                                <div className="border-r-2 border-r-black  px-1 text-lg font-medium">
                                  Approved <br />
                                  <span className="text-2xl font-semibold text-yellow">
                                    {item._count.reports.status.APPROVED}
                                  </span>
                                </div>
                                <div className="px-1 text-center text-lg font-medium">
                                  Total Reports <br />
                                  <span className="text-2xl font-semibold text-yellow">
                                    {item._count.reports._all}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </SplideSlide>
                ))}
              </Splide>
            </div>
            <div className="flex justify-end  pt-2 text-xs">
              <button
                type="button"
                onClick={() => router.push(`${paths.ADMIN}${paths.ORGANIZATIONS}`)}
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                See all
              </button>
            </div>
          </div>

          {/* Charts */}
          {/* <div className="col-span-2 row-span-2 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]"></div> */}

          {/* Current Sem */}
          <div className="col-span-1 row-span-1 flex flex-col items-center justify-center gap-2 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="text-lg font-bold">Current Semester:</div>
            <div className="flex items-center gap-2 ">
              <div className="text-2xl font-semibold capitalize text-yellow">
                {semester
                  ? `${semester.term.toLowerCase()} Semester (${semester.yearStart} - ${
                      semester.yearEnd
                    })`
                  : 'N/A'}
              </div>
              <button
                type="button"
                onClick={() => router.push(`${paths.ADMIN}${paths.SEMESTER}${paths.CREATE}`)}
                className="hover:text-yellow active:scale-95"
              >
                <CalendarDays />
              </button>
            </div>
          </div>

          {/* Submission */}
          <div className="col-span-1 row-span-1 flex flex-col items-center justify-center gap-2 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="text-lg font-bold">Accomplishment Report Submission Date:</div>
            <div className="flex items-center gap-2 ">
              <div
                className={cn(
                  'text-2xl font-semibold',
                  semester?.dueDateAR
                    ? semester.dueDateAR > new Date()
                      ? 'text-c-primary'
                      : 'text-destructive'
                    : 'text-c-secondary'
                )}
              >
                {semester?.dueDateAR?.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }) ?? 'N/A'}
              </div>
              {/* <button type="button" className="hover:text-yellow active:scale-95"> */}
              <CalendarDays />
              {/* </button> */}
            </div>
          </div>

          <div className="col-span-1 row-span-1 flex flex-col items-center justify-center gap-2 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="text-lg font-bold">Financial Report Submission Date:</div>
            <div className="flex items-center gap-2 ">
              <div
                className={cn(
                  'text-2xl font-semibold',
                  semester?.dueDateFS
                    ? semester.dueDateFS > new Date()
                      ? 'text-c-primary'
                      : 'text-destructive'
                    : 'text-c-secondary'
                )}
              >
                {semester?.dueDateFS?.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }) ?? 'N/A'}
              </div>
              {/* <button type="button" className="hover:text-yellow active:scale-95"> */}
              <CalendarDays />
              {/* </button> */}
            </div>
          </div>

          {/* Recent Activity */}
          {/* <div className="col-span-2 row-span-2">
            <div className="rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
              <div className="text-center text-2xl font-bold">
                Organization&apos;s Recent Activity
              </div>
              <div className="my-1 h-[23vh] overflow-auto">
                {getNotificationQuery?.data
                  ?.sort((a, b) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                  })
                  .slice(0, 15)
                  .map((notification, index) => (
                    <div
                      key={index}
                      className="mt-2 flex w-full justify-between overflow-auto rounded-sm border border-input px-4 py-2"
                    >
                      <div className="text-medium">{notification.message}</div>
                      <Link
                        href={`${paths.ADMIN}${generateNotificationLink(notification)}`}
                        className="flex items-center rounded-sm bg-yellow  px-3 text-xs active:scale-95"
                      >
                        View
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex justify-end  pt-2 text-xs">
              <Link
                href={`${paths.ADMIN}${paths.AUTH_LOGS}`}
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                See all
              </Link>
            </div>
          </div> */}

          {/* Appointments */}
          <div className="col-span-3 row-span-2">
            <div className=" rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl font-bold group-hover:text-blue-500 group-hover:underline">
                  Appointments
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
                        <div className="font-medium">
                          {report.createdBy.organizationName} - {report.createdBy.name}
                        </div>
                        <div className="text-xl font-bold">{report.due?.toLocaleString()}</div>
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
            <div className="flex justify-end  pt-2 text-xs">
              <Link
                href={`${paths.ADMIN}${paths.APPOINTMENTS}`}
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Check Calendar
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
