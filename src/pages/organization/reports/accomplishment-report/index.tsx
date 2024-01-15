import { SemReportStatus } from '@prisma/client';
import { BadgeAlert, Loader2 } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import { CldImage } from 'next-cloudinary';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { CustomDialog } from '~/components/custom-dialog';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
import { useToast } from '~/components/ui/use-toast';
import { meta, paths } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';
import { mergePDF } from '~/utils/merge-pdf';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.organization(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function AccomplishmentReportPage() {
  const router = useRouter();
  const utils = api.useContext();
  const { toast } = useToast();

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

  const getOrgQuery = api.shared.organization.get.useQuery();
  const org = getOrgQuery.data;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const totalPages = Math.ceil(files.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleFiles = files.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const getReportSemester = api.shared.reportSemester.get.useQuery();
  const reportSemester = getReportSemester.data;

  const getAR = api.shared.AR.getOrCreate.useQuery();
  const AR = getAR.data;

  const getARUploads = api.shared.ARUpload.get.useQuery({ current: true });
  const ARUploads = getARUploads.data;

  const turnInAR = api.shared.AR.turnIn.useMutation({
    onSuccess: async () => {
      toast({
        variant: 'c-primary',
        description: '✔️ Accomplishment Report has been compiled & marked as done.',
      });
      await utils.shared.AR.invalidate();
    },
  });

  const cancelAR = api.shared.AR.cancel.useMutation({
    onSuccess: async () => {
      toast({
        variant: 'c-primary',
        description: '✔️ Accomplishment Report has been cancelled.',
      });
      await utils.shared.AR.invalidate();
    },
  });

  const [isMergingPDF, setIsMergingPDF] = useState(false);
  async function handleDone() {
    // const samplePDFs = [
    //   'https://pdf-lib.js.org/assets/american_flag.pdf',
    //   'https://pdf-lib.js.org/assets/with_update_sections.pdf',
    // ];

    if ((ARUploads?.length ?? 0) < 1) {
      toast({
        variant: 'destructive',
        title: '❌ You have no uploaded contents.',
        description: 'Compilation of reports failed.',
      });
      return;
    }

    try {
      setIsMergingPDF(() => true);
      const result = await mergePDF({
        // pdfLinks: samplePDFs,
        pdfLinks: ARUploads?.map(({ file }) => file) ?? [],
        folder: 'accomplishment-reports',
      });

      turnInAR.mutate({ compiled: result.secure_url, compiledId: result.public_id });
      setIsMergingPDF(() => false);
    } catch (err) {
      setIsMergingPDF(() => false);
      toast({
        variant: 'destructive',
        title: '❌ Internal Server Error',
        description: 'Compilation of reports failed.',
      });
    }
  }

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
              <div className="">
                <div className="text-4xl font-bold">Accomplishment Report</div>
                <div className="text-2xl font-medium">
                  <span className="capitalize">
                    {reportSemester?.term.replace(/_/g, ' ').toLowerCase()}
                  </span>{' '}
                  Semester ({reportSemester?.yearStart} - {reportSemester?.yearEnd})
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.ACCOMPLISHMENT_REPORT}${paths.ARCHIVES}`
                  )
                }
                className="me-4 rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Archives
              </button>

              {AR?.status === SemReportStatus.DRAFT ||
              AR?.status === SemReportStatus.FOR_REVISION ? (
                <CustomDialog
                  handleContinue={handleDone}
                  emoji="⚠️"
                  description="The compilation of reports might take some time. Are you sure you want to proceed to compile the reports and mark it as done?"
                >
                  <button
                    type="button"
                    className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                  >
                    {isMergingPDF && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Done
                  </button>
                </CustomDialog>
              ) : AR?.status === SemReportStatus.TURNED_IN ? (
                <button
                  type="button"
                  className="rounded-sm border border-destructive bg-destructive px-3 active:scale-95"
                  onClick={() => cancelAR.mutate()}
                >
                  Cancel
                </button>
              ) : (
                <p className="px-3 text-c-primary">{AR?.status}</p>
              )}

              <button
                type="button"
                onClick={() =>
                  router.push(
                    `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.ACCOMPLISHMENT_REPORT}${paths.GENERATED_FILES}`
                  )
                }
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Generated Files
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.ACCOMPLISHMENT_REPORT}${paths.TEMPLATE}`
                  )
                }
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Generate
              </button>
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
                          }${paths.UPLOADS}/${encodeURIComponent(file.title)}`,
                          query: { contentType: file.title },
                        });
                      }}
                      className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                    >
                      Submit
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
        </div>
      </main>
    </>
  );
}
