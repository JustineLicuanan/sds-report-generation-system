import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { paths } from '~/meta';
import { api } from '~/utils/api';

export default function SideBarMenu() {
  const getOrgQuery = api.admin.org.get.useQuery({});
  const organizationList = getOrgQuery.data ?? [];

  const sidebarMenu = [
    { id: 1, name: 'Home', imageLink: '/home_icon.svg', urlLink: `${paths.ADMIN}` },
    {
      id: 2,
      name: 'Organizations',
      imageLink: '/organizations_icon.svg',
      urlLink: `${paths.ADMIN}${paths.ORGANIZATIONS}`,
    },
    { id: 3, name: 'Log', imageLink: '/log_icon.svg', urlLink: `${paths.ADMIN}${paths.LOGS}` },
  ];

  const { asPath } = useRouter();

  const [showSidebar, setShowSidebar] = useState(true); // Toggle Sidebar

  const [createAnnouncement, setCreateAnnouncement] = useState(false); // Show Create Announcement Modal
  const [announcementDropdown, setAnnouncementDropdown] = useState(false); // Show options for announcement
  const [createOrganization, setCreateOrganization] = useState(false); // Show Create Organization Modal
  const [visibilityOrganization, setVisibilityOrganization] = useState(true);
  const [visibilityUpload, setVisibilityUpload] = useState(false);
  const [uploadPhoto, setUploadPhoto] = useState('/default_logo.png');
  const [visibilityDescription, setVisibilityDescription] = useState(false);

  const [logout, setLogout] = useState(false);

  const sideBarButtons = [
    {
      name: 'Announcement',
      imageLink: '/announcement_icon.svg',
      value: announcementDropdown,
      function: setAnnouncementDropdown,
    },
    {
      name: 'Create',
      imageLink: '/create_icon.svg',
      value: createOrganization,
      function: setCreateOrganization,
    },
    {
      name: 'Logout',
      imageLink: '/logout_icon.svg',
      value: logout,
      function: setLogout,
    },
  ];

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setUploadPhoto(selectedFile.name);
    }
  }

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
        } fixed z-[100] my-2 ml-1 h-[90vh] flex-col items-center bg-green px-1 md:sticky md:my-3 md:ml-2  md:h-[87vh] lg:my-4 lg:ml-3`}
      >
        {/* SIDE BAR LINKS */}
        {sidebarMenu.map((item) => (
          <Link
            href={item.urlLink}
            key={item.id}
            className={`group relative mt-1 flex h-10 w-10 items-center justify-center rounded-md hover:bg-yellow md:mx-1 lg:mt-2  lg:h-12 lg:w-12 ${
              asPath === item.urlLink ? 'bg-yellow' : 'bg-gray' // Check if the current route matches the item's urlLink
            }`}
          >
            <Image
              width={100}
              height={100}
              src={item.imageLink}
              alt={item.name}
              className="h-10 w-fit hover:scale-105 lg:h-12"
            />
            <div className="absolute left-12 hidden rounded-md bg-gray px-2 py-1 text-left text-lg font-medium group-hover:block lg:left-16 lg:text-xl">
              {item.name}
            </div>
          </Link>
        ))}

        {/* SIDE BAR BUTTONS */}
        {sideBarButtons.map((item) => {
          return (
            <>
              {item.name === 'Logout' && (
                <div className="mt-1 h-[4px] w-full rounded bg-gray lg:mt-2"></div>
              )}
              <div className="relative">
                <button
                  type="button"
                  className="group  mt-1 flex h-10 w-10 items-center justify-center rounded-md bg-gray hover:bg-yellow  md:mx-1 lg:mt-2 lg:h-12 lg:w-12"
                  onClick={() => item.function(!item.value)}
                >
                  <Image
                    width={100}
                    height={100}
                    src={item.imageLink}
                    alt={item.name}
                    className="h-12 w-fit hover:scale-105"
                  />
                  <div className="absolute left-12 hidden rounded-md bg-gray px-2 py-1 text-left text-lg font-medium group-hover:block lg:left-16 lg:text-xl">
                    {item.name}
                  </div>
                </button>
                {announcementDropdown && item.name === 'Announcement' && (
                  <div className="absolute -bottom-[75%] left-12 z-[100] flex flex-col bg-gray  text-left text-lg font-medium">
                    <Link
                      href={`${paths.ADMIN}${paths.ANNOUNCEMENT}`}
                      type="button"
                      className="px-2 py-1 text-lg font-medium hover:bg-yellow"
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      className="px-2 py-1 text-lg font-medium hover:bg-yellow"
                      onClick={() => {
                        return (
                          setCreateAnnouncement(!createAnnouncement),
                          setAnnouncementDropdown(!announcementDropdown)
                        );
                      }}
                    >
                      Create
                    </button>
                  </div>
                )}
              </div>
            </>
          );
        })}
      </div>

      {/* ANNOUNCEMENT DROP DOWN */}
      {/* MODALS */}
      {/* ANNOUNCEMENT */}
      <div
        className={`fixed left-0 top-0 z-[999]  flex h-full w-full items-center  justify-center bg-black/[.50] transition-opacity duration-300 ease-in-out ${
          createAnnouncement ? '' : 'invisible opacity-0'
        }`}
      >
        <div
          className={`relative z-[5] h-[450px] w-[450px]  rounded-3xl bg-white shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)]  duration-300 ease-in-out`}
        >
          <h1 className="py-3 text-center text-3xl font-bold tracking-tight">
            Create new Announcement
          </h1>
          <div className="h-[1px] w-full bg-black "></div>
          <div className="flex flex-col px-10 py-5 ">
            <label htmlFor="audience-list" className="text-xl font-bold">
              Audience
            </label>
            <select
              name="audience"
              id="audience-list"
              className="transparent mt-1 h-9 border-[1px] border-green px-2 py-1  text-lg outline-none"
              defaultValue="sort"
            >
              <option value="sort" disabled>
                Select an audience
              </option>
              {organizationList.map((org, idx) => (
                <option key={idx} value="">
                  {org.name}
                </option>
              ))}
            </select>
            <div className="mt-1 flex  justify-between">
              <div>
                <label htmlFor="date-start" className="text-xl font-bold">
                  Date Start
                </label>
                <br />
                <input
                  type="date"
                  name="date-start"
                  id="date-start"
                  className="mb-2 mt-1 h-9 border-[1px] border-green px-2  py-1 text-lg outline-none "
                />
              </div>
              <div className="text-xl font-bold">
                <br /> -
              </div>
              <div>
                <label htmlFor="date-end" className="text-xl font-bold">
                  Date End
                </label>
                <br />
                <input
                  type="date"
                  name="date-end"
                  id="date-end"
                  className="mb-2 mt-1 h-9 border-[1px] border-green px-2  py-1 text-lg outline-none "
                />
              </div>
            </div>
            <label htmlFor="announcement-subject" className="text-xl font-bold ">
              Subject
            </label>
            <input
              type="text"
              name="announcement-subject"
              id="announcement-subject"
              placeholder="Subject"
              className="mb-2 mt-1 h-9 border-[1px] border-green px-2  py-1 text-lg outline-none "
            />
            <label htmlFor="announcement-message" className=" mb-2 text-xl font-bold">
              Message
            </label>
            <textarea
              name="organization-description"
              id="org-description"
              placeholder="Announcement message"
              rows={3}
              className="border border-green px-2 py-1 text-lg"
            ></textarea>
          </div>
          <div className="absolute bottom-0 left-7">
            <button
              type="button"
              onClick={() => {
                setCreateAnnouncement(false);
              }}
              className="my-6 cursor-pointer rounded-md bg-yellow px-8 py-2 text-lg font-medium"
            >
              Cancel
            </button>
          </div>
          <div className="absolute bottom-0 right-7">
            <button
              type="button"
              className="my-6 rounded-md bg-yellow px-8 py-2 text-lg font-medium"
            >
              Create
            </button>
          </div>
        </div>
      </div>

      {/* CREATE ORGANIZATION */}
      <div
        className={`fixed left-0 top-0 z-[999]  flex h-full w-full items-center  justify-center bg-black/[.50] transition-opacity duration-300 ease-in-out ${
          createOrganization ? '' : 'invisible opacity-0'
        }`}
      >
        <div
          className={` relative h-[433px] w-[450px]  rounded-3xl bg-white shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)]  ease-in-out ${
            visibilityOrganization ? 'duration-300' : 'invisible -translate-y-4 duration-0'
          }`}
        >
          <h1 className="py-3 text-center text-3xl font-bold tracking-tight">
            Create new Organization
          </h1>
          <div className="h-[1px] w-full bg-black "></div>

          <div className="px-10 py-5">
            <label htmlFor="organization-name" className=" text-xl font-bold ">
              Organization Name
            </label>
            <br />
            <input
              type="text"
              name="organization-name"
              id="organization-name"
              placeholder="e.g Music Organization"
              className="mb-2 mt-1 h-9 border-[1px] border-green px-2  py-1 text-lg outline-none "
            />
            <br />
            <label htmlFor="org-category" className="text-xl font-bold">
              Category
            </label>
            <br />
            <select
              name="category"
              id="org-category"
              className="transparent mt-1 h-9 border-[1px] border-green px-2 py-1  text-lg outline-none"
              defaultValue="sort"
            >
              <option value="sort" disabled>
                Select a category
              </option>
              <option value="">Student Governing Body</option>
              <option value="">Academic Organization</option>
              <option value="">Non Academic Organization</option>
            </select>
          </div>
          <div className="h-[1px] w-full bg-black "></div>
          <div className="px-10 pt-5">
            <div className="mb-6 font-bold">
              NOTE:{'   '}
              <span className="font-normal">
                Please provide the existing CVSU email address that you would like to grant
                permission to.
              </span>
            </div>
            <label htmlFor="email-address" className=" text-xl font-bold">
              Email
            </label>
            <br />
            <input
              type="text"
              name="email-address"
              id="email-address"
              placeholder="e.g music.organization@sample.com"
              className=" mt-1 h-9 w-3/4 border-[1px] border-green px-2  py-1 text-lg outline-none"
            />
            <div className="absolute bottom-0 left-7">
              <button
                type="button"
                className="my-6 cursor-pointer rounded-md bg-yellow px-8 py-2 text-lg font-medium"
                onClick={() => setCreateOrganization(!createOrganization)}
              >
                Cancel
              </button>
            </div>
            <div className="absolute bottom-0 right-7">
              <button
                type="button"
                onClick={() => {
                  setVisibilityOrganization(false);
                  setVisibilityUpload(true);
                }}
                className="my-6 rounded-md bg-yellow px-8 py-2 text-lg font-medium"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* UPLOAD ORGANIZATION LOGO */}
        <div
          className={`z-2 fixed left-0 top-0 flex  h-full w-full items-center justify-center   ease-in-out ${
            visibilityUpload ? 'duration-300' : 'invisible -translate-y-4 duration-0'
          }`}
        >
          <div className="relative h-[433px] w-[450px]  rounded-3xl bg-white shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)] ">
            <h1 className="py-3 text-center text-3xl font-bold tracking-tight">
              Upload Organization Logo
            </h1>
            <div className="h-[1px] w-full bg-black "></div>
            <div className="align-center mt-[30px] flex  justify-center px-10">
              <Image
                width={100}
                height={100}
                src={uploadPhoto}
                alt="Avatar Logo"
                className="h-[200px] w-[200px]"
              />
            </div>
            <div className="flex justify-center">
              <label
                htmlFor="avatar-logo"
                className="my-6 cursor-pointer rounded-md bg-yellow px-8 py-2 text-lg font-medium  "
              >
                Upload
              </label>
              <input
                type="file"
                name="avatar"
                id="avatar-logo"
                accept="image/jpeg image/png"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
            <div className="absolute bottom-0 left-7">
              <button
                type="button"
                className="my-6 cursor-pointer rounded-md bg-yellow px-8 py-2 text-lg font-medium"
                onClick={() => {
                  setVisibilityUpload(false);
                  setVisibilityOrganization(true);
                }}
              >
                Back
              </button>
            </div>
            <div className="absolute bottom-0 right-7">
              <button
                type="button"
                onClick={() => {
                  setVisibilityUpload(false);
                  setVisibilityDescription(true);
                }}
                className="my-6 rounded-md bg-yellow px-8 py-2 text-lg font-medium"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* LAST STEP */}
        <div
          className={`z-2 fixed left-0 top-0 flex  h-full w-full items-center justify-center ease-in-out ${
            visibilityDescription ? 'duration-300' : 'invisible -translate-y-4 duration-0'
          }`}
        >
          <div className="relative h-[433px] w-[450px]  rounded-3xl bg-white shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)] ">
            <h1 className="py-3 text-center text-3xl font-bold tracking-tight">Last step</h1>
            <div className="h-[1px] w-full bg-black "></div>
            <div className="mt-5 flex flex-col px-10">
              <label htmlFor="org-description" className=" mb-2 text-xl font-bold">
                Description
              </label>
              <textarea
                name="organization-description"
                id="org-description"
                placeholder="Tell me about this organization"
                cols={30}
                rows={7}
                className="border border-green px-2 py-1 text-lg"
              ></textarea>
            </div>
            <div className="absolute bottom-0 left-7">
              <button
                type="button"
                onClick={() => {
                  setVisibilityUpload(true);
                  setVisibilityDescription(false);
                }}
                className="my-6 cursor-pointer rounded-md bg-yellow px-8 py-2 text-lg font-medium"
              >
                Back
              </button>
            </div>
            <div className="absolute bottom-0 right-7">
              <button
                type="button"
                className="my-6 rounded-md bg-yellow px-8 py-2 text-lg font-medium"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* LOGOUT */}
      <div
        className={`fixed left-0 top-0 z-[999]  flex h-full w-full items-center  justify-center bg-black/[.50] transition-opacity duration-300 ease-in-out ${
          logout ? '' : 'invisible opacity-0'
        }`}
      >
        <div className="relative h-[200px] w-[350px]  rounded-3xl bg-white shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)]">
          <h1 className="py-3 text-center text-3xl font-bold tracking-tight">Logout</h1>
          <div className="h-[1px] w-full bg-black "></div>
          <div className="flex items-center justify-around p-2">
            <Image
              src="/logout_danger_icon.svg"
              width={50}
              height={50}
              alt="Logout Danger"
              className=""
            />
            <div className="py-3 text-center text-2xl font-medium">
              Are you sure you want to logout?
            </div>
          </div>
          <div className="absolute bottom-0 left-7">
            <button
              type="button"
              className="my-6 cursor-pointer rounded-md bg-yellow px-8 py-2 text-lg font-medium"
              onClick={() => setLogout(!logout)}
            >
              Cancel
            </button>
          </div>
          <div className="absolute bottom-0 right-7">
            <button type="button" className="my-6 rounded-md bg-red px-8 py-2 text-lg font-medium">
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
