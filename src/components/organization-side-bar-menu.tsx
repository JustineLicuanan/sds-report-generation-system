import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { paths } from '~/meta';

// type Inputs = z.infer<typeof orgSchemas.create>;

export default function OrganizationSideBarMenu() {
  const sidebarMenu = [
    { id: 1, name: 'Home', imageLink: '/home_icon.svg', urlLink: `${paths.ORGANIZATION}` },
    // {
    //   id: 2,
    //   name: 'Log',
    //   imageLink: '/log_icon.svg',
    //   urlLink: `${paths.ORGANIZATION}${paths.LOGS}`,
    // },
    {
      id: 3,
      name: 'Create',
      imageLink: '/create_icon.svg',
      urlLink: `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.ORGANIZATION_CREATE}`,
    },
    { id: 4, name: 'Sign Out', imageLink: '/signout_icon.svg', urlLink: `${paths.SIGN_OUT}` },
  ];

  const { asPath } = useRouter();
  const [showSidebar, setShowSidebar] = useState(true); // Toggle Sidebar
  return (
    <>
      {/* HAMBURGER MENU */}
      <button
        type="button"
        onClick={() => setShowSidebar(!showSidebar)}
        className={`${
          !showSidebar ? 'right-7 translate-x-5 duration-300' : 'left-4 -translate-x-5 duration-300'
        } fixed bottom-5 z-[999] ms-3 mt-3 rounded-full bg-[#e0e0e0]  p-1 shadow-[5px_5px_10px_0px_rgba(94,94,94,1)] md:hidden`}
      >
        {showSidebar ? (
          <Image src="/menu_icon.svg" alt="Hamburger Menu" width={30} height={30} className="" />
        ) : (
          <Image
            src="/close_menu_icon.svg"
            alt="Close Hamburger Menu"
            width={30}
            height={30}
            className=""
          />
        )}
      </button>
      {/* BUTTONS AND LINKS */}
      <div
        className={`${
          showSidebar ? 'hidden' : ''
        } fixed z-[99] h-full w-full bg-black/50 duration-300 md:hidden`}
      ></div>
      <div
        id="side-bar"
        className={`${
          showSidebar ? 'hidden duration-300 md:flex' : 'flex'
        } fixed z-[100] my-2 ml-1 h-[90vh] flex-col items-center bg-green px-1 md:sticky md:my-3 md:ml-2  md:h-[87vh] lg:ml-3`}
      >
        {/* SIDE BAR LINKS */}
        {sidebarMenu.map((item) => (
          <>
            {item.name === 'Sign Out' && (
              <div className="mt-1 h-[4px] w-full rounded bg-gray lg:mt-2"></div>
            )}
            <Link
              href={item.urlLink}
              key={item.id}
              className={`group relative mt-1 flex h-10 w-10 items-center justify-center rounded-md p-1 hover:bg-yellow md:mx-1 lg:mt-2  lg:h-12 lg:w-12 ${
                asPath === item.urlLink ? 'bg-yellow' : 'bg-gray'
              }`}
            >
              <Image
                width={100}
                height={100}
                src={item.imageLink}
                alt={item.name}
                className="h-10 w-fit hover:scale-105 lg:h-12"
              />
              <div className="absolute left-12 hidden whitespace-nowrap rounded-md bg-gray px-2 py-1 text-left text-lg font-medium group-hover:block lg:left-16 lg:text-xl">
                {item.name}
              </div>
            </Link>
          </>
        ))}
      </div>
    </>
  );
}
