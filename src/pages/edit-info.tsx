import Head from 'next/head';
import NavBar from '~/components/navigation-bar';
import SideBarMenu from '~/components/side-bar-menu';

export default function EditInfo() {
  return (
    <>
      {/* HEADER */}
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

        <div className="mx-3 mt-4 h-[87vh] w-full ">
          <div className="relative mx-auto my-0 flex h-[87vh] max-w-5xl flex-col rounded-3xl px-9 py-5 shadow-[0_4px_25px_0px_rgba(0,0,0,0.25)]">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">Edit Info</h1>

            {/* ORGANIZATION'S LOGO */}
            <div className="mt-2">
              <h2 className="mb-2 text-xl font-medium">Logo</h2>
              <img
                src="default_logo.png"
                alt="Organization's Logo"
                className=":w-28 mb-3 me-1  flex h-28 rounded-full bg-[#2A9134]"
              />
            </div>

            {/* ORGANIZATION NAME */}
            <label htmlFor="email-address" className=" text-lg font-medium">
              Organization Name
            </label>
            <input
              type="text"
              name="email-address"
              id="email-address"
              className=" mt-1 h-8 w-2/4 border-[1px] border-[#2A9134] px-2  py-1 outline-none"
            />

            {/* CATEGORY */}
            <label htmlFor="email-address" className="mt-1 text-lg font-medium">
              Category
            </label>
            <select
              name="sort-date"
              id="sort-date"
              className="me-2 h-8 w-1/4 border-[1px] border-[#2A9134] bg-white px-2 py-1  "
            >
              <option selected value="" disabled className="text-sm ">
                Select a category
              </option>
              <option value="" className="text-sm ">
                Student Governing Body
              </option>
              <option value="" className="text-sm ">
                Academic Organization
              </option>
              <option value="" className="text-sm">
                Non-Academic Organization
              </option>
            </select>

            {/* NOTE */}
            <div className="text-sn mb-1 mt-2 w-2/4 font-bold">
              NOTE:{'   '}
              <span className="text-sm font-normal">
                Please provide the existing CVSU email address that you would like to grant
                permission to.
              </span>
            </div>

            {/* EMAIL */}
            <label htmlFor="email-address" className=" text-lg font-medium">
              Email
            </label>
            <input
              type="text"
              name="email-address"
              id="email-address"
              className=" mt-1 h-8 w-2/4 border-[1px] border-[#2A9134] px-2  py-1 outline-none"
            />

            <label htmlFor="email-address" className="mt-1 text-lg font-medium">
              Description
            </label>
            <div className="flex w-3/5 flex-col">
              <textarea
                type="text"
                name="email-address"
                id="email-address"
                className=" mt-1   border-[1px] border-[#2A9134] px-2  py-1 outline-none"
                rows={2}
              >
                {' '}
              </textarea>
              <button
                type="button"
                className="bottom-2 right-2 my-2 w-fit self-end rounded-md bg-[#f7b205] px-4 py-2 text-lg font-medium"
              >
                Edit Info
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
