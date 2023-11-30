import { type GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import AdminNavBar from '~/components/admin-navigation-bar';
import AdminSideBarMenu from '~/components/admin-side-bar-menu';
import PdfViewer from '~/components/pdf-viewer';
import { meta } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.admin(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function AdminOrgReportPage() {
  const orgComment = [
    {
      id: 1,
      time: '10:50 pm',
      comment: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis enim vitae sed!',
    },
    {
      id: 2,
      time: '10:52 pm',
      comment: 'Lorem ipsum dolor sit amet consectetur Corporis enim vitae sed!',
    },
  ];

  const myComment = [
    {
      time: '10:55 pm',
      comment: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis enim vitae sed!',
    },
    {
      time: '10:58 pm',
      comment: 'Lorem ipsum dolor sit amet.',
    },
  ];

  const { data: session } = useSession();

  const router = useRouter();
  const getReportQuery = api.shared.report.get.useQuery({
    id: router.query.id as string,
    includeComments: true,
  });
  const reportData = getReportQuery.data?.[0];

  const { organizationName, categoryName } = router.query;

  const [comment, setComment] = useState(''); // Comment box
  const [currentComment, setCurrentComment] = useState(myComment); // Comment data
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [rejectAlert, setRejectAlert] = useState(false);

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveAlert, setApproveAlert] = useState(false);

  const [scheduleAppointment, setScheduleAppointment] = useState(false);
  const [appointmentAlert, setAppointmentAlert] = useState(false);

  // Smooth Scrolling when adding a comment.
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [currentComment]);
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
              <h1 className="text-xl font-bold tracking-tight md:text-2xl lg:text-3xl">
                {organizationName ?? 'Org'} - {categoryName ?? 'Report Category'}
              </h1>
              {rejected ? (
                <h1 className='className="text-xl lg:text-3xl" font-bold tracking-tight text-red md:text-2xl'>
                  Rejected
                </h1>
              ) : approveAlert ? (
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
              <h2>[Subject]</h2> <h2 className="text-right">[Date]</h2>
            </div>
            <div className="mt-1 flex h-[50vh] w-full items-center justify-center border-[5px] border-green text-4xl">
              {reportData?.file ? <PdfViewer pdf={reportData?.file} /> : '.PDF'}
            </div>``
            <div>
              <h2 className="mt-4 text-xl font-medium">Description:</h2>
              Lorem ipsum sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem
              ipsum sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
          </div>

          {/* COMMENTS */}
          <div className="relative mb-10 ms-1 min-h-[87vh]  w-full rounded-b-3xl py-5 shadow-[0_1px_10px_0px_rgba(0,0,0,0.25)] md:mb-0 md:ms-3  md:w-1/4 md:rounded-3xl md:shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)]">
            <h2 className=" mb-2 text-center text-2xl font-medium">Comments</h2>
            <div className="h-[40vh] overflow-y-auto scroll-smooth" ref={containerRef}>
              {reportData?.comments.map((data, index) => (
                <div
                  key={index}
                  className={`${
                    session?.user.id === data.createdById ? 'text-right' : ''
                  } flex flex-col px-5`}
                >
                  <div className="my-1 text-center text-xs font-light">
                    {data.createdAt.toString()}
                  </div>
                  <div className="font-bold">
                    {data.createdByName} {}
                  </div>
                  <div
                    className={`${session?.user.id === data.createdById ? 'self-end' : ''} w-3/4`}
                  >
                    {data.content}
                  </div>
                </div>
              ))}
            </div>
            {/* ADD A COMMENT */}
            <div className="mx-3 mt-6">
              <div className="h-[1px] bg-[#9b8888]"></div>
              {/* <input
                type="text"
                placeholder="Add a comment"
                className="mt-2 h-14 w-3/4 border-[1px] border-green px-3 py-1 text-lg outline-none"
              /> */}

              <textarea
                name="comment"
                id="comment"
                rows={2}
                placeholder="Add a comment"
                className="mt-2 w-full border-[1px] border-green px-3 py-1 text-lg outline-none"
                onChange={(e) => setComment(e.target.value)}
                value={comment}
              ></textarea>
              <div className="flex justify-end">
                <button
                  type="button"
                  className={`${
                    comment ? 'bg-yellow' : 'cursor-not-allowed bg-yellow/50 text-black/50'
                  } mt-2 rounded-md  px-4 py-2 text-lg font-medium`}
                  onClick={() => {
                    if (!comment) {
                    } else {
                      setCurrentComment((currentComment) => {
                        return [...currentComment, { time: '11:00 pm', comment: comment }];
                      });
                      setComment('');
                    }
                  }}
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
                  rejected || approveAlert
                    ? 'cursor-not-allowed bg-red/50 text-white/50'
                    : 'bg-red text-white'
                } me-2 rounded-md  px-4 py-2 text-lg font-medium `}
                disabled={rejected || approveAlert}
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => setShowApproveModal(!showApproveModal)}
                className={`${
                  rejected || approveAlert
                    ? 'cursor-not-allowed bg-yellow/50 text-black/50'
                    : 'bg-yellow '
                } rounded-md px-4 py-2 text-lg font-medium`}
                disabled={rejected || approveAlert}
              >
                Approve
              </button>
            </div>
          </div>
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
              onClick={() => {
                setShowRejectModal(!showRejectModal);
                setRejected(!rejected);
                setRejectAlert(!rejectAlert);
              }}
              className="rounded-md bg-red px-8 py-2 text-lg font-medium text-white"
            >
              Reject
            </button>
          </div>
        </div>
      </div>

      {rejectAlert && (
        <div
          id="alert-3"
          className="fixed bottom-[5%] left-[2%] z-[101] mb-4 flex items-center rounded-lg bg-blue-50 p-4 text-blue-800 shadow-[5px_5px_10px_0px_rgba(94,94,94,1)]"
          role="alert"
        >
          <svg
            className="h-4 w-4 flex-shrink-0"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div className="ml-3 text-sm font-medium">The report has been rejected.</div>
          <button
            type="button"
            className="bg-green-50 text-green-500 hover:bg-green-200 focus:ring-green-400 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700 -mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg p-1.5 focus:ring-2"
            data-dismiss-target="#alert-3"
            aria-label="Close"
            onClick={() => setRejectAlert(!rejectAlert)}
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-3 w-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
      )}

      {/* APPROVED MODAL */}
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
              onClick={() => {
                setShowApproveModal(!showApproveModal);
                setApproveAlert(!approveAlert);
                setScheduleAppointment(!scheduleAppointment);
              }}
              className="rounded-md bg-green px-8 py-2 text-lg font-medium text-white"
            >
              Approve
            </button>
          </div>
        </div>
      </div>

      {/* {approveAlert && (
        <div
          id="alert-3"
          className="absolute bottom-[5%] left-[2%] z-[101] mb-4 flex items-center rounded-lg bg-blue-50 p-4 text-blue-800 shadow-[5px_5px_10px_0px_rgba(94,94,94,1)]"
          role="alert"
        >
          <svg
            className="h-4 w-4 flex-shrink-0"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div className="ml-3 text-sm font-medium">The report has been aprroved.</div>
          <button
            type="button"
            className="bg-green-50 text-green-500 hover:bg-green-200 focus:ring-green-400 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700 -mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg p-1.5 focus:ring-2"
            data-dismiss-target="#alert-3"
            aria-label="Close"
            onClick={() => setApproveAlert(false)}
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-3 w-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
      )} */}

      {/* Set Schedule */}
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
              type="date"
              name=""
              id="schedule-report"
              className="mb-2 mt-1 h-9 border-[1px] border-green px-2  py-1 text-lg outline-none"
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
              onClick={() => {
                setScheduleAppointment(!scheduleAppointment);
                setAppointmentAlert(!appointmentAlert);
              }}
              className="rounded-md bg-green px-8 py-2 text-lg font-medium text-white"
            >
              Set
            </button>
          </div>
        </div>
      </div>

      {appointmentAlert && (
        <div
          id="alert-3"
          className="absolute bottom-[5%] left-[2%] z-[101] mb-4 flex items-center rounded-lg bg-blue-50 p-4 text-blue-800 shadow-[5px_5px_10px_0px_rgba(94,94,94,1)]"
          role="alert"
        >
          <svg
            className="h-4 w-4 flex-shrink-0"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div className="ml-3 text-sm font-medium">Set date successfully</div>
          <button
            type="button"
            className="bg-green-50 text-green-500 hover:bg-green-200 focus:ring-green-400 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700 -mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg p-1.5 focus:ring-2"
            data-dismiss-target="#alert-3"
            aria-label="Close"
            onClick={() => setAppointmentAlert(!appointmentAlert)}
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-3 w-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
