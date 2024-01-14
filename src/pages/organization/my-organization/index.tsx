import { BadgeAlert, BadgeCheck } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import { CldImage } from 'next-cloudinary';
import Head from 'next/head';
import { useRouter } from 'next/router';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
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
  const report = getReportQuery.data ?? [];

  const getOrgQuery = api.shared.organization.get.useQuery();
  const org = getOrgQuery.data;

  report.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const router = useRouter();
  return (
    <>
      <Head>
        <title>{`My Organization ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />

      <main className="flex">
        {/* SIDE BAR*/}
        <OrganizationSideBarMenu />

        <div
          id="main-content"
          className="mx-4 my-4 grid w-full grid-cols-4 grid-rows-6 flex-col gap-8"
        >
          <div className=" col-span-2 row-span-2 flex flex-col items-center justify-between rounded-sm px-4 py-4">
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
          </div>

          <div className="col-span-2 row-span-2 flex flex-col items-center justify-center gap-4 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="text-2xl font-bold">Setup your organization's positions</div>
            <div className="text-center font-medium">
              Establish your organization by completing the required fields and providing necessary
              information as indicated.
            </div>
            <button
              type="button"
              onClick={() =>
                router.push(`${paths.ORGANIZATION}${paths.MY_ORGANIZATION}${paths.POSITIONS}`)
              }
              className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
            >
              Setup positions
            </button>
          </div>

          <div className="relative col-span-2 row-span-2 flex flex-col items-center justify-center gap-4 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="text-2xl font-bold">PREAMBLE, MISSION, VISION, AND GOAL</div>
            <div className="text-center font-medium">
              In the overview, present your preamble, articulate the mission statement of the
              organization and describe the vision and goals
            </div>
            <button
              type="button"
              className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
            >
              Create
            </button>
            <div className="absolute right-2 top-2 h-8 w-8 rounded-full bg-red text-white">
              <BadgeAlert className="h-8 w-8" />
            </div>
          </div>

          <div className="relative col-span-2 row-span-2 flex flex-col items-center justify-center gap-4 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="text-2xl font-bold">ORGANIZATIONAL CHART</div>
            <div className="text-center font-medium">
              llustrate the hierarchical structure of the organization
            </div>
            <button
              type="button"
              className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
            >
              Upload
            </button>
            <div className="absolute right-2 top-2 h-8 w-8 rounded-full bg-green text-white">
              <BadgeCheck className="h-8 w-8" />
            </div>
          </div>

          <div className="relative col-span-2 row-span-2 flex flex-col items-center justify-center gap-4 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="text-2xl font-bold">CONSTITUTIONAL BY LAWS</div>
            <div className="text-center font-medium">
              Provide or update the documented rules and regulations governing the organization
            </div>
            <button
              type="button"
              className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
            >
              Upload
            </button>
            <div className="absolute right-2 top-2 h-8 w-8 rounded-full bg-green text-white">
              <BadgeCheck className="h-8 w-8" />
            </div>
          </div>

          <div className="relative col-span-2 row-span-2 flex flex-col items-center justify-center gap-4 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="text-2xl font-bold">ORGANIZATION&apos;S MEMBERS INFORMATION</div>
            <div className="text-center font-medium">
              This include contact details, roles, and any other relevant data.
            </div>
            <button
              type="button"
              onClick={() =>
                router.push(`${paths.ORGANIZATION}${paths.MY_ORGANIZATION}${paths.MEMBER_INFO}`)
              }
              className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
            >
              Add
            </button>
            <div className="absolute right-2 top-2 h-8 w-8 rounded-full bg-red text-white">
              <BadgeAlert className="h-8 w-8" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
