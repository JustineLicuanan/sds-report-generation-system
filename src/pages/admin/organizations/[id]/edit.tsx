import { zodResolver } from '@hookform/resolvers/zod';
import { OrganizationCategory } from '@prisma/client';
import { type GetServerSideProps } from 'next';
import { CldImage } from 'next-cloudinary';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { type z } from 'zod';
import AdminNavBar from '~/components/admin-navigation-bar';
import AdminSideBarMenu from '~/components/admin-side-bar-menu';
import { OrgMemberItem } from '~/components/org-member-item';
import { ResourceType, UploadButton, type OnSuccessUpload } from '~/components/upload-button';
import { UserPosition } from '~/enums/user-position';
import { meta } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';
import { orgSchemas } from '~/zod-schemas/admin/org';
import { userSchemas } from '~/zod-schemas/admin/user';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.admin(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

type UpdateOrgInputs = z.infer<typeof orgSchemas.update>;
type AddMemberInputs = z.infer<typeof userSchemas.create>;

export default function EditInfoPage() {
  const router = useRouter();
  const utils = api.useContext();

  const [visibility, setVisibility] = useState(true); // VISIBILITY OF BUTTON
  const [showSignOut, setShowSignOut] = useState(false); // ENABLE OR DISABLED SIGNOUT BUTTON
  const [confirmSignout, setConfirmSignOut] = useState(''); // CHECK IF THE INPUT BOX IS CORRECT
  const [successAlert, setSuccessAlert] = useState(false); // SHOW SUCCESS ALERT
  const [addOther, setAddOther] = useState(false);
  const [updateOther, setuUpdateOther] = useState(false);

  const getOrgQuery = api.admin.org.get.useQuery({
    id: router.query.id as UpdateOrgInputs['id'],
    includeMembers: true,
  });

  const updateOrgMutation = api.admin.org.update.useMutation({
    onSuccess: (data) => {
      utils.admin.org.get.invalidate({ id: getOrgQuery.data?.[0]?.id, includeMembers: true });
      setSuccessAlert(true);
    },
  });

  const updateOrgForm = useForm<UpdateOrgInputs>({
    resolver: zodResolver(orgSchemas.update),
    values: {
      id: router.query.id as UpdateOrgInputs['id'],
      name: getOrgQuery.data?.[0]?.name,
      category: getOrgQuery.data?.[0]?.category as UpdateOrgInputs['category'],
      description: getOrgQuery.data?.[0]?.description,
      image: getOrgQuery.data?.[0]?.image,
      imageId: getOrgQuery.data?.[0]?.imageId,
    },
  });

  const addMemberForm = useForm<AddMemberInputs>({
    resolver: zodResolver(userSchemas.create),
    values: {
      name: '',
      email: '',
      isActive: true,
      organization: {
        id: getOrgQuery.data?.[0]?.id ?? '',
        name: getOrgQuery.data?.[0]?.name ?? '',
      },
    },
  });

  const addMemberMutation = api.admin.user.create.useMutation({
    onSuccess: async (data) => {
      await utils.admin.org.invalidate();
      addMemberForm.reset(undefined, { keepDefaultValues: true });
      setSuccessAlert(true);
    },
  });

  const onSuccessUpload: OnSuccessUpload = (result) => {
    updateOrgForm.setValue('image', result.info?.secure_url);
    updateOrgForm.setValue('imageId', result.info?.public_id);
  };

  const onSubmit: SubmitHandler<UpdateOrgInputs> = async (values) => {
    if (!updateOrgForm.formState.isDirty) {
      setSuccessAlert(true);
      setVisibility(!visibility);
    } else {
      await updateOrgMutation.mutateAsync(values);
      setVisibility(!visibility);
    }
  };

  const onSubmitAddMember: SubmitHandler<AddMemberInputs> = async (values) => {
    await addMemberMutation.mutateAsync(values);
  };

  return (
    <>
      {/* HEADER */}
      <Head>
        <title>{`Organization Info ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <AdminNavBar />
      <main className="flex">
        {/* SIDE BAR */}
        <AdminSideBarMenu />

        {/* MAIN CONTENT */}

        <div className="mx-2 my-4  w-full ">
          <div className="relative mx-auto my-0 min-h-[87vh] max-w-5xl  rounded-3xl px-5 py-5 shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)] md:px-9 ">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
              Organization Profile
            </h1>
            <div className="mx-auto my-0 max-w-3xl">
              <form className="flex flex-col" onSubmit={updateOrgForm.handleSubmit(onSubmit)}>
                {/* ORGANIZATION'S LOGO */}
                <div className="mb-2 mt-2 flex flex-col items-center">
                  <div className="align-center mt-[12px] flex  justify-center px-10">
                    {updateOrgForm.watch('imageId') ? (
                      <CldImage
                        width="100"
                        height="100"
                        src={updateOrgForm.watch('imageId')!}
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
                      className="my-3 cursor-pointer rounded-md  bg-yellow px-8 py-2 text-lg font-medium"
                      folder="org-logos"
                      resourceType={ResourceType.IMAGE}
                      onSuccess={onSuccessUpload}
                    >
                      Upload
                    </UploadButton>
                  </div>
                </div>

                {/* ORGANIZATION NAME */}
                <label htmlFor="name" className=" text-lg font-bold">
                  Organization Name
                </label>
                <input
                  type="text"
                  id="name"
                  className={` ${
                    visibility ? 'bg-gray' : ''
                  } mt-1 h-8 w-full border-[1px] border-green px-2 py-1   md:w-2/4`}
                  readOnly={visibility}
                  {...updateOrgForm.register('name')}
                />
                {/* {editInfoForm.formState.isDirty} */}
                {/* CATEGORY */}
                <label htmlFor="category" className="mt-1 text-lg font-bold">
                  Category
                </label>
                <select
                  id="category"
                  className={`${
                    visibility ? 'bg-gray' : 'bg-[#ffffff]'
                  } me-2 h-8 w-full border-[1px] border-green  px-2 py-1 md:w-2/4`}
                  disabled={visibility}
                  {...updateOrgForm.register('category')}
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {Object.values(OrganizationCategory).map((category) => (
                    <option key={category} value={category}>
                      {category.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
                <label htmlFor="text-description" className="mt-1 text-lg font-bold">
                  Description
                </label>
                <div className="flex w-full flex-col md:w-4/5">
                  <textarea
                    id="text-description"
                    className={` ${
                      visibility ? 'bg-gray' : ''
                    } mt-1   border-[1px] border-green px-2  py-1 `}
                    rows={2}
                    readOnly={visibility}
                    {...updateOrgForm.register('description')}
                  />
                </div>

                <div className="my-2 flex justify-between">
                  <button
                    type="button"
                    className={`${
                      visibility ? '' : 'hidden'
                    } w-fit  rounded-md bg-yellow px-4 py-2 text-lg font-medium`}
                    onClick={() => setVisibility(!visibility)}
                  >
                    Edit Info
                  </button>

                  <button
                    type="submit"
                    className={`${
                      visibility ? 'hidden' : ''
                    } w-fit  rounded-md bg-green px-4 py-2 text-lg font-medium text-white`}
                  >
                    Save Changes
                  </button>
                </div>
              </form>

              <form
                onSubmit={addMemberForm.handleSubmit(onSubmitAddMember, (err) => {
                  console.log(err);
                })}
              >
                <div className="mb-1 mt-6 text-xl font-bold">Add a member:</div>
                <div className="flex gap-1">
                  <input
                    type="email"
                    id="email-address"
                    placeholder="Email"
                    className={`h-9 w-2/4 border-[1px] border-green px-2  py-1 text-lg `}
                    {...addMemberForm.register('email')}
                  />

                  <select
                    id="position"
                    className={`h-9 w-1/4 border-[1px] border-green bg-white px-2 py-1 text-lg`}
                    onChange={(e) => {
                      if (e.target.value === 'other') {
                        addMemberForm.setValue('name', '');
                        setAddOther(!addOther);
                      } else {
                        addMemberForm.setValue('name', e.target.value);
                        setAddOther(false);
                      }
                    }}
                  >
                    <option value="">Select a position</option>
                    {Object.values(UserPosition).map((position, index) => (
                      <option key={position} value={position}>
                        {position}
                      </option>
                    ))}
                    <option value="other">Other</option>
                  </select>

                  <input
                    type="text"
                    id="other"
                    className={`${
                      addOther ? '' : 'bg-gray'
                    } h-9 w-1/4 border-[1px] border-green  px-2  py-1 text-lg `}
                    disabled={!addOther}
                    {...addMemberForm.register('name')}
                  />
                </div>

                <button
                  type="submit"
                  className="my-2 w-full rounded-md bg-yellow  px-8 py-2 text-lg font-medium"
                >
                  Add new email
                </button>
              </form>

              <div className="mb-1 mt-6 text-xl font-bold">
                {getOrgQuery.data?.[0]?.name} Members
              </div>

              {getOrgQuery.data?.[0]?.members.map((member) => (
                <OrgMemberItem
                  key={member.id}
                  member={member}
                  orgId={getOrgQuery.data?.[0]?.id ?? ''}
                  setSuccessAlert={setSuccessAlert}
                />
              ))}
            </div>
          </div>
        </div>
        {successAlert && (
          <div
            id="alert-3"
            className="fixed bottom-[5%] left-[2%] z-[101] mb-4 flex items-center rounded-lg bg-blue-50 p-4 text-blue-800 shadow-[5px_5px_10px_0px_rgba(94,94,94,1)]"
            role="alert"
          >
            <svg
              className="h-4 w-4 flex-shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div className="ml-3 text-sm font-medium">Organization Updated Successfully</div>
            <button
              type="button"
              className="bg-green-50 text-green-500 hover:bg-green-200 focus:ring-green-400 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700 -mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg p-1.5 focus:ring-2"
              data-dismiss-target="#alert-3"
              aria-label="Close"
              onClick={() => setSuccessAlert(false)}
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-3 w-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          </div>
        )}
      </main>
    </>
  );
}
