import { zodResolver } from '@hookform/resolvers/zod';
import { ReportCategory, ReportStatus, ReportVisibility } from '@prisma/client';
import { type GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { type z } from 'zod';
import AdminNavBar from '~/components/admin-navigation-bar';
import AdminSideBarMenu from '~/components/admin-side-bar-menu';
import PdfViewer from '~/components/pdf-viewer';
import { meta } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';
import { commentSchemas } from '~/zod-schemas/admin/comment';

type CommentInputs = z.infer<typeof commentSchemas.createInReport>;

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.admin(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function AdminOrgReportPage() {
  const router = useRouter();
  const utils = api.useContext();
  const { data: session } = useSession();

  const getReportQuery = api.admin.report.get.useQuery({
    id: router.query.id as string,
    includeComments: true,
    includeOrganization: true,
  });
  const reportData = getReportQuery.data?.[0];

  const createCommentMutation = api.admin.comment.createInReport.useMutation({
    onSuccess: async () => {
      await utils.admin.report.get.invalidate({
        id: router.query.id as string,
        includeComments: true,
        includeOrganization: true,
      });
    },
  });

  const createCommentForm = useForm<CommentInputs>({
    resolver: zodResolver(commentSchemas.createInReport),
    values: {
      reportId: reportData?.id ?? '',
      content: '',
      notificationData: {
        organizationId: reportData?.organizationId ?? '',
        reportVisibility: reportData?.visibility ?? ReportVisibility.PRIVATE,
        userId: reportData?.createdById ?? '',
      },
    },
  });

  const updateReportStatusMutation = api.admin.report.updateStatus.useMutation({
    onSuccess: async () => {
      await utils.admin.report.get.invalidate({
        id: router.query.id as string,
        includeComments: true,
        includeOrganization: true,
      });
    },
  });

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejected, setRejected] = useState(false);

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [scheduleAppointment, setScheduleAppointment] = useState(false);

  const onSubmitComment: SubmitHandler<CommentInputs> = async (values) => {
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

  const [due, setDue] = useState<string | undefined>('');
  const updateReportStatus = async (status: ReportStatus) => {
    await updateReportStatusMutation.mutateAsync({
      id: reportData?.id ?? '',
      logData: {
        category: reportData?.category ?? ReportCategory.OTHER,
        name: reportData?.organization.name ?? '',
        subject: reportData?.subject ?? '',
      },
      notificationData: {
        organizationId: reportData?.organizationId ?? '',
        userId: reportData?.createdById ?? '',
      },
      status,
      due: due ? new Date(due).toISOString() : undefined,
    });

    toast.success(`Report ${ReportStatus.APPROVED.toLowerCase()} successfully!`, {
      position: 'bottom-right',
    });
  };

  const statusIsNotPending =
    reportData?.status === ReportStatus.REJECTED || reportData?.status === ReportStatus.APPROVED;
  return (
    <>
      <Head>
        <title>{`Organization Report ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <AdminNavBar />
      <main className="flex">
        {/* SIDE BAR */}
        <AdminSideBarMenu />

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
                {reportData?.category.charAt(0).toUpperCase() ??
                  '' + reportData?.category.slice(1).toLowerCase() ??
                  ''}
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
            onSubmit={createCommentForm.handleSubmit(onSubmitComment, (error) => {
              console.log(error);
            })}
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

            <div className="absolute bottom-4 right-3">
              <button
                type="button"
                onClick={() => setShowRejectModal(!showRejectModal)}
                className={`${
                  statusIsNotPending ? 'opacity-50' : ''
                } me-2 rounded-md bg-red px-4  py-2 text-lg font-medium text-white`}
                disabled={statusIsNotPending}
              >
                Reject
              </button>
              <button
                type="button"
                className={`${
                  statusIsNotPending ? 'opacity-50' : ''
                } rounded-md bg-yellow px-4 py-2 text-lg font-medium`}
                disabled={statusIsNotPending}
                onClick={() => setShowApproveModal(!showApproveModal)}
              >
                Approve
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* REJECTED MODAL */}
      <div
        className={`fixed left-0 top-0 z-[999] flex h-full w-full items-center justify-center  bg-black/[.50] px-4 transition-opacity duration-300 ease-in-out ${
          showRejectModal ? '' : 'invisible opacity-0'
        }`}
      >
        <div className="relative h-[200px] w-[350px]  rounded-3xl bg-white shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)]">
          <h1 className="py-3 text-center text-3xl font-bold tracking-tight">Reject</h1>
          <div className="h-[1px] w-full bg-black "></div>
          <div className="flex items-center justify-around p-2">
            <Image src="/danger_icon.png" width={50} height={50} alt="Danger Icon" className="" />
            <div className="py-3 text-center text-2xl font-medium">
              Are you sure you want to <span className="text-2xl font-bold text-red">reject</span>?
            </div>
          </div>
          <div className="absolute bottom-3 left-7">
            <button
              type="button"
              onClick={() => setShowRejectModal(!showRejectModal)}
              className="rounded-md bg-gray px-8 py-2 text-lg font-medium"
            >
              Cancel
            </button>
          </div>
          <div className="absolute bottom-3 right-7">
            <button
              type="button"
              onClick={async () => {
                await updateReportStatus(ReportStatus.REJECTED);
                setShowRejectModal(!showRejectModal);
                setRejected(!rejected);
                toast.success('Report rejected successfully!');
              }}
              className="rounded-md bg-red px-8 py-2 text-lg font-medium text-white"
            >
              Reject
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed left-0 top-0 z-[999] flex h-full w-full items-center justify-center  bg-black/[.50] px-4 transition-opacity duration-300 ease-in-out ${
          showApproveModal ? '' : 'invisible opacity-0'
        }`}
      >
        <div className="relative h-[200px] w-[350px]  rounded-3xl bg-white shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)]">
          <h1 className="py-3 text-center text-3xl font-bold tracking-tight">Approve</h1>
          <div className="h-[1px] w-full bg-black "></div>
          <div className="flex items-center justify-around p-2">
            <Image
              src="/information_icon.svg"
              width={50}
              height={50}
              alt="Information Icon"
              className=""
            />
            <div className="py-3 text-center text-2xl font-medium">
              Are you sure you want to{' '}
              <span className="text-2xl font-bold text-green">Approve</span>?
            </div>
          </div>
          <div className="absolute bottom-3 left-7">
            <button
              type="button"
              onClick={() => setShowApproveModal(!showApproveModal)}
              className="rounded-md bg-gray px-8 py-2 text-lg font-medium"
            >
              Cancel
            </button>
          </div>
          <div className="absolute bottom-3 right-7">
            <button
              type="button"
              onClick={async () => {
                if (reportData?.hasSchedule) {
                  setShowApproveModal(!showApproveModal);
                  setScheduleAppointment(!scheduleAppointment);
                  return;
                }

                await updateReportStatus(ReportStatus.APPROVED);
                setShowApproveModal(!showApproveModal);
              }}
              className="rounded-md bg-green px-8 py-2 text-lg font-medium text-white"
            >
              Approve
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed left-0 top-0 z-[999] flex h-full w-full items-center justify-center  bg-black/[.50] px-4 transition-opacity duration-300 ease-in-out ${
          scheduleAppointment ? '' : 'invisible opacity-0'
        }`}
      >
        <div className="relative h-[200px] w-[350px]  rounded-3xl bg-white shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)]">
          <h1 className="py-3 text-center text-3xl font-bold tracking-tight">Appointment</h1>
          <div className="h-[1px] w-full bg-black "></div>
          <div className="flex flex-col items-center justify-around p-2">
            <label htmlFor="schedule-report" className="py-3 text-xl font-medium">
              Set the schedule of this report for{' '}
              <span className="text-xl font-bold text-green">signing.</span>
            </label>
            <input
              type="datetime-local"
              id="schedule-report"
              className="mb-2 mt-1 h-9 border-[1px] border-green px-2  py-1 text-lg outline-none"
              onChange={(e) => setDue(e.target.value)}
              value={due}
            />
          </div>
          <div className="absolute bottom-3 left-7">
            <button
              type="button"
              onClick={() => setScheduleAppointment(!scheduleAppointment)}
              className="rounded-md bg-gray px-8 py-2 text-lg font-medium"
            >
              Cancel
            </button>
          </div>
          <div className="absolute bottom-3 right-7">
            <button
              type="button"
              className="rounded-md bg-green px-8 py-2 text-lg font-medium text-white"
              onClick={async () => {
                await updateReportStatus(ReportStatus.APPROVED);
                setScheduleAppointment(!scheduleAppointment);
                console.log(due)
              }}
            >
              Set
            </button>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}
