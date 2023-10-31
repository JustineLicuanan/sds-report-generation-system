import { zodResolver } from '@hookform/resolvers/zod';
import { UserCategory } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { type z } from 'zod';
import NavBar from '~/components/navigation-bar';
import SideBarMenu from '~/components/side-bar-menu';
import { meta } from '~/meta';
import { api } from '~/utils/api';
import { orgSchemas } from '~/zod-schemas/org';

type Inputs = z.infer<typeof orgSchemas.update>;

export default function EditInfoPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const getOrgQuery = api.admin.org.get.useQuery({ id: router.query.id as Inputs['id'] });
  const updateOrgMutation = api.admin.org.update.useMutation({
    onSuccess: (data) => {
      queryClient.setQueryData(getQueryKey(api.admin.org.get, { id: data.id }, 'query'), data);
    },
  });

  // VISIBILITY OF BUTTON
  const [visibility, setVisibility] = useState(true);

  const [showSignOut, setShowSignOut] = useState(false);

  const [confirmSignout, setConfirmSignOut] = useState('');

  const editInfoForm = useForm<Inputs>({
    resolver: zodResolver(orgSchemas.update),
    values: {
      id: getOrgQuery.data?.[0]?.id as Inputs['id'],
      name: getOrgQuery.data?.[0]?.name,
      email: getOrgQuery.data?.[0]?.email,
      image: getOrgQuery.data?.[0]?.image,
      description: getOrgQuery.data?.[0]?.description,
      category: getOrgQuery.data?.[0]?.category as Inputs['category'],
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (values) => {
    await updateOrgMutation.mutateAsync(values);
    alert('Org updated successfully!');
  };

  return (
    <>
      {/* HEADER */}
      <Head>
        <title>{`Edit Info ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <NavBar showNotificationButton={true} />
      <main className="flex">
        {/* SIDE BAR */}
        <SideBarMenu />

        {/* MAIN CONTENT */}

        <div className="mx-2 mt-4 h-[87vh] w-full ">
          <div className="relative mx-auto my-0  h-[87vh] max-w-5xl  rounded-3xl px-5 py-5 shadow-[0_4px_25px_0px_rgba(0,0,0,0.25)] md:px-9 ">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">Edit Info</h1>
            <form
              className="mx-auto my-0 flex max-w-2xl flex-col"
              onSubmit={editInfoForm.handleSubmit(onSubmit, (err) => console.log(err))}
            >
              {/* ORGANIZATION'S LOGO */}
              <div className="mb-2 mt-2 flex flex-col items-center">
                <Image
                  src={editInfoForm.watch('image') ?? '/default_logo.png'}
                  alt="Organization's Logo"
                  width={112}
                  height={112}
                  className="mb-3 me-1 flex  h-28 w-28 rounded-full bg-[#2A9134]"
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
                  visibility ? 'bg-[#d9d9d9]' : ''
                } mt-1 h-8 w-full border-[1px] border-[#2A9134] px-2 py-1  outline-none md:w-3/4`}
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
                  visibility ? 'bg-[#d9d9d9]' : 'bg-[#ffffff]'
                } me-2 h-8 w-full border-[1px] border-[#2A9134]  px-2 py-1 md:w-2/4`}
                disabled={visibility}
                {...editInfoForm.register('category')}
              >
                <option value="" disabled>
                  Select a category
                </option>
                {Object.values(UserCategory).map((category) => (
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
                  visibility ? 'bg-[#d9d9d9]' : ''
                } mt-1 h-8 w-full border-[1px] border-[#2A9134] px-2 py-1  outline-none md:w-3/4`}
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
                    visibility ? 'bg-[#d9d9d9]' : ''
                  } mt-1   border-[1px] border-[#2A9134] px-2  py-1 outline-none`}
                  rows={2}
                  readOnly={visibility}
                  {...editInfoForm.register('description')}
                ></textarea>
                <div className="bottom-2 right-2 my-2 flex justify-between">
                  <button
                    type="button"
                    className={`w-fit rounded-md bg-[#bb2124] px-4 py-2 text-lg font-medium text-white`}
                    onClick={() => setShowSignOut(true)}
                  >
                    Sign-out all devices
                  </button>

                  {/* SIGN OUT MODAL */}
                  {/*  */}

                  <div
                    className={`fixed left-0 top-0 z-[3]  flex h-full w-full items-center  justify-center bg-black/[.50] transition-opacity duration-300 ease-in-out ${
                      showSignOut ? '' : 'invisible opacity-0'
                    }`}
                  >
                    <div className="relative h-[433px] w-[450px]  rounded-3xl bg-white shadow-[0_4px_25px_0px_rgba(0,0,0,0.25)]">
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
                          className="mt-2 w-3/4 border border-[#2A9134] px-2 py-1 text-xl outline-none"
                          onChange={(e) => setConfirmSignOut(e.target.value)}
                          value={confirmSignout}
                        />
                      </div>
                      <div className="absolute bottom-0 left-7">
                        <button
                          type="button"
                          className="my-6 rounded-md bg-[#f7b205] px-8 py-2 text-lg font-medium"
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
                    } w-fit  rounded-md bg-[#f7b205] px-4 py-2 text-lg font-medium`}
                    onClick={() => setVisibility(!visibility)}
                  >
                    Edit Info
                  </button>
                  <button
                    type="submit"
                    className={`${
                      visibility ? 'hidden' : ''
                    } w-fit  rounded-md bg-[#f7b205] px-4 py-2 text-lg font-medium`}
                    onClick={() => setVisibility(!visibility)}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
