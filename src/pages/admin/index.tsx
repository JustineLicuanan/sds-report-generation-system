import { Carousel } from '@material-tailwind/react';
import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Calendar from '~/components/calendar';
import NavBar from '~/components/navigation-bar';
import SideBarMenu from '~/components/side-bar-menu';
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

export default function AdminDashboardPage() {
  const getOrgQuery = api.admin.org.get.useQuery({});

  const data = getOrgQuery.data ?? []; // Assuming getOrgQuery.data is an array of your data

  // Calculate the number of items per group
  const itemsPerGroup = 3;

  const groupedData = [];
  for (let i = 0; i < data.length; i += itemsPerGroup) {
    const group = data.slice(i, i + itemsPerGroup);
    groupedData.push(group);
  }

  return (
    <>
      <Head>
        <title>{`Dashboard ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <NavBar showNotificationButton={true} />

      <main className="flex">
        {/* SIDE BAR MENU */}

        <SideBarMenu />
        <div
          id="main-content"
          className="mx-5 grid grid-cols-3 grid-rows-6 gap-9  md:mx-10 md:my-4 md:w-full"
        >
          <div className="col-span-3 row-span-2 bg-gray shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)]">
            <Carousel className="h-full w-full" autoplay={true} autoplayDelay={4000} loop={true}>
              {groupedData.map((group, index) => (
                <div key={index} className="flex h-[90%] w-full items-center justify-around px-14">
                  {group.map((item, itemIndex) => (
                    <div key={itemIndex} className=" h-[80%] min-w-[350px] rounded-md bg-white ">
                      <div className="my-1 text-center text-lg font-bold">{item.name}</div>
                      <div className="flex h-[80%] min-w-[350px] items-center justify-center">
                        <div className="mx-5 h-28 w-28 rounded-full bg-green"></div>
                        <div className="mx-5">
                          <div className="border-b-2 border-b-black px-1 text-center text-lg font-medium">
                            Pending Appointment <br />
                            <span className="text-2xl font-semibold text-yellow">0</span>
                          </div>
                          <div className="flex  text-center ">
                            <div className="border-r-2 border-r-black  px-1 text-lg font-medium">
                              Approved <br />
                              <span className="text-2xl font-semibold text-yellow">5</span>
                            </div>
                            <div className="px-1 text-center text-lg font-medium">
                              Total Reports <br />
                              <span className="text-2xl font-semibold text-yellow">6</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </Carousel>
          </div>
          <div className="col-span-2 row-span-4 bg-gray/30 p-2 shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)]">
            <Calendar />
          </div>
          <div className="row-span-2 bg-gray px-2 py-2 shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)]">
            <div className="flex items-center ">
              <h1 className=" py-2 text-2xl font-bold">Appointments</h1>
              <Image width={30} height={30} src="/appointment_icon.svg" alt="Appointment Icon" />
            </div>
            <div className="text-lg font-medium ">No pending appointment(s) today.</div>
          </div>
          <div className="row-span-2 bg-gray px-2 py-2 shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)]">
            <div className="flex items-center">
              <h1 className=" py-2 text-2xl font-bold">Announcements</h1>
              <Image width={30} height={30} src="/announcement_icon.svg" alt="Announcement Icon" />
            </div>
            <div className="text-lg font-medium ">No new announcement(s) today.</div>
          </div>
        </div>
      </main>
    </>
  );
}
