import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
import { meta, paths } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { authRedirects } from '~/utils/auth-redirects';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.organization(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function CommunityExtensionServicesPage() {
  const [data, setData] = useState([
    {
      activity: '',
      date: '',
      location: '',
      shortDescription: '',
    },
  ]);

  const router = useRouter();
  return (
    <>
      <Head>
        <title>{`Community Extension Services ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />

      <main className="flex">
        {/* SIDE BAR*/}
        <OrganizationSideBarMenu />

        <div id="main-content" className="mx-4 my-4  w-full">
          <div className="text-2xl font-bold">Generate Community Extension Services</div>
          {data.map((map, index) => (
            <div key={index} className="my-4 flex flex-col justify-end gap-2">
              <div className="flex items-center gap-2">
                <label htmlFor="activity">Document Photo:</label>
                <input
                  type="file"
                  name=""
                  id="activity"
                  placeholder=""
                  className="rounded-sm border border-input bg-transparent px-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="activity">Activity:</label>
                <input
                  type="text"
                  name=""
                  id="activity"
                  placeholder=""
                  className="rounded-sm border border-input bg-transparent px-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="location">Location:</label>
                <input
                  type="text"
                  name=""
                  id="location"
                  placeholder=""
                  className="rounded-sm border border-input bg-transparent px-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="date">Date:</label>
                <input
                  type="date"
                  name=""
                  id="date"
                  placeholder=""
                  className="rounded-sm border border-input bg-transparent px-1"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="content-article">Short description:</label>
                <textarea
                  name=""
                  id="content-article"
                  placeholder="Short description"
                  cols={30}
                  rows={3}
                  className="rounded-sm border border-input px-1"
                ></textarea>
              </div>
            </div>
          ))}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                const newDataArray = [...data];
                newDataArray.pop(); // Remove the last item
                setData(newDataArray);
              }}
              className="rounded-sm border border-red bg-red px-3 text-white active:scale-95"
            >
              Remove Document
            </button>
            <button
              type="button"
              onClick={() => {
                data.push({
                  activity: '',
                  date: '',
                  location: '',
                  shortDescription: '',
                });
                setData([...data]);
              }}
              className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
            >
              Add document
            </button>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() =>
                router.push(
                  `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.ACCOMPLISHMENT_REPORT}${paths.TEMPLATE}`
                )
              }
              className="mt-4 rounded-sm border border-gray bg-gray px-3 active:scale-95"
            >
              Back
            </button>
            <button
              type="button"
              className="mt-4 rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
            >
              Save
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
