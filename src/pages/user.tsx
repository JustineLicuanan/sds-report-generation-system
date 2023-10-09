import Head from 'next/head';
import { useState } from 'react';
import SideBarMenu, { Subject } from '~/components/side-bar-menu';
import NavBar from '../components/navigation-bar';
export default function User() {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const handleButtonClick = ({ subject, date }) => {
    setSelectedSubject(subject);
    setSelectedDate(date);
  };
  return (
    <>
      <Head>
        <title>SD Services MIS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* NAVIGATION BAR */}
      <NavBar showNotificationButton={true} />

      <main className="">
        <div id="container" className="flex">
          {/* SIDE BAR MENU */}
          <aside>
            <SideBarMenu />

            {/* SIDE BAR SUBJECTS */}
            <div
              id="side-bar"
              className="sticky top-20 my-4 ml-3 h-[67vh] w-32 bg-[#2A9134] p-2 md:h-[75vh] md:w-60 md:p-3"
            >
              <Subject />
            </div>
          </aside>

          <div id="main-content" className="mx-5 w-full md:mx-10 md:w-9/12">
            <div className="flex">
              <div className=" my-4 me-1 h-20 w-20 rounded-full bg-[#2A9134] md:h-24 md:w-24 lg:h-28 lg:w-28"></div>
              <div className="self-center">
                <div className="ms-4 text-base font-extrabold md:text-lg lg:text-xl">
                  Organization Name
                </div>
                <div className="ms-12 text-base font-extrabold md:text-lg lg:text-xl">Category</div>
              </div>
            </div>

            <div id="pdf-viewer">
              <div className="my-2 flex justify-between md:my-4">
                <div className="ms-4 text-base font-extrabold md:text-lg lg:text-xl">
                  {selectedSubject || 'Subject'}
                </div>
                <div className="me-4 text-base font-extrabold md:text-lg lg:text-xl">
                  {selectedDate || 'Date'}
                </div>
              </div>
              <div className="my-auto grid h-48 w-full place-items-center border-8 border-[#2A9134] text-xl font-extrabold md:h-56 md:text-3xl">
                .PDF viewer
              </div>
              <div className="my-2 flex md:my-3">
                <button className="me-1  h-6 w-16 rounded bg-[#f7b205] hover:bg-[#2A9134] hover:text-white md:me-3 md:h-8 md:w-20"></button>
                <button className="me-1  h-6 w-16 rounded bg-[#f7b205] hover:bg-[#2A9134] hover:text-white md:me-3 md:h-8 md:w-20"></button>
                <button className="me-1  h-6 w-16 rounded bg-[#f7b205] hover:bg-[#2A9134] hover:text-white md:me-3 md:h-8 md:w-20"></button>
                <button className="me-1  h-6 w-16 rounded bg-[#f7b205] hover:bg-[#2A9134] hover:text-white md:me-3 md:h-8 md:w-20"></button>
              </div>
            </div>

            <div className="h-44 bg-[#2A9134] p-2">
              <div className=" h-28 bg-white  "></div>
              <div className="text-right">
                <button className="my-3 me-1 h-6 w-16 rounded bg-[#f7b205] text-sm font-medium md:me-3 md:h-8 md:w-20 md:text-base">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
