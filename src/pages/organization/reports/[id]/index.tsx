import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
import PdfViewer from '~/components/pdf-viewer';
import { meta } from '~/meta';
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

export default function UserOrgReportPage() {
  const adminComment = [
    {
      time: '10:50 pm',
      comment: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis enim vitae sed!',
    },
    {
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

  const [comment, setComment] = useState(''); // Comment box
  const [currentComment, setCurrentComment] = useState(myComment); // Comment data
  const [commentButton, setCommentButton] = useState(false);

  const [showRejectModal, setShowRejectModal] = useState(false);
  // Smooth Scrolling when adding a comment.
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [currentComment]);

  const goBack = () => {
    window.history.back();
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
              <h1 className="text-xl font-bold tracking-tight md:text-2xl lg:text-3xl">
                My report - {'Report Category'}
              </h1>
              {/* {rejected ? (
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
              )} */}
            </div>
            <div className="mt-7 flex justify-between text-xl font-medium">
              <h2>[Subject]</h2> <h2 className="text-right">[Date]</h2>
            </div>
            <div className="mt-1 flex h-[50vh] w-full items-center justify-center border-[5px] border-green text-4xl">
              <PdfViewer />
            </div>
            <div>
              <h2 className="mt-4 text-xl font-medium">Message:</h2>
              Lorem ipsum sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem
              ipsum sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
          </div>

          {/* COMMENTS */}
          <div className="relative mb-10  ms-1 min-h-[87vh]  w-full rounded-b-3xl py-5 shadow-[0_1px_10px_0px_rgba(0,0,0,0.25)] md:mb-0 md:ms-3  md:w-1/4 md:rounded-3xl md:shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)]">
            <h2 className=" mb-2 text-center text-2xl font-medium">Comments</h2>
            <div className="h-[55%] overflow-y-auto scroll-smooth" ref={containerRef}>
              {adminComment.map((data, index) => (
                <div key={index} className="flex flex-col px-5">
                  <div className="my-1 text-center text-xs font-light">{data.time}</div>
                  <div className="font-bold">Admin</div>
                  <div className="w-3/4">{data.comment}</div>
                </div>
              ))}
              {currentComment.map((data, index) => (
                <div key={index} className="flex flex-col px-5 text-right">
                  <div className="my-1 text-center text-xs font-light">{data.time}</div>
                  <div className="font-bold">You</div>
                  <div className="w-3/4 self-end ">{data.comment}</div>
                </div>
              ))}
            </div>
            {/* ADD A COMMENT */}
            <div className="mx-3 mt-6">
              <div className="h-[1px] bg-gray"></div>
              <textarea
                name="comment"
                id="comment"
                rows={2}
                placeholder="Add a comment"
                className="mt-2 w-full border-[1px] border-green px-3 py-1 text-lg outline-none"
                onChange={(e) => {
                  setComment(e.target.value);
                  comment ? setCommentButton(true) : setCommentButton(false);
                }}
                value={comment}
              ></textarea>
              <div className="flex justify-end">
                <button
                  type="button"
                  className={`${
                    comment ? 'bg-yellow' : 'bg-yellow/50 text-black/50'
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
                  disabled={!commentButton}
                >
                  Comment
                </button>
              </div>
              <div className="mt-2 h-[1px] bg-gray"></div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
