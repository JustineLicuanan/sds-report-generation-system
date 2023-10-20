import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, useState } from 'react';

export default function SideBarMenu() {
  const sidebarMenu = [
    { id: 1, name: 'Home', imageLink: 'home_icon.svg', urlLink: '/' },
    { id: 2, name: 'Log', imageLink: 'log_icon.svg', urlLink: '/log' },
  ];

  const { asPath } = useRouter();
  const [createOrganization, setCreateOrganization] = useState(false);

  const [visibilityOrganization, setVisibilityOrganization] = useState(true);

  const [visibilityUpload, setVisibilityUpload] = useState(false);
  const [uploadPhoto, setUploadPhoto] = useState('');

  const [visibilityDescription, setVisibilityDescription] = useState(false);

  const toggleCreateComponent = () => {
    setCreateOrganization(!createOrganization);
    setVisibilityOrganization(false); //reset the inputs
    setVisibilityOrganization(true);

    setVisibilityUpload(false);
    setUploadPhoto('default_logo.png'); // Set the default logo

    setVisibilityDescription(false);
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
        className="sticky top-20 z-[1] my-4 ml-3 h-[87vh] w-16 bg-[#2A9134] p-1 md:w-16"
      >
        {sidebarMenu.map((item) => (
          <Link
            href={item.urlLink}
            key={item.id}
            className={`group relative m-1 mb-2 flex h-12 w-12 items-center justify-center rounded-md  hover:bg-[#f7b205] md:mx-1 ${
              asPath === item.urlLink ? 'bg-[#f7b205]' : 'bg-[#D9D9D9]' // Check if the current route matches the item's urlLink
            }`}
          >
            <img src={item.imageLink} alt={item.name} className="h-12  hover:scale-105" />
            <div className="absolute left-16 hidden rounded-md bg-[#D9D9D9] px-2 py-1 text-left text-xl font-medium group-hover:block">
              {item.name}
            </div>
          </Link>
        ))}
        <button
          type="button"
          onClick={toggleCreateComponent}
          className="group relative m-1 mb-2 flex h-12 w-12 items-center justify-center  rounded-md bg-[#D9D9D9] hover:bg-[#f7b205] md:mx-1"
        >
          <img src="create_icon.svg" alt="Create" className="h-12  hover:scale-105" />
          <div className="absolute left-16 hidden rounded-md bg-[#D9D9D9] px-2 py-1 text-left text-xl font-medium group-hover:block">
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
          className={` relative h-[433px] w-[450px]  rounded-3xl bg-white shadow-[0_4px_25px_0px_rgba(0,0,0,0.25)]  ease-in-out ${
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
              className="mb-2 mt-1 h-9 border-[1px] border-[#2A9134] px-2  py-1 text-lg outline-none "
            />
            <br />
            <label htmlFor="org-category" className="text-xl font-bold">
              Category
            </label>
            <br />
            <select
              name="category"
              id="org-category"
              className="mt-1 h-9 border-[1px] border-[#2A9134] bg-transparent px-2 py-1  text-lg outline-none"
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
              className=" mt-1 h-9 w-3/4 border-[1px] border-[#2A9134] px-2  py-1 text-lg outline-none"
            />
            <div className="absolute bottom-0 right-7">
              <button
                type="button"
                onClick={() => {
                  setVisibilityOrganization(false);
                  setVisibilityUpload(true);
                }}
                className="my-6 rounded-md bg-[#f7b205] px-8 py-2 text-lg font-medium"
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
          <div className="relative h-[433px] w-[450px]  rounded-3xl bg-white shadow-[0_4px_25px_0px_rgba(0,0,0,0.25)] ">
            <h1 className="py-3 text-center text-3xl font-bold tracking-tight">
              Upload Organization Logo
            </h1>
            <div className="h-[1px] w-full bg-black "></div>
            <div className="align-center mt-[30px] flex  justify-center px-10">
              <img src={uploadPhoto} alt="Avatar Logo" className="h-[200px] w-[200px]" />
            </div>
            <div className="flex justify-center">
              <label
                htmlFor="avatar-logo"
                className="my-6 cursor-pointer rounded-md bg-[#f7b205] px-8 py-2 text-lg font-medium  "
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
                className="my-6 cursor-pointer rounded-md bg-[#f7b205] px-8 py-2 text-lg font-medium"
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
                className="my-6 rounded-md bg-[#f7b205] px-8 py-2 text-lg font-medium"
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
          <div className="relative h-[433px] w-[450px]  rounded-3xl bg-white shadow-[0_4px_25px_0px_rgba(0,0,0,0.25)] ">
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
                className="border border-[#2A9134] px-2 py-1 text-lg"
              ></textarea>
            </div>
            <div className="absolute bottom-0 left-7">
              <button
                type="button"
                onClick={() => {
                  setVisibilityUpload(true);
                  setVisibilityDescription(false);
                }}
                className="my-6 cursor-pointer rounded-md bg-[#f7b205] px-8 py-2 text-lg font-medium"
              >
                Back
              </button>
            </div>
            <div className="absolute bottom-0 right-7">
              <button
                type="button"
                className="my-6 rounded-md bg-[#f7b205] px-8 py-2 text-lg font-medium"
              >
                Create
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleCreateComponent}
          className="fixed right-2 top-16 z-[3] text-3xl font-black"
        >
          X
        </button>
      </div>
    </>
  );
}
