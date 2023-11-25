import { zodResolver } from '@hookform/resolvers/zod';
import { OrganizationCategory } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { type z } from 'zod';
import AdminSideBarMenu from '~/components/admin-side-bar-menu';
import NavBar from '~/components/navigation-bar';
import { meta } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';
import { orgSchemas } from '~/zod-schemas/admin/org';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.admin(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

type Inputs = z.infer<typeof orgSchemas.update>;

export default function EditInfoPage() {
  const router = useRouter();

  const [visibility, setVisibility] = useState(true); // VISIBILITY OF BUTTON
  const [showSignOut, setShowSignOut] = useState(false); // ENABLE OR DISABLED SIGNOUT BUTTON
  const [confirmSignout, setConfirmSignOut] = useState(''); // CHECK IF THE INPUT BOX IS CORRECT
  const [successAlert, setSuccessAlert] = useState(false); // SHOW SUCCESS ALERT

  const queryClient = useQueryClient();
  const getOrgQuery = api.admin.org.get.useQuery({ id: router.query.id as Inputs['id'] });
  const updateOrgMutation = api.admin.org.update.useMutation({
    onSuccess: (data) => {
      queryClient.setQueryData(getQueryKey(api.admin.org.get, { id: data.id }, 'query'), data);
      setSuccessAlert(true);
    },
  });
  const hasSessionsOrgQuery = api.admin.org.countSessions.useQuery({
    id: router.query.id as Inputs['id'],
  });
  const editInfoForm = useForm<Inputs>({
    resolver: zodResolver(orgSchemas.update),
    values: {
      id: router.query.id as Inputs['id'],
      name: getOrgQuery.data?.[0]?.name,
      email: getOrgQuery.data?.[0]?.email,
      image: getOrgQuery.data?.[0]?.image,
      imageId: getOrgQuery.data?.[0]?.imageId,
      description: getOrgQuery.data?.[0]?.description,
      category: getOrgQuery.data?.[0]?.category as Inputs['category'],
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (values) => {
    await updateOrgMutation.mutateAsync(values);
  };

  return (
    <>
      {/* HEADER */}
      <Head>
        <title>{`Organization Info ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <NavBar showNotificationButton={true} />
      <main className="flex">
        {/* SIDE BAR */}
        <AdminSideBarMenu />

        {/* MAIN CONTENT */}

        <div className="mx-2 my-4 min-h-[87vh] w-full ">
          <div className="relative mx-auto my-0 max-w-5xl  rounded-3xl px-5 py-5 shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)] md:px-9 ">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
              Organization Profile
            </h1>
            <form
              className="mx-auto my-0 flex max-w-2xl flex-col"
              onSubmit={editInfoForm.handleSubmit(onSubmit)}
            >
              {/* ORGANIZATION'S LOGO */}
              <div className="mb-2 mt-2 flex flex-col items-center">
                <Image
                  src={editInfoForm.watch('image') ?? '/default_logo.png'}
                  alt="Organization's Logo"
                  width={112}
                  height={112}
                  className="mb-3 me-1 flex  h-28 w-28 rounded-full bg-green"
                />
                <h2 className="mb-2 text-xl font-bold">Logo</h2>
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
                } mt-1 h-8 w-full border-[1px] border-green px-2 py-1  outline-none md:w-2/4`}
                readOnly={visibility}
                {...editInfoForm.register('name')}
              />

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
                {...editInfoForm.register('category')}
              >
                <option value="" disabled>
                  Select a category
                </option>
                {Object.values(OrganizationCategory).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* NOTE */}
              <div className="text-sn mb-1 mt-2 w-full font-bold md:w-2/4">
                NOTE:{'   '}
                <span className="text-sm font-normal">
                  Please provide the existing CVSU email address that you would like to grant
                  permission to.
                </span>
              </div>

              {/* EMAIL */}
              <label htmlFor="email-address" className=" text-lg font-bold">
                Email
              </label>
              <input
                type="email"
                id="email-address"
                className={` ${
                  visibility ? 'bg-gray' : ''
                } mt-1 h-8 w-full border-[1px] border-green px-2 py-1  outline-none md:w-2/4`}
                readOnly={visibility}
                {...editInfoForm.register('email')}
              />

              <label htmlFor="text-description" className="mt-1 text-lg font-bold">
                Description
              </label>
              <div className="flex w-full flex-col md:w-4/5">
                <textarea
                  id="text-description"
                  className={` ${
                    visibility ? 'bg-gray' : ''
                  } mt-1   border-[1px] border-green px-2  py-1 outline-none`}
                  rows={2}
                  readOnly={visibility}
                  {...editInfoForm.register('description')}
                ></textarea>
                <div className="my-2 flex justify-between">
                  <button
                    type="button"
                    className={`${
                      hasSessionsOrgQuery.data === 0
                        ? 'bg-[#bb2124]/40 text-white/50'
                        : 'bg-[#bb2124] text-white'
                    } w-fit rounded-md bg-[#bb2124] px-4 py-2 text-lg font-medium text-white`}
                    onClick={() => setShowSignOut(true)}
                    disabled={!hasSessionsOrgQuery.data}
                  >
                    Sign-out all devices
                  </button>

                  {/* SIGN OUT MODAL */}
                  <div
                    className={`${
                      showSignOut ? '' : 'invisible opacity-0'
                    } fixed left-0 top-0 z-[3]  flex h-full w-full items-center  justify-center bg-black/[.50] transition-opacity duration-300 ease-in-out `}
                  >
                    <div className="relative h-[433px] w-[450px]  rounded-3xl bg-white shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)]">
                      <h1 className="py-3 text-center text-3xl font-bold tracking-tight text-[#bb2124]">
                        {/*  */}
                        Sign-out all devices
                      </h1>
                      <div className="h-[1px] w-full bg-black "></div>
                      <div className="mt-5 flex flex-col items-center px-2">
                        <div className="rounded-full bg-[#bb2124]/20 p-3 ">
                          <Image
                            src="/danger_icon.png"
                            alt="Danger Icon"
                            width={50}
                            height={50}
                            className="-mt-2"
                          />
                        </div>
                        <div className="mt-2 px-5 text-2xl font-bold">Are you sure?</div>
                        <div className="text-center text-xl font-medium text-black/70">
                          If you select yes, all the devices will be sign-out.
                        </div>
                        <label
                          htmlFor="signout-confirmation"
                          className="mt-10 text-center text-xl font-medium"
                        >
                          To continue, please type{' '}
                          <span className="text-xl font-bold text-[#bb2124]">
                            &quot;{getOrgQuery.data?.[0]?.name}&quot;
                          </span>
                        </label>
                        <input
                          type="text"
                          name="signout-confirmation"
                          id="signout-confirmation"
                          className="mt-2 w-3/4 border border-green px-2 py-1 text-xl outline-none"
                          onChange={(e) => setConfirmSignOut(e.target.value)}
                          value={confirmSignout}
                        />
                      </div>
                      <div className="absolute bottom-0 left-7">
                        <button
                          type="button"
                          className="my-6 rounded-md bg-yellow px-8 py-2 text-lg font-medium"
                          onClick={() => {
                            setConfirmSignOut('');
                            setShowSignOut(false);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="absolute bottom-0 right-7">
                        <button
                          type="button"
                          className={`${
                            confirmSignout === getOrgQuery.data?.[0]?.name
                              ? 'bg-[#bb2124] text-white'
                              : 'bg-[#bb2124]/40 text-white/50'
                          } my-6 rounded-md px-8 py-2 text-lg font-medium `}
                          disabled={!(confirmSignout === getOrgQuery.data?.[0]?.name)}
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  </div>

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
                    } w-fit  rounded-md bg-yellow px-4 py-2 text-lg font-medium`}
                    onClick={() => setVisibility(!visibility)}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        {successAlert && (
          <div
            id="alert-3"
            className="bg-green-50 text-green-800 dark:bg-gray-800 dark:text-green-400 absolute bottom-[5%] left-[2%] z-[2] mb-4 flex items-center rounded-lg p-4"
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
