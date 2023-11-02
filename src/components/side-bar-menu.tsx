import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { paths } from '~/meta';

// type Inputs = z.infer<typeof orgSchemas.create>;

export default function SideBarMenu() {
  // const createOrgMutation = api.admin.org.create.useMutation();

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
  const [createOrganization, setCreateOrganization] = useState(false);

  const [visibilityOrganization, setVisibilityOrganization] = useState(true);

  const [visibilityUpload, setVisibilityUpload] = useState(false);
  const [uploadPhoto, setUploadPhoto] = useState('/default_logo.png');

  const [visibilityDescription, setVisibilityDescription] = useState(false);

  const toggleCreateComponent = () => {
    setCreateOrganization(!createOrganization);
  };

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setUploadPhoto(selectedFile.name);
    }
  }

  return (
    <>
      <div
        id="side-bar"
        className="bg-green sticky top-20 z-[1] my-4 ml-3 h-[87vh] w-16 px-2 md:w-16"
      >
        {sidebarMenu.map((item) => (
          <Link
            href={item.urlLink}
            key={item.id}
            className={`hover:bg-yellow group relative m-1 mb-2 flex h-12 w-12 items-center justify-center  rounded-md md:mx-1 ${
              asPath === item.urlLink ? 'bg-yellow' : 'bg-gray' // Check if the current route matches the item's urlLink
            }`}
          >
            <Image
              width={100}
              height={100}
              src={item.imageLink}
              alt={item.name}
              className="h-12 w-fit hover:scale-105"
            />
            <div className="bg-gray absolute left-16 hidden rounded-md px-2 py-1 text-left text-xl font-medium group-hover:block">
              {item.name}
            </div>
          </Link>
        ))}
        <button
          type="button"
          className="hover:bg-yellow bg-gray group relative m-1 mb-2 flex h-12 w-12  items-center justify-center rounded-md md:mx-1"
        >
          <Image
            width={100}
            height={100}
            src="/announcement_icon.svg"
            alt="Announcement"
            className="h-12 w-fit hover:scale-105"
          />
          <div className="bg-gray absolute left-16 hidden rounded-md px-2 py-1 text-left text-xl font-medium group-hover:block">
            Announcement
          </div>
        </button>
        <button
          type="button"
          onClick={toggleCreateComponent}
          className="hover:bg-yellow bg-gray group relative m-1 mb-2 flex h-12 w-12  items-center justify-center rounded-md md:mx-1"
        >
          <Image
            width={100}
            height={100}
            src="/create_icon.svg"
            alt="Create"
            className="h-12 w-fit hover:scale-105"
          />
          <div className="bg-gray absolute left-16 hidden rounded-md px-2 py-1 text-left text-xl font-medium group-hover:block">
            Create
          </div>
        </button>
      </div>

      {/* CREATE ORGANIZATION */}
      <div
        className={`fixed left-0 top-0 z-[3]  flex h-full w-full items-center  justify-center bg-black/[.50] transition-opacity duration-300 ease-in-out ${
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
              className="border-green mb-2 mt-1 h-9 border-[1px] px-2  py-1 text-lg outline-none "
            />
            <br />
            <label htmlFor="org-category" className="text-xl font-bold">
              Category
            </label>
            <br />
            <select
              name="category"
              id="org-category"
              className="border-green transparent mt-1 h-9 border-[1px] px-2 py-1  text-lg outline-none"
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
              className=" border-green mt-1 h-9 w-3/4 border-[1px] px-2  py-1 text-lg outline-none"
            />
            <div className="absolute bottom-0 left-7">
              <button
                type="button"
                className="bg-yellow my-6 cursor-pointer rounded-md px-8 py-2 text-lg font-medium"
                onClick={toggleCreateComponent}
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
                className="bg-yellow my-6 rounded-md px-8 py-2 text-lg font-medium"
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
                className="bg-yellow my-6 cursor-pointer rounded-md px-8 py-2 text-lg font-medium  "
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
                className="bg-yellow my-6 cursor-pointer rounded-md px-8 py-2 text-lg font-medium"
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
                className="bg-yellow my-6 rounded-md px-8 py-2 text-lg font-medium"
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
                className="border-green border px-2 py-1 text-lg"
              ></textarea>
            </div>
            <div className="absolute bottom-0 left-7">
              <button
                type="button"
                onClick={() => {
                  setVisibilityUpload(true);
                  setVisibilityDescription(false);
                }}
                className="bg-yellow my-6 cursor-pointer rounded-md px-8 py-2 text-lg font-medium"
              >
                Back
              </button>
            </div>
            <div className="absolute bottom-0 right-7">
              <button
                type="button"
                className="bg-yellow my-6 rounded-md px-8 py-2 text-lg font-medium"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
