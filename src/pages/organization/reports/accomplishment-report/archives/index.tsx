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

export default function AccomplishmentReportArchivePage() {
  // const getOrgQuery = api.shared.organization.get.useQuery();
  // const org = getOrgQuery.data;
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 3;

  const router = useRouter();
  const semester = [
    {
      semNumber: 1,
      year: '2022-2023',
    },
    {
      semNumber: 2,
      year: '2022-2023',
    },
  ];

  return (
    <>
      <Head>
        <title>{`Archived Files ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />

      <main className="flex">
        {/* SIDE BAR*/}
        <OrganizationSideBarMenu />
        <div id="main-content" className="mx-4 my-4  w-full  gap-8">
          <div className="flex flex-col gap-2">
            <div className="text-4xl font-bold">Archived Files</div>
          </div>

          <div className="mt-4">
            {semester.map((sem, index) => (
              <div
                key={index}
                className="border-sm relative my-2 flex items-center justify-between gap-4 border border-input px-4 py-2"
              >
                <div className="w-1/2 text-center">
                  <div className="text-2xl font-bold">
                    {sem.semNumber === 1 ? '1st' : '2nd'} Semester
                  </div>
                  <div className="font-medium">{sem.year}</div>
                </div>
                <div className="flex w-1/2 flex-col gap-2">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        void router.push(
                          `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.ACCOMPLISHMENT_REPORT}${paths.ARCHIVES}/${sem.semNumber}`
                        );
                      }}
                      className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <button
              type="button"
              onClick={() =>
                router.push(
                  `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.ACCOMPLISHMENT_REPORT}`
                )
              }
              className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
            >
              Back
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
