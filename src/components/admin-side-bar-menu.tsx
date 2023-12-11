import { zodResolver } from '@hookform/resolvers/zod';
import { OrganizationCategory } from '@prisma/client';
import { CalendarCheck2, History, LayoutDashboard, Megaphone, Users } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useFieldArray, useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import { type z } from 'zod';
import { buttonVariants } from '~/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { cn } from '~/lib/utils';
import { paths } from '~/meta';
import { useSidebarStore } from '~/stores/sidebar';
import { api } from '~/utils/api';
import { announcementSchemas } from '~/zod-schemas/admin/announcement';
import { orgSchemas } from '~/zod-schemas/admin/org';
import { OrderBy } from '~/zod-schemas/shared/notification';
import NotificationAlert from './notification-alert';
import SelectAnnouncement from './select';
import { ResourceType, UploadButton, type OnSuccessUpload } from './upload-button';

type InputsAnnouncement = z.infer<typeof announcementSchemas.create>;
type InputsOrg = z.infer<typeof orgSchemas.create>;

export function AdminSideBarMenu2() {
  const utils = api.useContext();
  const getOrgQuery = api.admin.org.get.useQuery();
  const createOrgMutation = api.admin.org.create.useMutation({
    onSuccess: async () => {
      await utils.admin.org.get.invalidate({ includeReports: true });
    },
  });
  const organizationList = getOrgQuery.data ?? [];

  const createAnnouncementMutation = api.admin.announcement.create.useMutation({
    onSuccess: async () => {
      await utils.admin.announcement.get.invalidate({
        includeAudience: true,
        orderByDue: OrderBy.ASC,
      });
    },
  });

  const sidebarMenu = [
    { id: 1, name: 'Home', imageLink: '/home_icon.svg', urlLink: `${paths.ADMIN}` },
    {
      id: 2,
      name: 'Organizations',
      imageLink: '/organization_icon.png',
      urlLink: `${paths.ADMIN}${paths.ORGANIZATIONS}`,
    },
    {
      id: 3,
      name: 'Announcements',
      imageLink: '/announcement_white_icon.png',
      urlLink: `${paths.ADMIN}${paths.ANNOUNCEMENTS}`,
    },
    {
      id: 4,
      name: 'Logs',
      imageLink: '/log_icon.png',
      urlLink: `${paths.ADMIN}${paths.ORGANIZATION_REPORTS}${paths.LOGS}`,
    },
    {
      id: 5,
      name: 'Appointments',
      imageLink: '/Appointment_icon.svg',
      urlLink: `${paths.ADMIN}${paths.APPOINTMENTS}`,
    },
  ];

  const { asPath } = useRouter();
  const router = useRouter();

  const [showSidebar, setShowSidebar] = useState(true); // Toggle Sidebar

  const [createAnnouncement, setCreateAnnouncement] = useState(false); // Show Create Announcement Modal
  const [createDropdown, setCreateDropdown] = useState(false);
  const [createOrganization, setCreateOrganization] = useState(false); // Show Create Organization Modal

  const [logDropdown, setLogDropdown] = useState(false);

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
        } fixed top-[10vh] z-[100] h-[90vh] flex-col bg-green px-1 py-3 md:sticky`}
      >
        {/* SIDE BAR LINKS */}
        {sidebarMenu.map((item) => (
          <div key={item.id} className="">
            <button
              onClick={() => router.push(item.urlLink)}
              className={`flex w-full items-center gap-1 rounded-lg px-1 py-2 hover:bg-yellow ${
                asPath === item.urlLink ? 'bg-yellow' : ''
              }`}
            >
              <Image
                width={100}
                height={100}
                src={item.imageLink}
                alt={item.name}
                className="max-w-[20px]"
              />
              <div
                className={`rounded-md px-2 py-1 text-left text-lg  text-white ${
                  asPath === item.urlLink ? 'font-bold' : 'font-medium'
                }`}
              >
                {item.name}
              </div>
            </button>
          </div>
        ))}

        {/* SIDE BAR BUTTONS */}
        <div>
          <div className="relative">
            <button
              type="button"
              className={`${
                createDropdown ? 'bg-yellow' : 'rounded-lg'
              } flex w-full items-center gap-1  px-1 py-2 hover:bg-yellow`}
              onClick={() => {
                setCreateDropdown(!createDropdown);
              }}
            >
              <Image
                width={100}
                height={100}
                src="/create_icon.svg"
                alt="Create Icon"
                className="max-w-[20px]"
              />
              <div
                className={`rounded-md px-2 py-1 text-left text-lg text-white ${
                  createDropdown ? 'font-bold' : ''
                }`}
              >
                Create
              </div>
              <div className="flex w-full justify-end">
                <Image
                  width={100}
                  height={100}
                  src="/dropdown_icon.png"
                  alt="Dropdown Icon"
                  className={`${
                    createDropdown ? 'rotate-180 duration-300' : 'duration-300'
                  } max-w-[20px]`}
                />
              </div>
            </button>
            {createDropdown && (
              <div className="z-[100] flex flex-col  bg-gray/20 text-left text-lg font-medium">
                <div>
                  <button
                    type="button"
                    className={`flex w-full items-center gap-1 px-1 py-2 hover:bg-yellow/90 ${
                      createOrganization ? 'bg-yellow/90' : ''
                    }`}
                    onClick={() => {
                      return setCreateOrganization(!createOrganization);
                    }}
                  >
                    <Image
                      width={100}
                      height={100}
                      src="/organization_icon.png"
                      alt="Organization Icon"
                      className="max-w-[20px]"
                    />
                    <div
                      className={`rounded-md px-2 py-1 text-left text-lg text-white ${
                        createOrganization ? 'font-bold' : ''
                      }`}
                    >
                      Organization
                    </div>
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    className={`flex w-full items-center gap-1 px-1 py-2 hover:bg-yellow/90 ${
                      createAnnouncement ? 'bg-yellow/90' : ''
                    }`}
                    onClick={() => {
                      return setCreateAnnouncement(!createAnnouncement);
                    }}
                  >
                    <Image
                      width={100}
                      height={100}
                      src="/announcement_white_icon.png"
                      alt="Announcement Icon"
                      className="max-w-[20px]"
                    />
                    <div
                      className={`rounded-md px-2 py-1 text-left text-lg text-white ${
                        createAnnouncement ? 'font-bold' : ''
                      }`}
                    >
                      Announcement
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-1 h-[1px] w-full rounded bg-gray lg:my-2"></div>
        <div>
          <button
            type="button"
            onClick={() => router.push(paths.SIGN_OUT)}
            className={`flex w-full items-center gap-1 rounded-lg px-1 py-2 hover:bg-yellow`}
          >
            <Image
              width={100}
              height={100}
              src="/signout_icon.png"
              alt="Sign Out Icon"
              className="max-w-[20px]"
            />
            <div className="rounded-md px-2 py-1 text-left text-lg  text-white">Sign Out</div>
          </button>
        </div>
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
            <div className="my-3 flex w-fit items-center gap-2">
              <label className="hover:cursor-pointer">
                <input
                  className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-yellow checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-yellow checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-yellow checked:focus:bg-yellow checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-yellow dark:checked:after:bg-yellow dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                  type="checkbox"
                  role="switch"
                  {...createAnnouncementForm.register('hasReport')}
                />
                Report
              </label>
              <div className="group relative">
                <div className="h-5 w-5 rounded-full border bg-gray text-center text-sm font-bold">
                  ?
                </div>
                <div className="absolute left-0 hidden whitespace-nowrap rounded-md bg-gray px-2 py-1 text-sm font-medium group-hover:block">
                  If organization(s) are need to report linked to this announcement, enable this.
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

export default function AdminSidebarMenu() {
  const router = useRouter();
  const isSidebarExpanded = useSidebarStore((state) => state.isSidebarExpanded);

  const links = [
    { Icon: LayoutDashboard, name: 'Dashboard', href: paths.ADMIN },
    { Icon: CalendarCheck2, name: 'Appointments', href: `${paths.ADMIN}${paths.APPOINTMENTS}` },
    { Icon: Users, name: 'Organizations', href: `${paths.ADMIN}${paths.ORGANIZATIONS}` },
    { Icon: Megaphone, name: 'Announcements', href: `${paths.ADMIN}${paths.ANNOUNCEMENTS}` },
    { Icon: History, name: 'Logs', href: `${paths.ADMIN}${paths.AUTH_LOGS}` },
  ];

  return (
    <aside className="sticky top-14 z-50 flex h-[calc(100vh_-_3.5rem)] flex-col gap-1 bg-c-primary py-4 text-c-primary-foreground">
      <TooltipProvider delayDuration={0} disableHoverableContent>
        {links.map(({ Icon, name, href }) => (
          <Tooltip key={name}>
            <TooltipTrigger asChild>
              <Link
                href={href}
                className={cn(
                  buttonVariants({
                    variant: router.pathname === href ? 'c-secondary' : 'c-primary-ghost',
                  }),
                  'relative justify-start gap-2'
                )}
              >
                <Icon className="h-5 w-5 md:h-6 md:w-6" />{' '}
                {isSidebarExpanded && <span>{name}</span>}
              </Link>
            </TooltipTrigger>

            <TooltipContent side="right" hidden={isSidebarExpanded}>
              <p>{name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </aside>
  );
}
