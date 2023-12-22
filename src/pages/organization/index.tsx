import { CalendarCheck2, CalendarDays, Megaphone } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { CldImage } from 'next-cloudinary';
import Head from 'next/head';
import { useRouter } from 'next/router';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
import { meta } from '~/meta';
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

  const getOrgQuery = api.shared.organization.get.useQuery();
  const org = getOrgQuery.data;

  const getAnnouncementQuery = api.shared.announcement.get.useQuery({
    includeAudience: true,
    orderByDue: OrderBy.ASC,
  });
  const announcement = getAnnouncementQuery.data ?? [];

  report.sort((a, b) => {
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

        <div id="main-content" className="mx-4 my-4 grid w-full grid-cols-4 grid-rows-6  gap-8">
          <div className="col-span-2 row-span-1 flex flex-col items-center justify-center gap-2 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="text-4xl font-semibold">Hi! {session?.user.name}</div>
          </div>

          <div className="col-span-2 row-span-1 flex flex-col items-center justify-center gap-2 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="text-lg font-bold">AR & FS Submission Date:</div>
            <div className="flex items-center gap-2 ">
              <div className="text-2xl font-semibold text-yellow">10/25/2023</div>
              <button type="button" className="hover:text-yellow active:scale-95">
                <CalendarDays />
              </button>
            </div>
          </div>

          <div className="col-span-2 row-span-3 flex flex-col items-center justify-between rounded-sm px-4 py-4 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="flex flex-col items-center gap-4">
              {org?.imageId ? (
                <CldImage
                  width="100"
                  height="100"
                  src={`/${org?.imageId}`}
                  alt="Organization Logo"
                  className=" me-1 h-20 w-20 rounded-full bg-green md:h-24 md:w-24 lg:h-36 lg:w-36"
                />
              ) : (
                <div className='className=" me-1 h-20 w-20 rounded-full bg-green md:h-24 md:w-24 lg:h-28 lg:w-28'></div>
              )}
              <div className="text-2xl font-bold">{org?.name}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-lg font-bold">Current Semester:</div>
              <div className="text-2xl font-semibold text-yellow">1st semester (2023 - 2024)</div>
            </div>
          </div>

          <div className="col-span-2 row-span-1 flex flex-col items-center justify-center gap-2 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="text-lg font-bold">Accomplishment Report Status:</div>
            <div className="h-4 w-full rounded-full bg-gray">
              <div className="h-4 w-[50%] rounded-full bg-green"></div>
            </div>
          </div>

          <div className="col-span-2 row-span-1 flex flex-col items-center justify-center rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="text-lg font-bold">Financial Report Status:</div>
            <div className="text-2xl font-semibold text-green">Done</div>
          </div>

          <div className="col-span-2 row-span-2">
            <div className=" rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl font-bold group-hover:text-blue-500 group-hover:underline">
                  Upcoming Appointment
                </h1>
                <CalendarCheck2 />
              </div>
              <div className="my-1 h-[23vh] overflow-auto ">
                {report
                  .filter((report) => report.due !== null)
                  .map((report, index) => (
                    <div
                      key={index}
                      className="border-sm my-2 flex flex-col items-center gap-2 border border-input p-2"
                    >
                      <div className="text-xl font-medium">{report.due?.toLocaleString()}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="col-span-2 row-span-2">
            <div className=" rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl font-bold group-hover:text-blue-500 group-hover:underline">
                  Announcements
                </h1>
                <Megaphone />
              </div>
              <div className="my-1 h-[23vh] overflow-auto ">
                {announcement.map((announcement, index) => (
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
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-2 row-span-1 flex flex-col items-center justify-center rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="text-lg font-bold">Last activity:</div>
            <div className="text-2xl font-semibold ">[Actions]</div>
          </div>
        </div>
      </main>
    </>
  );
}
