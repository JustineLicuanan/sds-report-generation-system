import { zodResolver } from '@hookform/resolvers/zod';
import { ARUploadContentType, SemReportStatus } from '@prisma/client';
import { AlertOctagon, BadgeAlert, BadgeCheck, Eye, FileUp, Plus } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import { CldImage } from 'next-cloudinary';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
import { SingleARUploadActions } from '~/components/single-ar-upload-actions';
import { Button, buttonVariants } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { useToast } from '~/components/ui/use-toast';
import { OnSuccessUpload, ResourceType, UploadButton } from '~/components/upload-button';
import { cn } from '~/lib/utils';
import { meta, paths } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';
import { parseARUploads } from '~/utils/parse-ar-uploads';
import { schemas } from '~/zod-schemas';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.organization(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

type AddUploadInputs = z.infer<typeof schemas.shared.ARUpload.create>;

export default function OrganizationPage() {
  const router = useRouter();
  const utils = api.useContext();
  const { toast } = useToast();

  const getOrganization = api.shared.organization.get.useQuery();
  const organization = getOrganization.data;

  const getSemester = api.shared.reportSemester.get.useQuery();
  const semester = getSemester.data;

  const getAR = api.shared.AR.getOrCreate.useQuery();
  const AR = getAR.data;

  const getUploads = api.shared.ARUpload.get.useQuery({ current: true });
  const uploads = getUploads.data;
  const sortedUploads = parseARUploads(uploads ?? []);

  const addCVForm = useForm<AddUploadInputs>({
    resolver: zodResolver(schemas.shared.ARUpload.create),
    defaultValues: { contentType: ARUploadContentType.CURRICULUM_VITAE_OF_OFFICERS },
  });

  const createARUpload = api.shared.ARUpload.create.useMutation({
    onSuccess: async ({ contentType }) => {
      toast({
        variant: 'c-primary',
        description: `✔️ ${contentType.replace(/_/g, ' ')} uploaded successfully.`,
      });
      addCVForm.reset(undefined, { keepDefaultValues: true });
      await utils.shared.ARUpload.invalidate();
    },
    onError: (_err, { contentType }) => {
      toast({
        variant: 'destructive',
        title: '❌ Internal Server Error',
        description: `Uploading of ${contentType.replace(/_/g, ' ')} failed.`,
      });
    },
  });

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
          className="mx-4 my-4 grid w-full grid-cols-4 grid-rows-6 flex-col gap-8 pb-24"
        >
          <div className=" col-span-2 row-span-2 flex flex-col items-center justify-between rounded-sm px-4 py-4">
            <div className="flex flex-col items-center gap-4">
              {organization?.imageId ? (
                <CldImage
                  width="100"
                  height="100"
                  src={`/${organization?.imageId}`}
                  alt="Organization Logo"
                  className=" me-1 h-20 w-20 rounded-full bg-green md:h-24 md:w-24 lg:h-36 lg:w-36"
                />
              ) : (
                <div className='className=" me-1 h-20 w-20 rounded-full bg-green md:h-24 md:w-24 lg:h-28 lg:w-28'></div>
              )}
              <div className="text-2xl font-bold">{organization?.name}</div>
            </div>
          </div>

          <div className="col-span-2 row-span-2 flex flex-col items-center justify-center gap-4 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="text-2xl font-bold">Setup your Signatory Information</div>
            <div className="text-center font-medium">
              Establish your organization by completing the required fields and providing necessary
              information as indicated.
            </div>
            <Link
              href={`${paths.ORGANIZATION}${paths.MY_ORGANIZATION}${paths.POSITIONS}`}
              className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
            >
              Setup Signatory Information
            </Link>
          </div>

          {semester ? (
            <>
              <div className="relative col-span-2 row-span-2 flex flex-col items-center justify-center gap-4 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
                <div className="text-2xl font-bold">PREAMBLE, MISSION, VISION, AND GOAL</div>
                <div className="text-center font-medium">
                  In the overview, present your preamble, articulate the mission statement of the
                  organization and describe the vision and goals
                </div>

                <SingleARUploadActions
                  contentType={ARUploadContentType.PREAMBLE_MISSION_VISION_AND_GOAL}
                  upload={sortedUploads.PREAMBLE_MISSION_VISION_AND_GOAL?.[0]}
                />
              </div>
              <div className="relative col-span-2 row-span-2 flex flex-col items-center justify-center gap-4 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
                <div className="text-2xl font-bold">ORGANIZATIONAL CHART</div>
                <div className="text-center font-medium">
                  llustrate the hierarchical structure of the organization
                </div>

                <SingleARUploadActions
                  contentType={ARUploadContentType.ORGANIZATIONAL_CHART}
                  upload={sortedUploads.ORGANIZATIONAL_CHART?.[0]}
                />
              </div>
              <div className="relative col-span-2 row-span-2 flex flex-col items-center justify-center gap-4 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
                <div className="text-2xl font-bold">CONSTITUTIONAL BY LAWS</div>
                <div className="text-center font-medium">
                  Provide or update the documented rules and regulations governing the organization
                </div>

                <SingleARUploadActions
                  contentType={ARUploadContentType.CONSTITUTION_AND_BY_LAWS}
                  upload={sortedUploads.CONSTITUTION_AND_BY_LAWS?.[0]}
                />
              </div>
              <div className="relative col-span-2 row-span-2 flex flex-col items-center justify-center gap-4 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
                <div className="text-2xl font-bold">
                  {ARUploadContentType.CURRICULUM_VITAE_OF_OFFICERS.replace(/_/g, ' ')}
                </div>
                <div className="text-center font-medium">
                  Upload the curriculum vitae of officers effortlessly with our straightforward
                  upload form.
                </div>

                <form
                  className="flex gap-2"
                  onSubmit={addCVForm.handleSubmit(
                    (values) => {
                      if (createARUpload.isLoading) return;

                      createARUpload.mutate({
                        ...values,
                        contentNumber:
                          (sortedUploads.CURRICULUM_VITAE_OF_OFFICERS ?? []).length + 1,
                      });
                    },
                    (err) => console.error(err)
                  )}
                >
                  <Input
                    placeholder="Title"
                    className="h-8"
                    disabled={
                      AR?.status === SemReportStatus.TURNED_IN ||
                      AR?.status === SemReportStatus.COMPLETED
                    }
                    {...addCVForm.register('title')}
                  />

                  <div className="flex flex-col justify-center gap-1">
                    <div className="flex items-center gap-2">
                      <TooltipProvider delayDuration={0} disableHoverableContent>
                        <Tooltip>
                          <UploadButton
                            className={cn(
                              buttonVariants({ variant: 'c-secondary', size: 'icon' }),
                              'h-8'
                            )}
                            folder="ar-uploads"
                            resourceType={ResourceType.PDF}
                            onSuccess={
                              ((result) => {
                                addCVForm.setValue('file', result.info?.secure_url ?? '');
                                addCVForm.setValue('fileId', result.info?.public_id ?? '');
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

                        <span>{addCVForm.watch('file') ? '✔️' : '❌'}</span>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="submit"
                              variant="c-primary"
                              size="icon"
                              className="h-8"
                              disabled={
                                AR?.status === SemReportStatus.TURNED_IN ||
                                AR?.status === SemReportStatus.COMPLETED
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>

                          <TooltipContent side="top">
                            <p>Add</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href={{
                                pathname: `${paths.ORGANIZATION}${paths.ACCOMPLISHMENT_REPORT}`,
                                hash: ARUploadContentType.CURRICULUM_VITAE_OF_OFFICERS,
                              }}
                              className={cn(
                                buttonVariants({ variant: 'outline', size: 'icon' }),
                                'h-8'
                              )}
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </TooltipTrigger>

                          <TooltipContent side="top">
                            <p>See All</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <p className="h-4 text-sm font-medium text-destructive">
                      {addCVForm.formState.errors.file?.message && 'File is required'}
                    </p>
                  </div>
                </form>

                <div
                  className={cn(
                    'absolute right-2 top-2 h-8 w-8 rounded-full',
                    (sortedUploads.CURRICULUM_VITAE_OF_OFFICERS ?? []).length > 0
                      ? 'bg-c-primary text-c-primary-foreground'
                      : 'bg-destructive text-destructive-foreground'
                  )}
                >
                  {(sortedUploads.CURRICULUM_VITAE_OF_OFFICERS ?? []).length > 0 ? (
                    <BadgeCheck className="h-8 w-8" />
                  ) : (
                    <BadgeAlert className="h-8 w-8" />
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="col-span-4 row-span-4 flex flex-col items-center justify-center gap-2">
              <AlertOctagon className="h-32 w-32 text-destructive" />
              <h1 className="text-center text-3xl text-destructive">
                There is no active semester for Accomplishment Report!
              </h1>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
