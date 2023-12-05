import { zodResolver } from '@hookform/resolvers/zod';
import { ReportStatus } from '@prisma/client';
import { type GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import { type z } from 'zod';
import NotificationAlert from '~/components/notification-alert';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
import PdfViewer from '~/components/pdf-viewer';
import { meta } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';
import { commentSchemas } from '~/zod-schemas/shared/comment';

type InputsComment = z.infer<typeof commentSchemas.createInReport>;

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.organization(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function UserOrgReportPage() {
  const router = useRouter();
  const utils = api.useContext();
  const { data: session } = useSession();

  const getReportQuery = api.shared.report.get.useQuery({
    id: router.query.id as string,
    includeComments: true,
  });
  const reportData = getReportQuery.data?.[0];

  const createCommentMutation = api.shared.comment.createInReport.useMutation({
    onSuccess: async () => {
      await utils.shared.report.get.invalidate({
        id: router.query.id as string,
        includeComments: true,
      });
    },
  });
  const createCommentForm = useForm<InputsComment>({
    resolver: zodResolver(commentSchemas.createInReport),
    values: { reportId: reportData?.id ?? '', content: '' },
  });

  const onSubmitComment: SubmitHandler<InputsComment> = async (values) => {
    await createCommentMutation.mutateAsync(values);
    toast.success('Commented Successfully!', {
      position: 'bottom-right',
    });
    createCommentForm.reset(undefined, { keepDefaultValues: true });
  };

  const scrollableContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom when the component mounts
    scrollToBottom();
  }, [reportData]); // You might want to include any other dependencies that affect the scrolling behavior

  const scrollToBottom = () => {
    if (scrollableContainerRef.current) {
      (scrollableContainerRef.current as HTMLDivElement).scrollTop = (
        scrollableContainerRef.current as HTMLDivElement
      ).scrollHeight;
    }
  };
  return (
    <>
      <Head>
        <title>{`My Report ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />
      <main className="flex">
        {/* SIDE BAR */}
        <OrganizationSideBarMenu />

        {/* MAIN CONTENT */}
        <div className="mx-3 my-4 flex  w-full flex-col md:flex-row">
          <div className="ms-1 min-h-[87vh] w-full rounded-t-3xl px-5 py-5 shadow-[0_1px_10px_0px_rgba(0,0,0,0.25)]   md:ms-5 md:w-3/4 md:rounded-3xl md:px-9 md:shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)]">
            <div className="flex justify-between">
              <h1 className="text-xl font-bold uppercase tracking-tight md:text-2xl lg:text-3xl">
                {reportData?.subject}
              </h1>
              {reportData?.status === ReportStatus.REJECTED ? (
                <h1 className='className="text-xl lg:text-3xl" font-bold tracking-tight text-red md:text-2xl'>
                  Rejected
                </h1>
              ) : reportData?.status === ReportStatus.APPROVED ? (
                <h1 className='className="text-xl lg:text-3xl" font-bold tracking-tight text-green md:text-2xl'>
                  Approved
                </h1>
              ) : (
                <h1 className='className="text-xl lg:text-3xl" font-bold tracking-tight text-yellow md:text-2xl'>
                  Pending
                </h1>
              )}
            </div>
            <div className="mt-7 flex justify-between text-xl font-medium">
              <h2>
                {reportData?.category
                  ? reportData?.category.charAt(0).toUpperCase() +
                    reportData?.category.slice(1).toLowerCase()
                  : ''}
              </h2>{' '}
              <h2 className="text-right">
                {reportData?.createdAt.toLocaleString('en-US', { timeZone: 'Asia/Manila' })}
              </h2>
            </div>
            <div className="mt-1 flex h-[50vh] w-full items-center justify-center border-[5px] border-green text-4xl">
              {reportData?.file ? <PdfViewer pdf={reportData?.file} /> : 'PDF'}
            </div>
            <div>
              <h2 className="mt-4 text-xl font-medium">Description:</h2>
              {reportData?.description}
            </div>
          </div>

          {/* COMMENTS */}
          <form
            className="relative mb-10  ms-1 min-h-[87vh]  w-full rounded-b-3xl py-5 shadow-[0_1px_10px_0px_rgba(0,0,0,0.25)] md:mb-0 md:ms-3  md:w-1/4 md:rounded-3xl md:shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)]"
            onSubmit={createCommentForm.handleSubmit(onSubmitComment, (error) =>
              console.log(error)
            )}
          >
            <h2 className=" mb-2 text-center text-2xl font-medium">Comments</h2>
            <div className="h-[40vh] overflow-y-auto scroll-smooth" ref={scrollableContainerRef}>
              {reportData?.comments.length ? (
                reportData?.comments.map((data) => (
                  <div
                    key={data.id}
                    id={data.id}
                    className={`${
                      session?.user.id === data.createdById ? 'text-right' : ''
                    } flex flex-col px-5`}
                  >
                    <div className="my-1 text-center text-xs font-light">
                      {data.createdAt.toLocaleString('en-US', { timeZone: 'Asia/Manila' })}
                    </div>
                    <div className="font-bold">
                      {data.organizationName} {data.createdByName}
                    </div>
                    <div
                      className={`${session?.user.id === data.createdById ? 'self-end' : ''} w-3/4`}
                    >
                      {data.content}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center px-5">
                  <div className="font-bold">There is no current comment.</div>
                </div>
              )}
            </div>
            {/* ADD A COMMENT */}
            <div className="mx-3 mt-6">
              <div className="h-[1px] bg-gray"></div>
              <textarea
                id="comment"
                rows={2}
                placeholder="Add a comment"
                className="mt-2 w-full border-[1px] border-green px-3 py-1 text-lg outline-none"
                {...createCommentForm.register('content')}
              ></textarea>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`${
                    createCommentForm.watch('content') ? 'bg-yellow' : 'bg-yellow/50 text-black/50'
                  } mt-2 rounded-md  px-4 py-2 text-lg font-medium`}
                  disabled={!createCommentForm.watch('content')}
                >
                  Comment
                </button>
              </div>
              <div className="mt-2 h-[1px] bg-gray"></div>
            </div>
          </form>
        </div>
      </main>
      <NotificationAlert />
    </>
  );
}
