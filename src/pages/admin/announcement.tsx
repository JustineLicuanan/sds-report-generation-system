import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import AdminSideBarMenu from '~/components/admin-side-bar-menu';
import NavBar from '~/components/navigation-bar';
import TruncateWord from '~/components/truncate-word';
import { meta } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { authRedirects } from '~/utils/auth-redirects';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.admin(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function AnnouncementPage() {
  const listOfAnnouncements = [
    {
      organization: 'Music Organization',
      subject: 'Event Report',
      date: '11/05/23',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, deleniti!',
    },
    {
      organization: 'Science Organization',
      subject: 'Financial Report',
      date: '11/07/23',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit perspiciatis molestias odit, dolorum ipsam asperiores laborum accusamus.',
    },
  ];

  const [myArray, setMyArray] = useState(listOfAnnouncements);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<number | null>(null);

  const deleteElementAtIndex = (index: number) => {
    // Create a copy of the array excluding the element at the specified index
    const newArray = [...myArray.slice(0, index), ...myArray.slice(index + 1)];

    // Update the state with the new array
    setMyArray(newArray);
  };
  return (
    <>
      {/* HEADER */}
      <Head>
        <title>{`Announcements ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <NavBar />
      <main className="flex">
        {/* SIDE BAR */}
        <AdminSideBarMenu />

        {/* MAIN CONTENT */}

        <div className="mx-3 my-4 w-full">
          <div className="mx-auto my-0 min-h-[87vh] max-w-5xl rounded-3xl px-5 py-5 shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)] md:px-9">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
              Announcements
            </h1>
            {/* LIST OF ANNOUNCEMENTS */}
            <div className="my-5 w-full">
              {myArray.map((data, index) => (
                <button
                  type="button"
                  onClick={() => {
                    return setShowAnnouncement(!showAnnouncement), setSelectedNotification(index);
                  }}
                  className="mb-4 w-full bg-gray px-3 py-2 hover:bg-yellow"
                  key={index}
                >
                  <div className="flex justify-between py-2">
                    <div>
                      <h4 className="text-2xl font-semibold">{data.organization}</h4>
                    </div>
                    <div className="flex  text-xl">
                      <h4 className="font-semibold">Date started:</h4>
                      <div className="ms-1 text-xl font-medium">{data.date}</div>
                    </div>
                  </div>
                  <div className="flex py-2 text-xl">
                    <h4 className="font-semibold">Subject:</h4>
                    <div className="ms-1 text-xl font-medium">{data.subject}</div>
                  </div>
                  <div className="flex py-2 text-xl">
                    <h4 className="font-semibold">Description:</h4>
                    <div className="ms-1  font-medium">
                      <TruncateWord text={data.description} maxLength={70} fontSize="text-xl" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
      {showAnnouncement && selectedNotification !== null && (
        <div
          className={`fixed left-0 top-0 z-[999]  flex h-full w-full items-center  justify-center bg-black/[.50] transition-opacity duration-300 ease-in-out
         ${showAnnouncement ? '' : 'invisible opacity-0'}`}
        >
          <div
            className={`relative z-[5] h-fit w-[450px]  rounded-3xl bg-white shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)]  duration-300 ease-in-out `}
          >
            <h1 className="py-3 text-center text-3xl font-bold tracking-tight">Announcement</h1>
            <div className="h-[1px] w-full bg-black "></div>
            <div className="px-3 py-2">
              <div className="flex py-2 text-xl">
                <h4 className="font-semibold">Date:</h4>
                <div className="ms-1 text-xl font-medium">
                  {myArray[selectedNotification]?.date}
                </div>
              </div>
              <div className="flex py-2 text-xl">
                <h4 className="font-semibold">Subject:</h4>
                <div className="ms-1 text-xl font-medium">
                  {myArray[selectedNotification]?.subject}
                </div>
              </div>
              <div className="flex py-2 text-xl">
                <h4 className="font-semibold">Description:</h4>
                <div className="ms-1 text-xl font-medium">
                  {myArray[selectedNotification]?.description}
                </div>
              </div>
            </div>
            <div className="flex justify-between px-4">
              <button
                type="button"
                className="my-4 cursor-pointer rounded-md bg-red px-8 py-2 text-lg font-medium text-white"
                onClick={() => {
                  deleteElementAtIndex(selectedNotification);
                  setShowAnnouncement(!showAnnouncement);
                }}
              >
                Delete
              </button>
              <button
                type="button"
                className="my-4 cursor-pointer rounded-md bg-yellow px-8 py-2 text-lg font-medium"
                onClick={() => setShowAnnouncement(!showAnnouncement)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
