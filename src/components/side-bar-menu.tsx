import { zodResolver } from '@hookform/resolvers/zod';
import { UserCategory } from '@prisma/client';
import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useFieldArray, useForm, type SubmitHandler } from 'react-hook-form';
import { type z } from 'zod';
import { paths } from '~/meta';
import { api } from '~/utils/api';
import { orgSchemas } from '~/zod-schemas/admin/org';
import { ResourceType, UploadButton, type OnSuccessUpload } from './upload-button';

type Inputs = z.infer<typeof orgSchemas.create>;

export default function SideBarMenu() {
  const getOrgQuery = api.admin.org.get.useQuery();
  const createOrgMutation = api.admin.org.create.useMutation();
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
  // const [showOthers, setShowOthers] = useState(false);

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
  ];

  const createOrgForm = useForm<Inputs>({ resolver: zodResolver(orgSchemas.create) });

  const { register, control } = useForm({
    defaultValues: {
      organization: [{ email: '', position: '' }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: 'organization',
    control,
  });
  console.log(fields);

  const onSuccessUpload: OnSuccessUpload = (result) => {
    createOrgForm.setValue('image', result.info?.secure_url);
    createOrgForm.setValue('imageId', result.info?.public_id);
  };

  const onSubmit: SubmitHandler<Inputs> = async (values) => {
    await createOrgMutation.mutateAsync(values);
  };

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
          <Link
            href={item.urlLink}
            key={item.id}
            className={`group relative mt-1 flex h-10 w-10 items-center justify-center rounded-md p-1 hover:bg-yellow md:mx-1 lg:mt-2  lg:h-12 lg:w-12 ${
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
              <div className="relative">
                <button
                  type="button"
                  className="group  mt-1 flex h-10 w-10 items-center justify-center rounded-md bg-gray p-1 hover:bg-yellow md:mx-1 lg:mt-2 lg:h-12 lg:w-12"
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
        <div className="mt-1 h-[4px] w-full rounded bg-gray lg:mt-2"></div>
        <Link
          href={paths.LOGOUT}
          className={`group relative mt-1 flex h-10 w-10 items-center justify-center rounded-md bg-gray p-1 hover:bg-yellow md:mx-1  lg:mt-2 lg:h-12 lg:w-12`}
        >
          <Image
            width={100}
            height={100}
            src="/logout_icon.svg"
            alt="Logout Icon"
            className="h-10 w-fit hover:scale-105 lg:h-12"
          />
          <div className="absolute left-12 hidden rounded-md bg-gray px-2 py-1 text-left text-lg font-medium group-hover:block lg:left-16 lg:text-xl">
            Logout
          </div>
        </Link>
      </div>

      {/* ANNOUNCEMENT DROP DOWN */}
      {/* MODALS */}
      {/* ANNOUNCEMENT */}
      <div
        className={`fixed left-0 top-0 z-[999] flex h-full w-full items-center justify-center  bg-black/[.50] px-4 transition-opacity duration-300 ease-in-out ${
          createAnnouncement ? '' : 'invisible opacity-0'
        }`}
      >
        <div
          className={`relative z-[5] h-fit w-[450px]  rounded-3xl bg-white shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)]  duration-300 ease-in-out`}
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
            <label htmlFor="announcement-description" className="mb-2 text-xl font-bold">
              Description
            </label>
            <textarea
              id="org-description"
              placeholder="Announcement description"
              rows={3}
              className="border border-green px-2 py-1 text-lg"
              {...createOrgForm.register('description')}
            ></textarea>
            <div className="mt-3 w-fit">
              <label className="relative mb-5 inline-flex cursor-pointer items-center">
                <input type="checkbox" value="" className="peer sr-only" />
                <div className="peer h-5 w-9 rounded-full  bg-gray after:absolute after:start-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray after:bg-white after:transition-all after:content-[''] peer-checked:bg-yellow peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-yellow rtl:peer-checked:after:-translate-x-full dark:border-gray dark:bg-gray dark:peer-focus:ring-blue-800"></div>
                <span className="ms-3 text-sm font-bold text-black/80">With report</span>
              </label>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => {
                  setCreateAnnouncement(false);
                }}
                className="rounded-md bg-gray px-8 py-2 text-lg font-medium"
              >
                Cancel
              </button>
              <button type="button" className="rounded-md bg-yellow px-8 py-2 text-lg font-medium">
                Create
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CREATE ORGANIZATION */}
      <form
        className={`fixed left-0 top-0 z-[999]  flex h-full w-full items-center  justify-center bg-black/[.50] px-4 transition-opacity duration-300 ease-in-out ${
          createOrganization ? '' : 'invisible opacity-0'
        }`}
        onSubmit={createOrgForm.handleSubmit(onSubmit)}
      >
        <div className="relative h-[90vh] w-[450px] overflow-auto  rounded-3xl bg-white shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)]  ease-in-out ">
          <h1 className="py-3 text-center text-3xl font-bold tracking-tight">
            Create new Organization
          </h1>
          <div className="h-[1px] w-full bg-black "></div>
          <div className="align-center mt-[12px] flex  justify-center px-10">
            {createOrgForm.watch('imageId') ? (
              <CldImage
                width="100"
                height="100"
                src={createOrgForm.watch('imageId')!}
                alt="Avatar logo"
                className="h-[100px] w-[100px] rounded-full"
              />
            ) : (
              <Image
                width={100}
                height={100}
                src="/default_logo.png"
                alt="Avatar Logo"
                className="h-[100px] w-[100px] rounded-full"
              />
            )}
          </div>
          <div className="flex justify-center">
            <UploadButton
              className="my-3 cursor-pointer rounded-md bg-yellow px-8 py-2 text-lg font-medium"
              folder="org-logos"
              resourceType={ResourceType.IMAGE}
              onSuccess={onSuccessUpload}
            >
              Upload
            </UploadButton>
          </div>
          <div className="px-10 pb-4">
            <label htmlFor="organization-name" className=" text-xl font-bold ">
              Organization Name
            </label>
            <br />
            <input
              type="text"
              id="organization-name"
              placeholder="e.g Music Organization"
              className="mb-2 mt-1 h-9 border-[1px] border-green px-2  py-1 text-lg outline-none "
              {...createOrgForm.register('name')}
            />
            <br />
            <label htmlFor="org-category" className="text-xl font-bold">
              Category
            </label>
            <br />
            <select
              id="org-category"
              className="transparent mb-2 mt-1 h-9 border-[1px] border-green px-2 py-1  text-lg outline-none"
              {...createOrgForm.register('category')}
            >
              <option value="">Select a category</option>
              <option value={UserCategory.STUDENT_GOVERNING_BODY}>Student Governing Body</option>
              <option value={UserCategory.ACADEMIC_ORGANIZATION}>Academic Organization</option>
              <option value={UserCategory.NON_ACADEMIC_ORGANIZATION}>
                Non Academic Organization
              </option>
            </select>
            <div className="flex flex-col">
              <label htmlFor="org-description" className=" mb-2 text-xl font-bold">
                Description
              </label>
              <textarea
                name="organization-description"
                id="org-description"
                placeholder="Tell me about this organization"
                cols={30}
                rows={4}
                className="border border-green px-2 py-1 text-lg"
              ></textarea>
            </div>
            <div className="pt-3">
              <div className="mb-3 font-bold">
                NOTE:{'   '}
                <span className="font-normal">
                  Please provide the existing CVSU email address that you would like to grant
                  permission to.
                </span>
              </div>
              {fields.map((field, index) => (
                <div key={field.id} className="flex">
                  <div className="me-1 w-4/6">
                    <label htmlFor="email-address" className=" text-xl font-bold">
                      Email
                    </label>
                    <br />
                    <input
                      type="text"
                      id="email-address"
                      placeholder="e.g music.organization@sample.com"
                      className=" mt-1 h-9 w-full border-[1px] border-green px-2  py-1 text-lg outline-none"
                      {...register(`organization.${index}.email`)}
                    />
                  </div>
                  <div className="w-2/6">
                    <label htmlFor="position" className=" text-xl font-bold">
                      Position
                    </label>
                    <br />
                    <select
                      id="position"
                      className="mt-1 h-9 w-full border-[1px] border-green px-2  py-1 text-lg outline-none"
                      {...register(`organization.${index}.position`)}
                    >
                      <option value="">Select a position</option>
                      <option value="">President</option>
                      <option value="">Vice President</option>
                      <option value="">Treasurer</option>
                      <option value="others">Others</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!(fields.length === 1)) {
                        remove(index);
                      }
                    }}
                    className={`ms-1 h-9 self-end px-2 py-1 text-lg ${
                      fields.length === 1
                        ? 'cursor-not-allowed bg-red/50 text-white/50'
                        : 'bg-red text-white'
                    }`}
                  >
                    Delete
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  append({ email: '', position: '' });
                }}
                className="my-2 w-full cursor-pointer rounded-md bg-yellow px-8 py-2 text-lg font-medium"
              >
                Add new email
              </button>
            </div>
          </div>
          <div>
            <div className="h-[1px] bg-gray"></div>
            <div className="my-3 flex justify-between px-10">
              <button
                type="button"
                className="cursor-pointer rounded-md bg-gray px-8 py-2 text-lg font-medium"
                onClick={() => setCreateOrganization(!createOrganization)}
              >
                Cancel
              </button>
              <button type="button" className=" rounded-md bg-yellow px-8 py-2 text-lg font-medium">
                Create
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
