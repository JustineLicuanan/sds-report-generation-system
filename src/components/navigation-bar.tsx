import Image from 'next/image';
import { useState } from 'react';
import TruncateWord from './truncate-word';

export default function NavBar({ showNotificationButton }: { showNotificationButton: boolean }) {
  const [showNotification, setShowNotification] = useState(false);
  return (
    <>
      <nav className="sticky top-0 z-[10] flex max-h-[12vh] min-h-[4vh] items-center">
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
                Report Management System
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
                } absolute right-[30px] top-[45px] h-[500px] w-[375px] overflow-auto bg-white px-2 pt-2`}
              >
                <h1 className="py-2 text-center text-3xl font-bold tracking-tight">
                  Notifications
                </h1>
                <button className="mb-1 h-fit w-full rounded bg-gray text-left hover:bg-yellow">
                  <div className="px-2 py-2 text-center text-sm font-bold text-black/60">
                    11/05/23
                  </div>
                  <div className="-mt-4 px-2 py-2 text-xl font-bold tracking-tight">
                    <TruncateWord
                      text={
                        'NAME OF SUBJECTNAME OF SUBJECTNAME OF SUBJECTNAME OF SUBJECTNAME OF SUBJECT'
                      }
                      maxLength={30}
                    />
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
