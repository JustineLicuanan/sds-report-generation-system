import Image from 'next/image';
import { useState } from 'react';
import TruncateWord from './truncate-word';

export default function NavBar({ showNotificationButton }: { showNotificationButton: boolean }) {
  const notification = [
    {
      subject: 'File a report today.',
      date: '10/05/23',
      isRead: false,
      description: 'File a report today for your organization.',
    },
    {
      subject: 'File a report tomorrow.',
      date: '10/04/23',
      isRead: false,
      description: 'File a report tomorrow for your organization.',
    },
    {
      subject: 'File a report from yesterday.',
      date: '10/06/23',
      isRead: false,
      description: 'File a report from yesterday for your organization.',
    },
  ];

  const [showNotification, setShowNotification] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<number | null>(null);

  notification.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  return (
    <>
      <nav className="sticky top-0 z-[999] flex max-h-[12vh] min-h-[4vh] items-center">
        <div
          id="nav-container"
          className="flex w-full items-center justify-between py-1 md:px-7 md:py-2"
        >
          <div id="titles" className="flex px-1">
            <Image
              src="/cvsu_logo.png"
              alt="CVSU Logo"
              height={100}
              width={100}
              id="logo"
              className="h-10 w-10 rounded-full md:h-12  md:w-12"
            />
            <div className="mt-[-5px] leading-3 text-white">
              <div id="title" className="ms-2 text-lg font-bold sm:text-xl md:text-2xl lg:text-3xl">
                Office of Student Development Services
              </div>
              <div id="sub-title" className="ms-14">
                Scheduling System
              </div>
            </div>
          </div>
          {showNotificationButton && (
            <div className="relative">
              <button id="notification" onClick={() => setShowNotification(!showNotification)}>
                <Image
                  src="/notification_icon.svg"
                  className="h-10 text-black md:h-12"
                  alt="Notification Bell"
                  height={100}
                  width={100}
                />
              </button>

              <div
                className={`${
                  showNotification ? '' : 'hidden'
                } absolute right-[30px] top-[45px] h-[500px] w-[375px] overflow-auto bg-[#FFFFFF] px-2 pt-2 shadow-[5px_5px_10px_0px_rgba(94,94,94,1)]`}
              >
                <h1 className="py-2 text-center text-3xl font-bold tracking-tight">
                  Notifications
                </h1>
                {notification.map((notif, index) => (
                  <button
                    key={index}
                    className={`mb-1 h-fit w-full rounded ${
                      selectedNotification === index ? 'bg-gray/50' : 'bg-gray'
                    }  text-left hover:bg-yellow`}
                    onClick={() => {
                      return setShowAnnouncement(!showAnnouncement), setSelectedNotification(index);
                    }}
                  >
                    <div
                      className={`${
                        selectedNotification === index
                          ? 'font-light text-black/60'
                          : 'font-bold text-black/80 '
                      } px-2 py-2 text-center text-sm `}
                    >
                      {notif.date}
                    </div>
                    <div
                      className={`${
                        selectedNotification === index
                          ? 'font-medium text-black/60'
                          : 'font-bold text-black/80 '
                      } -mt-4 px-2 py-2 text-center  tracking-tight`}
                    >
                      <TruncateWord text={notif.subject} maxLength={33} fontSize="text-lg" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
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
              <div className="flex  text-xl">
                <h4 className="font-semibold">Date:</h4>
                <div className="ms-1 text-xl font-medium">
                  {notification[selectedNotification]?.date}{' '}
                  <span className="text-lg  text-black/80"> to</span> 10/20/23
                </div>
              </div>
              <div className="flex py-2 text-xl">
                <h4 className="font-semibold">Subject:</h4>
                <div className="ms-1 text-xl font-medium">
                  {notification[selectedNotification]?.subject}
                </div>
              </div>
              <div className="flex py-2 text-xl">
                <h4 className="font-semibold">Description:</h4>
                <div className="ms-1 text-xl font-medium">
                  {notification[selectedNotification]?.description}
                </div>
              </div>
            </div>
            <div className="flex justify-end px-4">
              <button
                type="button"
                className="my-4 cursor-pointer rounded-md bg-yellow px-8 py-2 text-lg font-medium"
                onClick={() => setShowAnnouncement(!showAnnouncement)}
              >
                Mark as read
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
