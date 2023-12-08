import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { type GetServerSideProps } from 'next';
import { CldImage } from 'next-cloudinary';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import AdminNavBar from '~/components/admin-navigation-bar';
import AdminSideBarMenu from '~/components/admin-side-bar-menu';
import Calendar from '~/components/calendar';
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
  const getOrgQuery = api.admin.org.get.useQuery({ includeReports: true });
  const data = getOrgQuery.data ?? []; // Assuming getOrgQuery.data is an array of your data

  const getAnnouncementQuery = api.admin.announcement.get.useQuery();
  const announcement = getAnnouncementQuery.data ?? [];

  const getReportQuery = api.admin.report.get.useQuery();
  const getDue = getReportQuery?.data;
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
          className="mx-5 my-5 grid w-full grid-cols-3 grid-rows-5 gap-9 md:mx-10  md:my-4 md:grid-rows-6"
        >
          <div className="col-span-3 row-span-1 flex w-full flex-col  justify-center bg-gray py-2 shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)] md:row-span-2">
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
                  <div className="mx-2 rounded-md bg-white py-2">
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
                </SplideSlide>
              ))}
            </Splide>
          </div>
          <div className="col-span-3 row-span-2 bg-gray/30 p-2 shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)] md:col-span-2 md:row-span-4">
            <Calendar date={getDue} title={data}/>
          </div>
          <div className="col-span-3 row-span-1 bg-gray px-2 py-2 shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)] md:col-span-1 md:row-span-2">
            <div className="flex items-center ">
              <h1 className=" py-2 text-2xl font-bold">Appointments</h1>
              <Image
                width={30}
                height={30}
                src="/appointment_black_icon.svg"
                alt="Appointment Icon"
              />
            </div>
            <div className="text-lg font-medium ">No pending appointment(s) today.</div>
          </div>
          <Link
            href={`${paths.ADMIN}${paths.ANNOUNCEMENTS}`}
            className="group col-span-3  row-span-1 bg-gray px-2 py-2 shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)] md:col-span-1 md:row-span-2"
          >
            <div className="flex items-center">
              <h1 className=" py-2 text-2xl font-bold group-hover:text-blue-500 group-hover:underline ">
                Announcements
              </h1>
              <Image width={30} height={30} src="/announcement_icon.svg" alt="Announcement Icon" />
            </div>
            <div className="h-[100px] overflow-auto">
              {announcement.length ? (
                announcement.map((announcement, index) => (
                  <div key={index} className="text-lg font-medium ">
                    {announcement.subject}
                  </div>
                ))
              ) : (
                <div className="text-lg font-medium ">There are no announcement.</div>
              )}
            </div>
            {/* <div className="text-lg font-medium ">No new announcement today.</div> */}
          </Link>
        </div>
      </main>
    </>
  );
}
