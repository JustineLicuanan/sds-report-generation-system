import { FileUp, Trash2 } from 'lucide-react';
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

export default function MemberInformationPage() {
  const data = [
    {
      id: 1,
      position: 'President',
      name: 'John Doe',
    },
    {
      id: 2,
      position: 'Vice President',
      name: 'John Fox',
    },
  ];

  const [myData, setMyData] = useState(data);

  const router = useRouter();
  return (
    <>
      <Head>
        <title>{`My Organization Information ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />

      <main className="flex">
        {/* SIDE BAR*/}
        <OrganizationSideBarMenu />

        <div id="main-content" className="mx-4 my-4 flex w-full flex-col gap-4">
          <div className="text-2xl font-bold">[ORG] Members</div>
          {myData.map((data, index) => (
            <div key={index} className="flex justify-between border border-input p-2">
              <div className="text-lg font-bold">
                {data.position} -<span className="font-normal"> {data.name}</span>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setMyData(myData.filter((item) => item.id !== data.id));
                  }}
                  className="rounded-sm border border-red bg-red p-1 text-white active:scale-95"
                >
                  <Trash2 />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `${paths.ORGANIZATION}${paths.MY_ORGANIZATION}${paths.MEMBER_INFO}${paths.ADD_MEMBER}${paths.PRINT}`
                    )
                  }
                  className="rounded-sm border border-green bg-green p-1 text-white active:scale-95"
                >
                  <FileUp />
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() =>
                router.push(
                  `${paths.ORGANIZATION}${paths.MY_ORGANIZATION}${paths.MEMBER_INFO}${paths.ADD_MEMBER}`
                )
              }
              className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
            >
              Add Members
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
