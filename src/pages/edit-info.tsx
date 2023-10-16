import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import NavBar from '~/components/navigation-bar';
import SideBarMenu from '~/components/side-bar-menu';

export default function EditInfo() {
  const router = useRouter();
  const { organizationName, categoryName, email, description } = router.query;

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

        <div className="mx-2 mt-4 h-[87vh] w-full ">
          <div className="relative mx-auto my-0  h-[87vh] max-w-5xl  rounded-3xl px-5 py-5 shadow-[0_4px_25px_0px_rgba(0,0,0,0.25)] md:px-9 ">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">Edit Info</h1>
            <div className="mx-auto my-0 flex max-w-2xl flex-col ">
              {/* ORGANIZATION'S LOGO */}
              <div className="mb-2 mt-2 flex flex-col items-center">
                <Image
                  src="/default_logo.png"
                  alt="Organization's Logo"
                  width={112}
                  height={112}
                  className="mb-3 me-1 flex  h-28 w-28 rounded-full bg-[#2A9134]"
                />
                <h2 className="mb-2 text-xl font-bold">Logo</h2>
              </div>

              {/* ORGANIZATION NAME */}
              <label htmlFor="email-address" className=" text-lg font-bold">
                Organization Name
              </label>
              <input
                type="text"
                name="email-address"
                id="email-address"
                className=" mt-1 h-8 w-full border-[1px] border-[#2A9134] px-2 py-1  outline-none md:w-3/4"
                value={organizationName}
              />

              {/* CATEGORY */}
              <label htmlFor="email-address" className="mt-1 text-lg font-bold">
                Category
              </label>
              <select
                name="sort-date"
                id="sort-date"
                className="me-2 h-8 w-full border-[1px] border-[#2A9134] bg-white px-2 py-1 md:w-2/4  "
                value={categoryName}
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
              <div className="text-sn mb-1 mt-2 w-full font-bold md:w-2/4">
                NOTE:{'   '}
                <span className="text-sm font-normal">
                  Please provide the existing CVSU email address that you would like to grant
                  permission to.
                </span>
              </div>

              {/* EMAIL */}
              <label htmlFor="email-address" className=" text-lg font-bold">
                Email
              </label>
              <input
                type="text"
                name="email-address"
                id="email-address"
                className=" mt-1 h-8 w-full border-[1px] border-[#2A9134] px-2 py-1  outline-none md:w-3/4"
                value={email}
              />

              <label htmlFor="text-description" className="mt-1 text-lg font-bold">
                Description
              </label>
              <div className="flex w-full flex-col md:w-4/5">
                <textarea
                  name="text-description"
                  id="text-description"
                  className=" mt-1   border-[1px] border-[#2A9134] px-2  py-1 outline-none"
                  rows={2}
                  value={description}
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
        </div>
      </main>
    </>
  );
}