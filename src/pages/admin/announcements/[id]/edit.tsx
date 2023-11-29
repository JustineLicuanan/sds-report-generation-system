import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminSideBarMenu from '~/components/admin-side-bar-menu';
import NavBar from '~/components/navigation-bar';
import SelectAnnouncement from '~/components/select';
import { meta, paths } from '~/meta';
import { api } from '~/utils/api';

export default function EditAnnouncement() {
  const getOrgQuery = api.admin.org.get.useQuery();
  const organizationList = getOrgQuery.data ?? [];

  const router = useRouter();
  return (
    <>
      {/* HEADER */}
      <Head>
        <title>{`Announcements ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <NavBar />
      <main className="flex">
        {/* SIDE BAR */}
        <AdminSideBarMenu />

        <div className="mx-2 my-4  w-full ">
          <div className="relative mx-auto my-0 min-h-[87vh] max-w-5xl  rounded-3xl px-5 py-5 shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)] md:px-9 ">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
              Edit Announcement
            </h1>
            <div className="mx-auto my-0 flex max-w-2xl flex-col">
              <div className="flex flex-col px-10 py-5 ">
                <label htmlFor="audience-list" className="text-xl font-bold">
                  Audience
                </label>
                <SelectAnnouncement organization={organizationList} />
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
                    className="rounded-md bg-gray px-8 py-2 text-lg font-medium"
                    onClick={() => router.push(`${paths.ADMIN}${paths.ANNOUNCEMENTS}`)}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="rounded-md bg-yellow px-8 py-2 text-lg font-medium"
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
