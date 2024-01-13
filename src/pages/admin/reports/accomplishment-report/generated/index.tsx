import { BadgeAlert } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
import { meta, paths } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { authRedirects } from '~/utils/auth-redirects';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.admin(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function AccomplishmentReportTemplatePage() {
  // const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const router = useRouter();
  const files = [
    {
      title: 'Acceptance Letter of Advisers',
    },
    {
      title: 'Organizational Chart',
    },
    {
      title: 'Curriculum Vitae of Officers',
    },
    {
      title: 'Calendar of Activities',
    },
    {
      title: 'Approved Activity Proposals',
    },
    {
      title: 'Approved Project Proposals',
    },
    {
      title: 'Approved Resolution',
    },
    {
      title: 'Approved Other Letters',
    },
    {
      title: 'Summary of Conducted Events',
    },
    {
      title: 'Community Extension Services',
    },
    {
      title: 'Minutes of the Meeting',
    },
    {
      title: 'Feedback Form',
    },
  ];

  const totalPages = Math.ceil(files.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleFiles = files.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  return (
    <>
      <Head>
        <title>{`Generated Files ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />

      <main className="flex">
        {/* SIDE BAR*/}
        <OrganizationSideBarMenu />
        <div id="main-content" className="mx-4 my-4  w-full  gap-8">
          <div className="flex flex-col gap-2">
            <div className="text-4xl font-bold">Generated Files</div>
          </div>

          <div className="mt-8">
            {visibleFiles.map((file, index) => (
              <div
                key={index}
                className="border-sm relative my-2 flex items-center justify-between gap-4 border border-input px-4 py-2"
              >
                {/* Org Logo */}
                <div className="h-10 w-10 rounded-full bg-green"> </div>
                <div className="w-1/2 text-center">
                  <div className="text-2xl font-bold">{file.title}</div>
                  <div className="font-medium">View here the {file.title} of [Org Name]</div>
                </div>
                <div className="flex w-1/2 flex-col gap-2">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        void router.push({
                          pathname: `${paths.ADMIN}${paths.ORGANIZATION_REPORTS}${
                            paths.ACCOMPLISHMENT_REPORT
                          }${paths.GENERATED_FILES}/${encodeURIComponent(file.title)}`,
                          query: { orgName: file.title },
                        });
                      }}
                      className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                    >
                      View
                    </button>
                  </div>
                </div>
                <div className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-red text-white">
                  <BadgeAlert className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>

          <div className="my-4 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`${
                  currentPage === index + 1 ? 'bg-yellow' : ''
                } border border-input px-2 py-1`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div>
            <button
              type="button"
              onClick={() =>
                router.push(
                  `${paths.ADMIN}${paths.ORGANIZATION_REPORTS}${paths.ACCOMPLISHMENT_REPORT}`
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
