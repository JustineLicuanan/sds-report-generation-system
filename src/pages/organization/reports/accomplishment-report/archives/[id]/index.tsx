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
  const authRedirect = authRedirects.organization(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function AccomplishmentReportPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const router = useRouter();
  const files = [
    {
      title: 'Acceptance Letter of Advisers',
      description: 'Submit here your Acceptance Letter of Advisers.',
    },
    {
      title: 'Organizational Chart',
      description: 'Submit here your Organizational Chart.',
    },
    {
      title: 'Curriculum Vitae of Officerst',
      description: 'Submit here your Curriculum Vitae of Officerst.',
    },
    {
      title: 'Calendar of Activities',
      description: 'Submit here your Calendar of Activities.',
    },
    {
      title: 'Approved Activity Proposals',
      description: 'Submit here your Approved Activity Proposals.',
    },
    {
      title: 'Approved Project Proposals',
      description: 'Submit here your Approved Project Proposals.',
    },
    {
      title: 'Approved Resolution',
      description: 'Submit here your Approved Resolution.',
    },
    {
      title: 'Approved Other Letters',
      description: 'Submit here your Approved Other Letters.',
    },
    {
      title: 'Summary of Conducted Events',
      description: 'Submit here your Summary of Conducted Events.',
    },
    {
      title: 'Community Extension Services',
      description: 'Submit here your Community Extension Services.',
    },
    {
      title: 'Minutes of the Meeting',
      description: 'Submit here your Minutes of the Meeting.',
    },
    {
      title: 'Feedback Form',
      description: 'Submit here your Feedback Form.',
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
        <title>{`Accomplishment Report ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />

      <main className="flex">
        {/* SIDE BAR*/}
        <OrganizationSideBarMenu />
        <div id="main-content" className="mx-4 my-4  w-full  gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold">Archived Accomplishment Report</div>
              <div className="text-2xl font-medium">[Semester]</div>
            </div>
          </div>

          <div className="mt-8">
            {visibleFiles.map((file, index) => (
              <div
                key={index}
                className="border-sm relative my-2 flex items-center justify-between gap-4 border border-input px-4 py-2"
              >
                <div className="w-1/2 text-center">
                  <div className="text-2xl font-bold">{file.title}</div>
                  <div className="font-medium">{file.description}</div>
                </div>
                <div className="flex w-1/2 flex-col gap-2">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        void router.push({
                          pathname: `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${
                            paths.ACCOMPLISHMENT_REPORT
                          }/${encodeURIComponent(file.title)}`,
                          query: { contentType: file.title },
                        });
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
                  `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.ACCOMPLISHMENT_REPORT}${paths.ARCHIVES}`
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
