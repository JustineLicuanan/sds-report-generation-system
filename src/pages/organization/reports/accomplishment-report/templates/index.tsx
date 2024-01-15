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

export default function AccomplishmentReportTemplatePage() {
  // const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const router = useRouter();
  const files = [
    {
      filePath: `${paths.CBL}`,
      title: 'Constitutional and By-Laws',
      description: 'Generate the Constitutional and By-Laws',
    },
    {
      filePath: `${paths.RESOLUTION}`,
      title: 'Resolution',
      description: 'Generate the Resolution',
    },
    {
      filePath: `${paths.MINUTES_OF_THE_MEETING}`,
      title: 'Minutes of the Meeting',
      description: 'Generate the Minutes of the Meeting',
    },
    {
      filePath: `${paths.ACTIVITY_PROPOSAL}`,
      title: 'Activity Proposal',
      description: 'Generate the Activity Proposal',
    },
    {
      filePath: `${paths.CALENDAR_OF_ACTIVITIES}`,
      title: 'Calendar of Activities',
      description: 'Generate the Calendar of Activities',
    },
    {
      filePath: `${paths.OTHER_LETTERS}`,
      title: 'Other Letters',
      description: 'Generate the Other Letters',
    },
    {
      filePath: `${paths.SUMMARY_OF_CONDUCTED_EVENTS}`,
      title: 'Summary of Conducted Events',
      description: 'Generate the Summary of Conducted Events',
    },
    {
      filePath: `${paths.COMMUNITY_EXTENSION_SERVICES}`,
      title: 'Summary of Community Extension Services',
      description: 'Generate the Summary of Community Extension Services',
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
            <div className="text-4xl font-bold">Generate Accomplishment Report</div>
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
                    {file.title === 'Activity Proposal' && (
                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.ACCOMPLISHMENT_REPORT}${paths.TEMPLATE}${file.filePath}${paths.MESSAGE}`
                          )
                        }
                        className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                      >
                        Generate Message
                      </button>
                    )}
                    {file.title === 'Other Letters' && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.ACCOMPLISHMENT_REPORT}${paths.TEMPLATE}${file.filePath}${paths.REQUEST_LETTER}`
                            )
                          }
                          className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                        >
                          Request
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.ACCOMPLISHMENT_REPORT}${paths.TEMPLATE}${file.filePath}${paths.EXCUSE_LETTER}`
                            )
                          }
                          className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                        >
                          Excuse
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.ACCOMPLISHMENT_REPORT}${paths.TEMPLATE}${file.filePath}${paths.INVITATION_LETTER}`
                            )
                          }
                          className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                        >
                          Invitation
                        </button>
                      </div>
                    )}

                    {file.title !== 'Other Letters' && (
                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.ACCOMPLISHMENT_REPORT}${paths.TEMPLATE}${file.filePath}`
                          )
                        }
                        className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                      >
                        Generate
                      </button>
                    )}
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
