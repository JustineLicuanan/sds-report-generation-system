import { zodResolver } from '@hookform/resolvers/zod';
import { OrganizationCategory } from '@prisma/client';
import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useFieldArray, useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import { type z } from 'zod';
import { paths } from '~/meta';
import { api } from '~/utils/api';
import { announcementSchemas } from '~/zod-schemas/admin/announcement';
import { orgSchemas } from '~/zod-schemas/admin/org';
import NotificationAlert from './notification-alert';
import SelectAnnouncement from './select';
import { ResourceType, UploadButton, type OnSuccessUpload } from './upload-button';
import { OrderBy } from '~/zod-schemas/shared/notification';

type InputsAnnouncement = z.infer<typeof announcementSchemas.create>;
type InputsOrg = z.infer<typeof orgSchemas.create>;

export default function AdminSideBarMenu() {
  const utils = api.useContext();
  const getOrgQuery = api.admin.org.get.useQuery();
  const createOrgMutation = api.admin.org.create.useMutation();
  const organizationList = getOrgQuery.data ?? [];

  const createAnnouncementMutation = api.admin.announcement.create.useMutation({
    onSuccess: () => {
      utils.admin.announcement.get.invalidate({ includeAudience: true, orderByDue: OrderBy.ASC });
    },
  });

  const sidebarMenu = [
    { id: 1, name: 'Home', imageLink: '/home_icon.svg', urlLink: `${paths.ADMIN}` },
    {
      id: 2,
      name: 'Organizations',
      imageLink: '/organizations_icon.svg',
      urlLink: `${paths.ADMIN}${paths.ORGANIZATIONS}`,
    },
    {
      id: 3,
      name: 'Announcement',
      imageLink: '/announcement_icon.svg',
      urlLink: `${paths.ADMIN}${paths.ANNOUNCEMENTS}`,
    },
  ];

  const { asPath } = useRouter();
  const router = useRouter();

  const [showSidebar, setShowSidebar] = useState(true); // Toggle Sidebar

  const [createAnnouncement, setCreateAnnouncement] = useState(false); // Show Create Announcement Modal
  const [createDropdown, setCreateDropdown] = useState(false);
  const [createOrganization, setCreateOrganization] = useState(false); // Show Create Organization Modal

  const [logDropdown, setLogDropdown] = useState(false);
  const sideBarButtons = [
    {
      name: 'Log',
      imageLink: '/log_icon.svg',
      value: logDropdown,
      function: setLogDropdown,
    },
    {
      name: 'Create',
      imageLink: '/create_icon.svg',
      value: createDropdown,
      function: setCreateDropdown,
    },
  ];

  const createOrgForm = useForm<InputsOrg>({
    resolver: zodResolver(orgSchemas.create),
    defaultValues: { members: [{ email: '', name: '' }] },
  });
  const createAnnouncementForm = useForm<InputsAnnouncement>({
    resolver: zodResolver(announcementSchemas.create),
    defaultValues: { audience: [] },
  });

  const membersFieldArray = useFieldArray({
    name: 'members',
    control: createOrgForm.control,
  });

  const onSuccessUpload: OnSuccessUpload = (result) => {
    createOrgForm.setValue('image', result.info?.secure_url);
    createOrgForm.setValue('imageId', result.info?.public_id);
  };

  const onSubmitAnnouncement: SubmitHandler<InputsAnnouncement> = async (values) => {
    await createAnnouncementMutation.mutateAsync(values);
    toast.success('Created Announcement Successfully!', {
      position: 'bottom-right',
    });
    setCreateAnnouncement(!createAnnouncement);
    createAnnouncementForm.reset(undefined, { keepDefaultValues: true });
  };

  const onSubmitOrg: SubmitHandler<InputsOrg> = async (values) => {
    try {
      await createOrgMutation.mutateAsync(values);
      toast.success('Created Organization Successfully!', {
        position: 'bottom-right',
      });
      createOrgForm.reset(undefined, { keepDefaultValues: true });
      setCreateOrganization(!createOrganization);
    } catch (error) {
      toast.error('Creating Organization Failed!', {
        position: 'bottom-right',
      });
      createOrgForm.reset(undefined, { keepDefaultValues: true });
      setCreateOrganization(!createOrganization);
    }
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
        } sticky top-20 z-[100] my-2 ml-1 h-[90vh] flex-col items-center bg-green px-1 md:sticky md:my-3 md:ml-2  md:h-[87vh] lg:ml-3`}
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
        <div>
          <div className="relative">
            <button
              type="button"
              className="group  mt-1 flex h-10 w-10 items-center justify-center rounded-md bg-gray p-1 hover:bg-yellow md:mx-1 lg:mt-2 lg:h-12 lg:w-12"
              onClick={() => {
                if (createDropdown) {
                  setCreateDropdown(!createDropdown);
                }
                setLogDropdown(!logDropdown);
              }}
            >
              <Image
                width={100}
                height={100}
                src="/log_icon.svg"
                alt="Logs"
                className="h-12 w-fit hover:scale-105"
              />
              <div className="absolute left-12 hidden rounded-md bg-gray px-2 py-1 text-left text-lg font-medium group-hover:block lg:left-16 lg:text-xl">
                Logs
              </div>
            </button>
            {logDropdown && (
              <div className="absolute -bottom-[75%] left-12 z-[100] flex flex-col rounded-sm bg-gray text-left text-lg font-medium shadow-[5px_5px_10px_0px_rgba(94,94,94,1)]">
                <button
                  type="button"
                  className="px-2 py-1 text-lg font-medium hover:bg-yellow"
                  onClick={() =>
                    router.push(`${paths.ADMIN}${paths.ORGANIZATION_REPORTS}${paths.LOGS}`)
                  }
                >
                  Reports
                </button>
                <button
                  type="button"
                  className="px-2 py-1 text-lg font-medium hover:bg-yellow"
                  onClick={() => router.push(`${paths.ADMIN}${paths.AUTH_LOGS}`)}
                >
                  Auth
                </button>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              type="button"
              className="group  mt-1 flex h-10 w-10 items-center justify-center rounded-md bg-gray p-1 hover:bg-yellow md:mx-1 lg:mt-2 lg:h-12 lg:w-12"
              onClick={() => {
                if (logDropdown) {
                  setLogDropdown(!logDropdown);
                }
                setCreateDropdown(!createDropdown);
              }}
            >
              <Image
                width={100}
                height={100}
                src="/create_icon.svg"
                alt="Create Icon"
                className="h-12 w-fit hover:scale-105"
              />
              <div className="absolute left-12 hidden rounded-md bg-gray px-2 py-1 text-left text-lg font-medium group-hover:block lg:left-16 lg:text-xl">
                Create
              </div>
            </button>
            {createDropdown && (
              <div className="absolute -bottom-[75%] left-12 z-[100] flex flex-col rounded-sm bg-gray text-left text-lg font-medium shadow-[5px_5px_10px_0px_rgba(94,94,94,1)]">
                <button
                  type="button"
                  className="px-2 py-1 text-lg font-medium hover:bg-yellow"
                  onClick={() => {
                    return (
                      setCreateOrganization(!createOrganization), setCreateDropdown(!createDropdown)
                    );
                  }}
                >
                  Organization
                </button>
                <button
                  type="button"
                  className="px-2 py-1 text-lg font-medium hover:bg-yellow"
                  onClick={() => {
                    return (
                      setCreateAnnouncement(!createAnnouncement), setCreateDropdown(!createDropdown)
                    );
                  }}
                >
                  Announcement
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-1 h-[4px] w-full rounded bg-gray lg:mt-2"></div>
        <Link
          href={paths.SIGN_OUT}
          className={`group relative mt-1 flex h-10 w-10 items-center justify-center rounded-md bg-gray p-1 hover:bg-yellow md:mx-1  lg:mt-2 lg:h-12 lg:w-12`}
        >
          <Image
            width={100}
            height={100}
            src="/signout_icon.svg"
            alt="Sign Out Icon"
            className="h-10 w-fit hover:scale-105 lg:h-12"
          />
          <div className="absolute left-12 hidden whitespace-nowrap rounded-md bg-gray px-2 py-1 text-left text-lg font-medium group-hover:block lg:left-16 lg:text-xl">
            Sign Out
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
        <form
          className={`relative z-[5] h-fit w-[450px] rounded-3xl bg-white shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)]  duration-300 ease-in-out`}
          onSubmit={createAnnouncementForm.handleSubmit(onSubmitAnnouncement)}
        >
          <button
            type="button"
            onClick={() => setCreateAnnouncement(!createAnnouncement)}
            className="absolute right-4 top-4 text-xl hover:text-red"
          >
            ✖
          </button>
          <h1 className="px-10 py-3 text-3xl font-bold tracking-tight">Create new Announcement</h1>
          <div className="h-[1px] w-full bg-black "></div>
          <div className="flex flex-col px-10 py-5 ">
            <label htmlFor="audience-list" className="text-xl font-bold">
              Audience
            </label>
            <SelectAnnouncement
              organization={organizationList}
              selectedValues={createAnnouncementForm.watch('audience')}
              setSelectedValues={(newSelectedValues) =>
                createAnnouncementForm.setValue('audience', newSelectedValues)
              }
            />
            <div className="mt-1 flex  justify-between">
              <div>
                <label htmlFor="date-start" className="text-xl font-bold">
                  Date Start
                </label>
                <br />
                <input
                  type="date"
                  id="date-start"
                  className="mb-2 mt-1 h-9 border-[1px] border-green px-2  py-1 text-lg"
                  onChange={(e) => {
                    createAnnouncementForm.setValue(
                      'start',
                      e.target.value ? new Date(e.target.value).toISOString() : undefined
                    );
                  }}
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
                  id="date-end"
                  className="mb-2 mt-1 h-9 border-[1px] border-green px-2  py-1 text-lg  "
                  onChange={(e) => {
                    createAnnouncementForm.setValue(
                      'due',
                      e.target.value ? new Date(e.target.value).toISOString() : undefined
                    );
                  }}
                />
              </div>
            </div>
            <label htmlFor="announcement-subject" className="text-xl font-bold ">
              Subject
            </label>
            <input
              type="text"
              id="announcement-subject"
              placeholder="Subject"
              className="mb-2 mt-1 h-9 border-[1px] border-green px-2  py-1 text-lg  "
              {...createAnnouncementForm.register('subject')}
            />
            <label htmlFor="announcement-description" className="mb-2 text-xl font-bold">
              Description
            </label>
            <textarea
              id="org-description"
              placeholder="Announcement description"
              rows={3}
              className="border border-green px-2 py-1 text-lg"
              {...createAnnouncementForm.register('description')}
            ></textarea>
            <div className="mt-3 flex w-fit gap-2">
              <label className="relative mb-5 inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  value=""
                  className="peer sr-only"
                  {...createAnnouncementForm.register('hasReport')}
                />
                <div className="peer-focus: peer h-5 w-9  rounded-full bg-gray after:absolute after:start-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray after:bg-white after:transition-all after:content-[''] peer-checked:bg-yellow peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-1 peer-focus:ring-yellow rtl:peer-checked:after:-translate-x-full dark:border-gray dark:bg-gray dark:peer-focus:ring-blue-800"></div>
                <span className="ms-3 text-sm font-bold text-black/80">Has report </span>
              </label>
              <div className="group relative">
                <div className="h-5 w-5 rounded-full border bg-gray text-center text-sm font-bold">
                  ?
                </div>
                <div className="absolute left-0 hidden whitespace-nowrap rounded-md bg-gray px-2 py-1 text-sm font-medium group-hover:block">
                  Some description
                </div>
              </div>
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
              <button type="submit" className="rounded-md bg-yellow px-8 py-2 text-lg font-medium">
                Create
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* CREATE ORGANIZATION */}
      <form
        className={`fixed left-0 top-0 z-[999]  flex h-full w-full items-center  justify-center bg-black/[.50] px-4 transition-opacity duration-300 ease-in-out ${
          createOrganization ? '' : 'invisible opacity-0'
        }`}
        onSubmit={createOrgForm.handleSubmit(onSubmitOrg, (err) => console.log(err))}
      >
        <div className="relative h-[90vh] w-[450px] overflow-auto  rounded-3xl bg-white shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)]  ease-in-out ">
          <button
            type="button"
            onClick={() => setCreateOrganization(!createOrganization)}
            className="absolute right-4 top-4 text-xl hover:text-red"
          >
            ✖
          </button>
          <h1 className="px-10 py-3 text-3xl font-bold tracking-tight">Create new Organization</h1>
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
              className="mb-2 mt-1 h-9 border-[1px] border-green px-2  py-1 text-lg "
              {...createOrgForm.register('name')}
            />
            <br />
            <label htmlFor="org-category" className="text-xl font-bold">
              Category
            </label>
            <br />
            <select
              id="org-category"
              className="transparent mb-2 mt-1 h-9 border-[1px] border-green px-2 py-1  text-lg "
              {...createOrgForm.register('category')}
            >
              <option value="">Select a category</option>
              {Object.values(OrganizationCategory).map((category, index) => (
                <option key={index} value={category}>
                  {category.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            <div className="flex flex-col">
              <label htmlFor="org-description" className=" mb-2 text-xl font-bold">
                Description
              </label>
              <textarea
                id="org-description"
                placeholder="Tell me about this organization"
                cols={30}
                rows={4}
                className="border border-green px-2 py-1 text-lg"
                {...createOrgForm.register('description')}
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
              {membersFieldArray.fields.map((field, index) => (
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
                      className=" mt-1 h-9 w-full border-[1px] border-green px-2  py-1 text-lg "
                      {...createOrgForm.register(`members.${index}.email`)}
                    />
                  </div>
                  <div className="w-2/6">
                    <label htmlFor="position" className=" text-xl font-bold">
                      Position
                    </label>
                    <br />
                    <select
                      id="position"
                      className="mt-1 h-9 w-full border-[1px] border-green px-2  py-1 text-lg "
                      {...createOrgForm.register(`members.${index}.name`)}
                    >
                      <option value="">Select a position</option>
                      <option value="President">President</option>
                      <option value="Vice President">Vice President</option>
                      <option value="Treasurer">Treasurer</option>
                      <option value="others">Others</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!(membersFieldArray.fields.length === 1)) {
                        membersFieldArray.remove(index);
                      }
                    }}
                    className={`ms-1 h-9 self-end px-2 py-1 text-lg ${
                      membersFieldArray.fields.length === 1
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
                  membersFieldArray.append({ email: '', name: '' });
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
              <button type="submit" className=" rounded-md bg-yellow px-8 py-2 text-lg font-medium">
                Create
              </button>
            </div>
          </div>
        </div>
      </form>
      <NotificationAlert />
    </>
  );
}
