import { zodResolver } from '@hookform/resolvers/zod';
import { ReportCategory, ReportVisibility } from '@prisma/client';
import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { type z } from 'zod';
import NotificationAlert from '~/components/notification-alert';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
import PdfViewer from '~/components/pdf-viewer';
import { useToast } from '~/components/ui/use-toast';
import { ResourceType, UploadButton, type OnSuccessUpload } from '~/components/upload-button';
import { meta, paths } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';
import { reportSchemas } from '~/zod-schemas/shared/report';

type InputsReport = z.infer<typeof reportSchemas.create>;

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.organization(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function CreateReportPage() {
  const router = useRouter();
  const utils = api.useContext();
  const { toast } = useToast();
  const createReportMutation = api.shared.report.create.useMutation({
    onSuccess: async ({ id }) => {
      toast({ variant: 'c-primary', description: '✔️ Created report successfully.' });
      await utils.shared.report.invalidate();
      await router.push(`${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}/${id}`);
    },
  });
  const createReportForm = useForm<InputsReport>({ resolver: zodResolver(reportSchemas.create) });

  const getAnnouncementQuery = api.shared.announcement.get.useQuery({
    id: (router.query.announcementId ?? '') as string,
  });

  const onSubmitReport: SubmitHandler<InputsReport> = async (values) => {
    await createReportMutation.mutateAsync(values);
  };

  const onSuccessUpload: OnSuccessUpload = (result) => {
    createReportForm.setValue('file', result.info?.secure_url);
    createReportForm.setValue('fileId', result.info?.public_id);
  };
  console.log(getAnnouncementQuery.data);
  return (
    <>
      <Head>
        <title>{`Create Report ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />
      <main className="flex">
        {/* SIDE BAR */}
        <OrganizationSideBarMenu />

        {/* MAIN CONTENT */}

        <div className="mx-3 mt-4 w-full ">
          <form
            className="mx-auto my-0 flex min-h-[87vh] max-w-5xl flex-col rounded-3xl px-5 py-5 shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)] md:px-9"
            onSubmit={createReportForm.handleSubmit(onSubmitReport, (error) => console.log(error))}
          >
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
              Create New Report
            </h1>
            <label htmlFor="subject" className="mt-3 text-xl font-bold">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              className=" mt-1 h-8 w-2/5 border-[1px] border-green px-2  py-1 outline-none"
              {...createReportForm.register('subject')}
            />
            <label htmlFor="category" className="mt-1 text-xl font-bold">
              Category
            </label>
            <select
              id="category"
              className="mt-1 h-9 w-2/5 border-[1px] border-green px-2  py-1 text-lg outline-none"
              {...createReportForm.register('category')}
            >
              <option value="">Select a category</option>
              {Object.values(ReportCategory).map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <label htmlFor="category" className="mt-1 text-xl font-bold">
              Link to Announcement
            </label>
            {router.query.announcementId ? (
              <select
                id=""
                className="mt-1 h-9 w-2/5 border-[1px] border-green px-2  py-1 text-lg outline-none"
                {...createReportForm.register('announcementId')}
              >
                {getAnnouncementQuery.data
                  ?.filter((announcement) => announcement.id)
                  .map((announcement) => (
                    <option key={announcement.id} value={announcement.id}>
                      {announcement.subject}
                    </option>
                  ))}
              </select>
            ) : (
              <select
                id=""
                className="mt-1 h-9 w-2/5 border-[1px] border-green px-2  py-1 text-lg outline-none"
                {...createReportForm.register('announcementId')}
              >
                <option value="not applicable">N/A</option>
                {getAnnouncementQuery.data?.map((announcement) => (
                  <option key={announcement.id} value={announcement.id}>
                    {announcement.subject}
                  </option>
                ))}
              </select>
            )}
            <label htmlFor="visibility" className="mt-1 text-xl font-bold">
              Visibility
            </label>
            <select
              id="visibility"
              className="mt-1 h-9 w-2/5 border-[1px] border-green px-2  py-1 text-lg outline-none"
              {...createReportForm.register('visibility')}
            >
              <option value="">Select a visibility</option>
              {Object.values(ReportVisibility).map((visibility, index) => (
                <option key={index} value={visibility}>
                  {visibility}
                </option>
              ))}
            </select>
            <div className="mt-2  flex h-[400px] w-full  items-center justify-center border-[5px] border-green py-3 text-4xl font-medium">
              {createReportForm.watch('file') ? (
                <PdfViewer pdf={createReportForm.watch('file')!} />
              ) : (
                'PDF'
              )}
            </div>
            <UploadButton
              className="my-3 cursor-pointer rounded-md  bg-yellow px-8 py-2 text-lg font-medium"
              folder="report-files"
              resourceType={ResourceType.PDF}
              onSuccess={onSuccessUpload}
            >
              Upload
            </UploadButton>
            <textarea
              id="report-description"
              className=" mt-2 w-full border-[1px] border-green px-2 text-lg outline-none"
              rows={2}
              placeholder="Description"
              {...createReportForm.register('description')}
            ></textarea>
            <div className="my-3 flex w-fit items-center gap-2">
              <label className="hover:cursor-pointer">
                <input
                  className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-yellow checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-yellow checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-yellow checked:focus:bg-yellow checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-yellow dark:checked:after:bg-yellow dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                  type="checkbox"
                  role="switch"
                  {...createReportForm.register('hasSchedule')}
                />
                Appointment
              </label>
              <div className="group relative">
                <div className="h-5 w-5 rounded-full border bg-gray text-center text-sm font-bold">
                  ?
                </div>
                <div className="absolute left-0 hidden whitespace-nowrap rounded-md bg-gray px-2 py-1 text-sm font-medium group-hover:block">
                  If this is report is need an appointment, enable this.
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="mt-2 rounded-md bg-yellow px-4 py-1 text-lg font-medium"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </main>
      <NotificationAlert />
    </>
  );
}
