import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
import { meta, paths } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { authRedirects } from '~/utils/auth-redirects';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.organization(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function SetupPositionsPage() {
  const positions = [
    'President',
    'Vice President',
    'Treasurer',
    'Auditor',
    'General Secretary',
    'Assistant Secretary',
    'Finance',
    'Recruitment Coordinator',
    'Training Director',
    'Adviser 1',
    'Adviser 2',
    'Dept. Chairperson',
  ];
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{`Setup Organization Positions ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />

      <main className="flex">
        {/* SIDE BAR*/}
        <OrganizationSideBarMenu />

        <div id="main-content" className="mx-4 my-4  w-full">
          <div className="text-2xl font-bold">Setup Organization Positions</div>
          <div className="mt-8 flex flex-col gap-2">
            {positions.map((position) => (
              <div className="flex items-center gap-4">
                <label htmlFor={position.toLowerCase().replace(/\s/g, '-')}>{position}: </label>
                <input
                  type="text"
                  name=""
                  id={position.toLowerCase().replace(/\s/g, '-')}
                  className="rounded-sm border border-input bg-transparent px-1"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push(`${paths.ORGANIZATION}${paths.MY_ORGANIZATION}`)}
              className="mt-4 rounded-sm border border-gray bg-gray px-3 active:scale-95"
            >
              Back
            </button>
            <button
              type="button"
              className="mt-4 rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
            >
              Save
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
