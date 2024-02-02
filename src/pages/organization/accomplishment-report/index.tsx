import { ARUploadContentType, SemReportStatus } from '@prisma/client';
import { Ban, Check, Download, Eye, FileText, FileUp, Layers, Loader2, Trash2 } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import { CldImage } from 'next-cloudinary';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ARMultipleUploads } from '~/components/ar-multiple-uploads';
import { ARSingleUpload } from '~/components/ar-single-upload';
import { CustomDialog } from '~/components/custom-dialog';
import OrgNavbar from '~/components/organization-navigation-bar';
import OrganizationSidebar from '~/components/organization-side-bar-menu';
import { Button, buttonVariants } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { useToast } from '~/components/ui/use-toast';
import { OnSuccessUpload, ResourceType, UploadButton } from '~/components/upload-button';
import { useReportCompiler } from '~/hooks/use-report-compiler';
import { meta } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';
import { parseARUploads } from '~/utils/parse-ar-uploads';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.organization(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function AccomplishmentReport() {
  const router = useRouter();
  const utils = api.useContext();
  const { toast } = useToast();

  const getOrganization = api.shared.organization.get.useQuery();
  const organization = getOrganization.data;

  const getSemester = api.shared.reportSemester.get.useQuery();
  const semester = getSemester.data;

  const getAR = api.shared.AR.getOrCreate.useQuery({ include: { uploads: true } });
  const AR = getAR.data;

  const getUploads = api.shared.ARUpload.get.useQuery({ current: true });
  const uploads = getUploads.data;
  const sortedUploads = parseARUploads(uploads ?? []);

  const [isGenerating, setIsGenerating] = useState(false);
  const { compileAR } = useReportCompiler();

  const statusTextColor =
    AR?.status === SemReportStatus.DRAFT || AR?.status === SemReportStatus.TURNED_IN
      ? 'text-c-secondary'
      : AR?.status === SemReportStatus.COMPLETED
      ? 'text-c-primary'
      : AR?.status === SemReportStatus.FOR_REVISION
      ? 'text-destructive'
      : '';

  const updateAR = api.shared.AR.update.useMutation({
    onSuccess: async () => {
      toast({
        variant: 'c-primary',
        description: `✔️ Accomplishment Report has been updated.`,
      });
      await utils.shared.AR.invalidate();
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: '❌ Internal Server Error',
        description: `Updating of accomplishment report failed.`,
      });
    },
  });

  const turnInAR = api.shared.AR.turnIn.useMutation({
    onSuccess: async () => {
      toast({
        variant: 'c-primary',
        description: `✔️ Accomplishment Report has been turned in.`,
      });
      await utils.shared.AR.invalidate();
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: '❌ Internal Server Error',
        description: `Turning in of accomplishment report failed.`,
      });
    },
  });

  const cancelAR = api.shared.AR.cancel.useMutation({
    onSuccess: async () => {
      toast({
        variant: 'c-primary',
        description: `✔️ Accomplishment Report has been cancelled.`,
      });
      await utils.shared.AR.invalidate();
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: '❌ Internal Server Error',
        description: `Accomplishment Report cancellation failed.`,
      });
    },
  });

  async function handleGenerate() {
    try {
      setIsGenerating(() => true);
      const result = await compileAR(uploads ?? []);

      updateAR.mutate({ compiled: result?.secure_url, compiledId: result?.public_id });
      setIsGenerating(() => false);
    } catch (err) {
      setIsGenerating(() => false);
      toast({
        variant: 'destructive',
        title: '❌ Internal Server Error',
        description: 'Report generation failed.',
      });
    }
  }

  return (
    <>
      <Head>
        <title>{`Accomplishment Report ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      <div className="relative flex min-h-screen flex-col">
        <OrgNavbar />

        <div className="flex flex-1">
          <OrganizationSidebar />

          <main className="flex-1 pb-24">
            <section className="container flex max-w-screen-lg flex-col justify-center gap-2 px-4 py-6 md:px-8">
              <header className="flex items-center gap-4 md:gap-2">
                {organization?.imageId ? (
                  <CldImage
                    width="48"
                    height="48"
                    src={organization.imageId}
                    alt="Organization Logo"
                    className="rounded-full"
                  />
                ) : (
                  <FileText className="h-12 w-12" />
                )}

                <div className="flex flex-col justify-center">
                  <h1 className="text-3xl font-semibold">
                    Accomplishment Report &ndash;{' '}
                    <span className={statusTextColor}>{AR?.status.replace(/_/g, ' ')}</span>
                  </h1>

                  <p className="text-sm capitalize text-muted-foreground">
                    {semester?.term.toLowerCase()} Semester {semester?.yearStart}-
                    {semester?.yearEnd}
                  </p>
                </div>
              </header>

              <div className="flex items-center justify-end gap-2">
                <TooltipProvider delayDuration={0} disableHoverableContent>
                  <Tooltip>
                    <CustomDialog
                      handleContinue={handleGenerate}
                      emoji="🚨"
                      description={
                        <>
                          The report generation may{' '}
                          <span className="text-destructive">TAKE A LONG TIME</span> depending on
                          the report size. Do you want to proceed?
                        </>
                      }
                    >
                      <TooltipTrigger asChild>
                        <Button
                          variant="c-secondary"
                          size="icon"
                          disabled={
                            AR?.status === SemReportStatus.TURNED_IN ||
                            AR?.status === SemReportStatus.COMPLETED ||
                            (uploads?.length ?? 0) < 1 ||
                            isGenerating
                          }
                        >
                          {isGenerating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Layers className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                    </CustomDialog>

                    <TooltipContent side="top">
                      <p>Generate</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <UploadButton
                      className={buttonVariants({ variant: 'c-secondary', size: 'icon' })}
                      folder="accomplishment-reports"
                      resourceType={ResourceType.PDF}
                      onSuccess={
                        ((result) => {
                          updateAR.mutate({
                            compiled: result.info?.secure_url,
                            compiledId: result.info?.public_id,
                          });
                        }) satisfies OnSuccessUpload
                      }
                      disabled={
                        AR?.status === SemReportStatus.TURNED_IN ||
                        AR?.status === SemReportStatus.COMPLETED
                      }
                    >
                      <TooltipTrigger asChild>
                        <FileUp className="h-4 w-4" />
                      </TooltipTrigger>
                    </UploadButton>

                    <TooltipContent side="top">
                      <p>Upload</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CustomDialog
                        handleContinue={() => updateAR.mutate({ compiled: null, compiledId: null })}
                        emoji="🚨"
                        description="This action cannot be undone. This will permanently delete your generated accomplishment report from our servers."
                      >
                        <Button
                          variant="destructive"
                          size="icon"
                          disabled={
                            AR?.status === SemReportStatus.TURNED_IN ||
                            AR?.status === SemReportStatus.COMPLETED ||
                            !AR?.compiled
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CustomDialog>
                    </TooltipTrigger>

                    <TooltipContent side="top">
                      <p>Delete</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      {AR?.status !== SemReportStatus.TURNED_IN ? (
                        <Button
                          variant="c-primary"
                          size="icon"
                          onClick={() => turnInAR.mutate()}
                          disabled={!AR?.compiled || AR?.status === SemReportStatus.COMPLETED}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      ) : (
                        <CustomDialog
                          handleContinue={() => cancelAR.mutate()}
                          description="This action will cancel your accomplishment report submission."
                        >
                          <Button variant="destructive" size="icon">
                            <Ban className="h-4 w-4" />
                          </Button>
                        </CustomDialog>
                      )}
                    </TooltipTrigger>

                    <TooltipContent side="top">
                      <p>Turn in</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      {AR?.compiled ? (
                        <Link
                          href={AR.compiled}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={buttonVariants({ variant: 'outline', size: 'icon' })}
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      ) : (
                        <Button variant="outline" size="icon" disabled>
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </TooltipTrigger>

                    <TooltipContent side="top">
                      <p>Preview</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      {AR?.compiled ? (
                        <a
                          href={AR.compiled}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={buttonVariants({ variant: 'outline', size: 'icon' })}
                          download={`${organization?.acronym}_AR_${semester?.term}_${semester?.yearStart}-${semester?.yearEnd}`}
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      ) : (
                        <Button variant="outline" size="icon" disabled>
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </TooltipTrigger>

                    <TooltipContent side="top">
                      <p>Download</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Separator />

              <div className="flex flex-col justify-center gap-4 py-2">
                <ARSingleUpload
                  contentType={ARUploadContentType.FRONT_PAGE}
                  upload={sortedUploads.FRONT_PAGE?.[0]}
                />

                <ARSingleUpload
                  contentType={ARUploadContentType.PREAMBLE_MISSION_VISION_AND_GOAL}
                  upload={sortedUploads.PREAMBLE_MISSION_VISION_AND_GOAL?.[0]}
                />

                <ARSingleUpload
                  contentType={ARUploadContentType.CONSTITUTION_AND_BY_LAWS}
                  upload={sortedUploads.CONSTITUTION_AND_BY_LAWS?.[0]}
                />

                <ARSingleUpload
                  contentType={ARUploadContentType.ACCEPTANCE_LETTER_OF_ADVISERS}
                  upload={sortedUploads.ACCEPTANCE_LETTER_OF_ADVISERS?.[0]}
                />

                <ARSingleUpload
                  contentType={ARUploadContentType.ORGANIZATIONAL_CHART}
                  upload={sortedUploads.ORGANIZATIONAL_CHART?.[0]}
                />

                <ARMultipleUploads
                  contentType={ARUploadContentType.CURRICULUM_VITAE_OF_OFFICERS}
                  uploads={sortedUploads.CURRICULUM_VITAE_OF_OFFICERS ?? []}
                />

                <ARSingleUpload
                  contentType={ARUploadContentType.CALENDAR_OF_ACTIVITIES}
                  upload={sortedUploads.CALENDAR_OF_ACTIVITIES?.[0]}
                />

                <ARMultipleUploads
                  contentType={ARUploadContentType.APPROVED_ACTIVITY_PROPOSALS}
                  uploads={sortedUploads.APPROVED_ACTIVITY_PROPOSALS ?? []}
                />

                <ARMultipleUploads
                  contentType={ARUploadContentType.APPROVED_PROJECT_PROPOSALS}
                  uploads={sortedUploads.APPROVED_PROJECT_PROPOSALS ?? []}
                />

                <ARMultipleUploads
                  contentType={ARUploadContentType.APPROVED_RESOLUTIONS}
                  uploads={sortedUploads.APPROVED_RESOLUTIONS ?? []}
                />

                <ARMultipleUploads
                  contentType={ARUploadContentType.APPROVED_OTHER_LETTERS}
                  uploads={sortedUploads.APPROVED_OTHER_LETTERS ?? []}
                />

                <ARMultipleUploads
                  contentType={ARUploadContentType.SUMMARY_OF_CONDUCTED_EVENTS}
                  uploads={sortedUploads.SUMMARY_OF_CONDUCTED_EVENTS ?? []}
                />

                <ARMultipleUploads
                  contentType={ARUploadContentType.COMMUNITY_EXTENSION_SERVICES}
                  uploads={sortedUploads.COMMUNITY_EXTENSION_SERVICES ?? []}
                />

                <ARMultipleUploads
                  contentType={ARUploadContentType.MINUTES_OF_THE_MEETING}
                  uploads={sortedUploads.MINUTES_OF_THE_MEETING ?? []}
                />

                <ARMultipleUploads
                  contentType={ARUploadContentType.CERTIFICATES}
                  uploads={sortedUploads.CERTIFICATES ?? []}
                />

                <ARSingleUpload
                  contentType={ARUploadContentType.FEEDBACK_FORM}
                  upload={sortedUploads.FEEDBACK_FORM?.[0]}
                />
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
