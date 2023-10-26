import Head from 'next/head';
import NavBar from '~/components/navigation-bar';
import SideBarMenu from '~/components/side-bar-menu';
import { meta } from '~/meta';

export default function UserOrgReportPage() {
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
            <div className="h-[55%] overflow-y-auto">
              <div className="flex flex-col px-5">
                <div className="my-1 text-center text-xs font-light">10:50 pm</div>
                <div className="font-bold">Organization Name</div>
                <div className="w-3/4">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, expedita!
                </div>
              </div>
              <div className="flex flex-col px-5">
                <div className="my-1 text-center text-xs font-light">10:50 pm</div>
                <div className="font-bold">Organization Name</div>
                <div className="w-3/4">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi, rem?
                </div>
              </div>
              <div className="flex flex-col px-5">
                <div className="my-1 text-center text-xs font-light">10:50 pm</div>
                <div className="font-bold">Organization Name</div>
                <div className="w-3/4">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                </div>
              </div>
              <div className="flex flex-col px-5 text-right">
                <div className="my-1 text-center text-xs font-light">10:51 pm</div>
                <div className="font-bold">You</div>
                <div className="w-3/4 self-end ">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis enim vitae sed!
                </div>
              </div>
            </div>
            {/* ADD A COMMENT */}
            <div className="mx-3 mt-6">
              <div className="h-[1px] bg-[#D9D9D9]"></div>
              {/* <input
                type="text"
                placeholder="Add a comment"
                className="mt-2 h-14 w-3/4 border-[1px] border-[#2A9134] px-3 py-1 text-lg outline-none"
              /> */}

              <textarea
                name="comment"
                id="comment"
                rows={2}
                placeholder="Add a comment"
                className="mt-2 w-full border-[1px] border-[#2A9134] px-3 py-1 text-lg outline-none"
              ></textarea>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mt-2 rounded-md bg-[#f7b205] px-4 py-2 text-lg font-medium"
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
