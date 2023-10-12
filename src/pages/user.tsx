import Head from 'next/head';
import SideBarMenu from '~/components/side-bar-menu';
import NavBar from '../components/navigation-bar';
import Subject from '../components/subject';

export default function User() {
  return (
    <>
      <Head>
        <title>SD Services MIS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* NAVIGATION BAR */}
      <NavBar showNotificationButton={true} />

      <main className="flex">
        {/* SIDE BAR*/}
        <SideBarMenu />

        <div id="main-content" className="mx-5 w-full md:mx-10 md:w-8/12">
          <div className="my-2 h-2 rounded-md bg-[#2A9134]"> </div>
          <div className="flex">
            <div className=" my-4 me-1 h-20 w-20 rounded-full bg-[#2A9134] md:h-24 md:w-24 lg:h-28 lg:w-28"></div>
            <div className="self-center">
              <div className="ms-4 text-base font-extrabold md:text-lg lg:text-xl">
                Organization Name
              </div>
              <div className="ms-12 text-base font-extrabold md:text-lg lg:text-xl">Category</div>
            </div>
          </div>
          <div className="my-2 h-2 rounded-md bg-[#2A9134]"> </div>
          <div>
            <h1 className=" my-2 text-3xl font-bold tracking-tight">Requests</h1>
            <Subject />
          </div>
          <div className="my-2 h-2 rounded-md bg-[#2A9134]"> </div>
        </div>
      </main>
    </>
  );
}
