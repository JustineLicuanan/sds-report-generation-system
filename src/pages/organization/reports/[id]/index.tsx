import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import NavBar from '~/components/navigation-bar';
import SideBarMenu from '~/components/side-bar-menu';
import { meta } from '~/meta';

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
        <title>{`My Report ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <NavBar showNotificationButton={true} />
      <main className="flex">
        {/* SIDE BAR */}
        <SideBarMenu />

        {/* MAIN CONTENT */}
        <div className="mx-3 mt-4 flex  w-full flex-col md:flex-row">
          <div className="ms-1 h-[87vh] w-full rounded-t-3xl px-5 py-5 shadow-[0_1px_10px_0px_rgba(0,0,0,0.25)]   md:ms-5 md:w-3/4 md:rounded-3xl md:px-9 md:shadow-[0_4px_25px_0px_rgba(0,0,0,0.25)]">
            <h1 className="text-xl font-bold tracking-tight md:text-2xl lg:text-3xl">My Report</h1>

            <div className="mt-7 flex justify-between text-xl font-medium">
              <h2>[Subject]</h2> <h2 className="text-right">[Date]</h2>
            </div>
            <div className="mt-1 flex h-[50vh] w-full items-center justify-center border-[5px] border-[#2A9134] text-4xl">
              PDF
            </div>
            <div>
              <h2 className="mt-4 text-xl font-medium">Message:</h2>
              Lorem ipsum sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem
              ipsum sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
          </div>

          {/* COMMENTS */}
          <div className="relative mb-10  ms-1 h-[87vh]  w-full rounded-b-3xl py-5 shadow-[0_1px_10px_0px_rgba(0,0,0,0.25)] md:mb-0 md:ms-3  md:w-1/4 md:rounded-3xl md:shadow-[0_4px_25px_0px_rgba(0,0,0,0.25)]">
            <h2 className=" mb-2 text-center text-2xl font-medium">Comments</h2>
            <div className="h-[55%] overflow-y-auto scroll-smooth" ref={containerRef}>
              {adminComment.map((data,index) => (
                <div key={index} className="flex flex-col px-5">
                  <div className="my-1 text-center text-xs font-light">{data.time}</div>
                  <div className="font-bold">Admin</div>
                  <div className="w-3/4">{data.comment}</div>
                </div>
              ))}
              {currentComment.map((data,index) => (
                <div key={index} className="flex flex-col px-5 text-right">
                  <div className="my-1 text-center text-xs font-light">{data.time}</div>
                  <div className="font-bold">You</div>
                  <div className="w-3/4 self-end ">{data.comment}</div>
                </div>
              ))}
            </div>
            {/* ADD A COMMENT */}
            <div className="mx-3 mt-6">
              <div className="h-[1px] bg-[#D9D9D9]"></div>
              <textarea
                name="comment"
                id="comment"
                rows={2}
                placeholder="Add a comment"
                className="mt-2 w-full border-[1px] border-[#2A9134] px-3 py-1 text-lg outline-none"
                onChange={(e) => {
                  setComment(e.target.value);
                  comment ? setCommentButton(true) : setCommentButton(false);
                }}
                value={comment}
              ></textarea>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mt-2 rounded-md bg-[#f7b205] px-4 py-2 text-lg font-medium"
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
              <div className="mt-2 h-[1px] bg-[#D9D9D9]"></div>
            </div>
            <div className="absolute bottom-4 right-3">
              <button
                type="button"
                className="me-2 rounded-md bg-[#DC3545] px-4 py-2 text-lg font-medium"
              >
                Reject
              </button>
              <button
                type="button"
                className="rounded-md bg-[#f7b205] px-4 py-2 text-lg font-medium"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
