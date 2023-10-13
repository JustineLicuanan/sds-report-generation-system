import Head from 'next/head';
import NavBar from '~/components/navigation-bar';
import SideBarMenu from '~/components/side-bar-menu';

export default function MyRequest() {
  return (
    <>
      <Head>
        <title>SD Services MIS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* NAVIGATION BAR */}
      <NavBar showNotificationButton={true} />
      <main className="flex">
        {/* SIDE BAR */}
        <SideBarMenu />

        {/* MAIN CONTENT */}
        <div className="mx-3 mt-4 flex h-[87vh] w-full">
          <div className="ms-5 h-[87vh] w-3/4  rounded-3xl px-5 py-5 shadow-[0_4px_25px_0px_rgba(0,0,0,0.25)] md:px-9">
            <h1 className="text-xl font-bold tracking-tight md:text-2xl lg:text-3xl">My Request</h1>

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
          <div className="relative ms-3 h-[87vh] w-1/4  rounded-3xl py-5 shadow-[0_4px_25px_0px_rgba(0,0,0,0.25)]">
            <h2 className=" mb-5 text-center text-2xl font-medium">Comments</h2>
            <div className="flex flex-col px-5">
              <div className="my-1 text-center text-xs font-light">10:50 pm</div>
              <div className="font-bold">Admin</div>
              <div className="w-3/4">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, expedita!
              </div>
            </div>
            <div className="flex flex-col px-5 text-right">
              <div className="my-1 text-center text-xs font-light">10:51 pm</div>
              <div className="font-bold">You</div>
              <div className="w-3/4 self-end ">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis enim vitae sed!
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
                rows="2"
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
                className="me-2 rounded-md bg-[#f7b205] px-4 py-2 text-lg font-medium"
              >
                Edit Request
              </button>
              <button
                type="button"
                className="hidden rounded-md bg-[#f7b205] px-4 py-2 text-lg font-medium"
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
