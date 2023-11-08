import Head from 'next/head';
import NavBar from '~/components/navigation-bar';
import SideBarMenu from '~/components/side-bar-menu';
import { meta } from '~/meta';

export default function AnnouncementPage() {
  const listOfAnnouncements = [
    {
      organization: 'Music Organization',
      subject: 'Event Report',
      date: '11/05/23',
      message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, deleniti!',
    },
    {
      organization: 'Science Organization',
      subject: 'Financial Report',
      date: '11/07/23',
      message:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit perspiciatis molestias odit, dolorum ipsam asperiores laborum accusamus.',
    },
  ];
  return (
    <>
      {/* HEADER */}
      <Head>
        <title>{`Announcements ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <NavBar showNotificationButton={true} />
      <main className="flex">
        {/* SIDE BAR */}
        <SideBarMenu />

        {/* MAIN CONTENT */}

        <div className="mx-3 mt-4 h-[87vh] w-full overflow-hidden ">
          <div className="mx-auto my-0 h-[87vh] max-w-5xl  overflow-auto rounded-3xl px-5 py-5 shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)] md:px-9">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
              Announcements
            </h1>
            {/* LIST OF ANNOUNCEMENTS */}
            <div className="my-5 w-full">
              {listOfAnnouncements.map((data) => (
                <div className="mb-4 bg-gray px-3 py-2">
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
                    <h4 className="font-semibold">Message:</h4>
                    <div className="ms-1 text-xl font-medium">{data.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
