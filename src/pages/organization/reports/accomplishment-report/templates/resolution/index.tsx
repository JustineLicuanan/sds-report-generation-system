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

export default function ResolutionPage() {
  const [data, setData] = useState([
    {
      title: '',
      content: '',
    },
  ]);

  const router = useRouter();
  return (
    <>
      <Head>
        <title>{`Resolution ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />

      <main className="flex">
        {/* SIDE BAR*/}
        <OrganizationSideBarMenu />

        <div id="main-content" className="mx-4 my-4  w-full">
          <div className="text-2xl font-bold">Generate Resolution</div>
          <div className="mt-8 flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <label htmlFor="select-appointee">Select Appointees:</label>
              <select
                name=""
                id="select-appointee"
                className="rounded-sm border border-input bg-transparent p-1"
              >
                <option value="">Select appointees</option>
                <option value="advisers">Advisers</option>
                <option value="committees">Committees</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="resu-no">Resolution No:</label>
              <input
                type="text"
                name=""
                id="resu-no"
                placeholder="XXX"
                className="rounded-sm border border-input bg-transparent px-1"
              />
            </div>

            <div className="mt-4 font-bold">Content</div>
            {data.map((map, index) => (
              <div key={index} className="my-1 flex flex-col justify-end gap-2">
                <input
                  type="text"
                  name=""
                  id="resu-no"
                  placeholder="WHEREAS"
                  className="rounded-sm border border-input bg-transparent px-1"
                />
                <textarea
                  name=""
                  id=""
                  placeholder="Content"
                  cols={30}
                  rows={3}
                  className="rounded-sm border border-input px-1"
                ></textarea>
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
                Remove content
              </button>
              <button
                type="button"
                onClick={() => {
                  data.push({
                    title: '',
                    content: '',
                  });
                  setData([...data]);
                }}
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Add content
              </button>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <label htmlFor="signed-date">Signed Date:</label>
              <input
                type="date"
                name=""
                id="signed-date"
                className="rounded-sm border border-input bg-transparent px-1"
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() =>
                router.push(
                  `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.ACCOMPLISHMENT_REPORT}`
                )
              }
              className="mt-4 rounded-sm border border-gray bg-gray px-3 active:scale-95"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() =>
                router.push(
                  `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.ACCOMPLISHMENT_REPORT}${paths.RESOLUTION}${paths.PRINT}`
                )
              }
              className="mt-4 rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
            >
              Generate
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
