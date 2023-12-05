import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import AdminNavBar from '~/components/admin-navigation-bar';
import AdminSideBarMenu from '~/components/admin-side-bar-menu';
import TruncateWord from '~/components/truncate-word';
import { meta } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';
import { OrderBy } from '~/zod-schemas/shared/notification';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.admin(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function AnnouncementPage() {
  const utils = api.useContext();

  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);

  const getAnnouncementQuery = api.admin.announcement.get.useQuery({
    includeAudience: true,
    orderByDue: OrderBy.ASC,
  });
  const archiveAnnouncementMutation = api.admin.announcement.archive.useMutation({
    onSuccess: async () => {
      await utils.admin.announcement.get.invalidate({
        includeAudience: true,
        orderByDue: OrderBy.ASC,
      });
    },
  });

  async function archiveAnnouncementById(id: string) {
    await archiveAnnouncementMutation.mutateAsync({ id });
  }

  return (
    <>
      {/* HEADER */}
      <Head>
        <title>{`Announcements ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <AdminNavBar />
      <main className="flex">
        {/* SIDE BAR */}
        <AdminSideBarMenu />

        {/* MAIN CONTENT */}

        <div className="mx-3 my-4 w-full">
          <div className="mx-auto my-0 min-h-[87vh] max-w-5xl rounded-3xl px-5 py-5 shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)] md:px-9">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
              Announcements
            </h1>
            {/* LIST OF ANNOUNCEMENTS */}
            <div className="my-5 w-full">
              {getAnnouncementQuery?.data?.map((data, index) => (
                <button
                  type="button"
                  onClick={() => {
                    return setShowAnnouncement(!showAnnouncement), setSelectedNotification(data.id);
                  }}
                  className="mb-4 w-full bg-gray px-3 py-2 hover:bg-yellow"
                  key={index}
                >
                  <div className="flex justify-between py-2">
                    <div>
                      <h4 className="text-2xl font-semibold">{data.subject}</h4>
                    </div>
                    <div className="flex  text-xl">
                      <h4 className="font-semibold">Date started:</h4>
                      <div className="ms-1 text-xl font-medium">
                        {data.due?.toLocaleString('en-US', { timeZone: 'Asia/Manila' }) ?? 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="flex py-2 text-xl">
                    <h4 className="font-semibold">Description:</h4>
                    <div className="ms-1 text-xl font-medium">{data.description}</div>
                  </div>
                  <div className="flex py-2 text-xl">
                    <h4 className="font-semibold">Audience:</h4>
                    <div className="ms-1  text-justify font-medium">
                      <TruncateWord
                        text={data.audience.map(({ name }) => name).join(', ') ?? ''}
                        maxLength={70}
                        fontSize="text-xl"
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
      {showAnnouncement && selectedNotification !== null && (
        <div
          className={`fixed left-0 top-0 z-[999]  flex h-full w-full items-center  justify-center bg-black/[.50] transition-opacity duration-300 ease-in-out
         ${showAnnouncement ? '' : 'invisible opacity-0'}`}
        >
          <div
            className={`relative z-[5] h-fit w-[450px]  rounded-3xl bg-white shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)]  duration-300 ease-in-out `}
          >
            <button
              type="button"
              onClick={() => setShowAnnouncement(!showAnnouncement)}
              className="absolute right-4 top-4 text-xl hover:text-red"
            >
              ✖
            </button>
            <h1 className="py-3 text-center text-3xl font-bold tracking-tight">Announcement</h1>
            <div className="h-[1px] w-full bg-black "></div>
            <div className="px-3 py-2">
              <div className="flex py-2 text-xl">
                <h4 className="font-semibold">Date:</h4>
                <div className="ms-1 text-xl font-medium">
                  {getAnnouncementQuery?.data
                    ?.find(({ id }) => id === selectedNotification)
                    ?.due?.toLocaleString('en-US', { timeZone: 'Asia/Manila' }) ?? 'N/A'}
                </div>
              </div>
              <div className="flex py-2 text-xl">
                <h4 className="font-semibold">Description:</h4>
                <div className="ms-1 text-xl font-medium">
                  {
                    getAnnouncementQuery?.data?.find(({ id }) => id === selectedNotification)
                      ?.description
                  }
                </div>
              </div>
              <div className="flex py-2 text-xl">
                <h4 className="font-semibold">Audience:</h4>
                <div className="ms-1 text-xl font-medium">
                  {getAnnouncementQuery?.data
                    ?.find(({ id }) => id === selectedNotification)
                    ?.audience.map(({ name }) => name)
                    .join(', ')}
                </div>
              </div>
            </div>
            <div className="flex justify-between px-4">
              <button
                type="button"
                className="my-4 cursor-pointer rounded-md bg-red px-8 py-2 text-lg font-medium text-white"
                onClick={async () => {
                  await archiveAnnouncementById(selectedNotification);
                  setShowAnnouncement(!showAnnouncement);
                }}
              >
                Delete
              </button>
              {/* <button
                type="submit"
                className="my-4 cursor-pointer rounded-md bg-gray px-8 py-2 text-lg font-medium"
                onClick={() =>
                  router.push(
                    `${paths.ADMIN}${paths.ANNOUNCEMENTS}/${selectedNotification}${paths.EDIT_ANNOUNCEMENTS}`
                  )
                }
              >
                Update
              </button> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
