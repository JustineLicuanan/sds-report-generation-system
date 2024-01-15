import { Splide, SplideSlide } from '@splidejs/react-splide';
import { type GetServerSideProps } from 'next';
import { CldImage } from 'next-cloudinary';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminNavbar from '~/components/admin-navigation-bar';
import AdminSidebar from '~/components/admin-side-bar-menu';
import { meta, paths } from '~/meta';
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

export default function OrganizationInformationPage() {
  const router = useRouter();
  const getOrgQuery = api.admin.org.get.useQuery({
    id: router.query.id as string,
  });
  const org = getOrgQuery?.data?.[0];

  return (
    <>
      <Head>
        <title>{`Organization Profile ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <AdminNavbar />

      <main className="flex">
        {/* SIDE BAR*/}
        <AdminSidebar />

        <div id="main-content" className="mx-5 my-4 w-full">
          <div className="flex gap-4">
            {/* ORG NAME */}
            <div className=" flex w-1/3 flex-col items-center gap-4">
              {org?.imageId ? (
                <CldImage
                  width="100"
                  height="100"
                  src={`/${org?.imageId}`}
                  alt="Organization Logo"
                  className="my-4 me-1 h-40 w-40 rounded-full bg-green"
                />
              ) : (
                <div className="my-4 me-1 h-40 w-40 rounded-full bg-green"></div>
              )}
              <div className="">
                <div className="text-lg font-bold">{org?.name}</div>
              </div>
            </div>

            {/* Buttons */}
            <div className=" flex w-1/3 flex-col justify-evenly">
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `${paths.ADMIN}${paths.ORGANIZATIONS}/${org?.id}${paths.ORGANIZATION_SAVE}`
                  )
                }
                className="rounded-sm bg-yellow px-4 py-2 text-xl"
              >
                Edit Profile
              </button>
              <button
                type="button"
                onClick={() =>
                  router.push(`${paths.ADMIN}${paths.ORGANIZATIONS}/${org?.id}${paths.ARCHIVES}`)
                }
                className="rounded-sm bg-yellow px-4 py-2 text-xl"
              >
                Archived Files
              </button>
            </div>

            {/* Carousel */}
            <div className="w-1/3 rounded-sm px-2 py-4 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)] ">
              <Splide
                aria-label="My Favorite Images"
                options={{
                  perPage: 1,
                  focus: 'center',
                  pagination: false,
                  autoplay: true,
                }}
                data-splide='{"type":"loop"}'
              >
                <SplideSlide>
                  <div className="mx-2 rounded-md pb-4 pt-2 text-center">
                    <div className="text-lg font-bold">Vision</div>
                    <div className="font-medium ">
                      The premier university in historic Cavite globally recognized for excellence
                      in character development, academics, research, innovation and sustainable
                      community engagement.
                    </div>
                  </div>
                </SplideSlide>
                <SplideSlide>
                  <div className="mx-2 rounded-md  pb-4 pt-2 text-center">
                    <div className="text-lg font-bold">Mission</div>
                    <div className="font-medium ">
                      Cavite State University shall provide excellent, equitable and relevant
                      educational opportunities in the arts, sciences and technology through quality
                      instruction and responsive research and development activities. It shall
                      produce professional, skilled and morally upright individuals for global
                      competitiveness.
                    </div>
                  </div>
                </SplideSlide>
                <SplideSlide>
                  <div className="mx-2 rounded-md pb-4 pt-2 text-center">
                    <div className="text-lg font-bold">Goals</div>
                    <div className="text-left text-xs font-medium">
                      1. Produce technically competent and scientifically oriented graduates who are
                      imbued with strong entrepreneurial spirit possess strong social consciousness,
                      and guided by positive values and high ethical standards;
                      <br /> 2. Conduct relevant research and development activities along
                      agriculture, food, environment and natural resource management;
                      <br /> 3. Implement effective training and outreach programs that emphasize
                      self-help, critical thinking and life-long learning;
                      <br />
                      4. Manage agricultural enterprises, projects and technology incubators to
                      promote economically viable and environment- friendly approaches and
                      techniques; and <br /> 5. Establish strong linkage with non-governmental
                      organizations, other government entities and the community for the realization
                      of the common goals.
                    </div>
                  </div>
                </SplideSlide>
              </Splide>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 grid-rows-2 gap-2">
            <div className="col-span-2 rounded-sm px-2 py-4 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
              <div className="text-center text-xl font-bold">Financial Statement Status</div>

              <div className="mt-2 flex justify-evenly gap-2  ">
                <div className="flex flex-col items-center rounded-sm border border-input p-2">
                  <div className="text-lg font-medium">Total Inflows Cost</div>
                  <div className="flex">
                    <div className=" font-medium">900</div>
                    <div className="self-end text-sm">php</div>
                  </div>
                </div>

                <div className="flex flex-col items-center rounded-sm border border-input p-2">
                  <div className="text-lg font-medium">Total Outflow Cost</div>
                  <div className="flex">
                    <div className=" font-medium">1000</div>
                    <div className="self-end text-sm">php</div>
                  </div>
                </div>

                <div className="flex flex-col items-center rounded-sm border border-input p-2">
                  <div className="text-lg font-medium">Total Cash</div>
                  <div className="flex">
                    <div className=" font-medium">1000</div>
                    <div className="self-end text-sm">php</div>
                  </div>
                </div>

                <div className="flex flex-col items-center rounded-sm border border-input p-2">
                  <div className="text-lg font-medium">Net Income (Gross/Loss)</div>
                  <div className="flex text-red">
                    <div className=" font-medium ">- 100</div>
                    <div className="self-end text-sm">php</div>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                >
                  Generate Summary
                </button>
                <button
                  type="button"
                  className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                >
                  View In-Depth
                </button>
                <button
                  type="button"
                  className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                >
                  View Submitted
                </button>
              </div>
            </div>

            <div className="col-span-1 flex flex-col items-center rounded-sm px-2 py-4 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
              <div className="text-lg font-bold">Updates</div>
              <div>
                <div className="text-lg font-medium">Financial Statement Last Update:</div>
                <div className="text-center  font-medium">01/02/2024</div>
              </div>
              <div>
                <div className="text-lg font-medium">Accomplishment Last Update:</div>
                <div className="text-center  font-medium">01/02/2024</div>
              </div>
            </div>

            <div className="col-span-1 flex flex-col items-center justify-between rounded-sm px-2 py-4 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
              <div className="text-lg font-bold">Accomplishment Report Status</div>
              <div className="text-xl  text-green">Done</div>
              <div className="mt-2 flex justify-between gap-2">
                <button
                  type="button"
                  className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                >
                  View Submitted
                </button>
              </div>
            </div>

            <div className="col-span-1 flex flex-col items-center rounded-sm px-2 py-4 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
              <div className="text-lg font-bold">Submitted Reports</div>
              <div className="mt-2 flex flex-col items-center  rounded-sm border border-input p-2">
                <div className="text-lg font-medium">Total:</div>
                <div className="text-4xl font-bold">11</div>
              </div>
            </div>

            <div className="col-span-1 flex flex-col items-center rounded-sm px-2 py-4 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
              <div className="text-lg font-bold">Appointments</div>
              <div>
                <div className="text-lg font-medium">[Appointment Details]</div>
                <div className="text-center  font-medium">01/02/2024</div>
              </div>
              <div>
                <div className="text-lg font-medium">[Appointment Details]</div>
                <div className="text-center  font-medium">01/02/2024</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
