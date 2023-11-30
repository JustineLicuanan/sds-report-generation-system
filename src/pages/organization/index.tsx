import { LogType } from '@prisma/client';
import { type GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useState } from 'react';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
import Report from '~/components/report';
import { meta } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.organization(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function OrganizationPage() {
  // const logList = [
  //   {
  //     subjectId: 2023001,
  //     subject: 'Technology',
  //     category: 'Financial',
  //     date: '09/20/23',
  //     status: 'Pending',
  //   },
  //   {
  //     subjectId: 2023002,
  //     subject: 'Music',
  //     category: 'Financial',
  //     date: '09/21/23',
  //     status: 'Rejected',
  //   },
  //   {
  //     subjectId: 2023003,
  //     subject: 'Games',
  //     category: 'Financial',
  //     date: '09/22/23',
  //     status: 'Approved',
  //   },
  // ];

  const getLogQuery = api.shared.log.get.useQuery({ type: LogType.REPORT });
  const logList = getLogQuery.data ?? [];

  const getOrgQuery = api.shared.organization.get.useQuery();
  const org = getOrgQuery.data;
  // const [search, setSearch] = useState('');
  // const [status, setStatus] = useState('');
  const [date] = useState('');

  logList.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const { data: session } = useSession();

  // if (date.toLowerCase() === 'oldest') {
  //   logList.sort((a, b) => {
  //     return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  //   });
  // } else if (date.toLowerCase() === 'latest') {
  //   logList.sort((a, b) => {
  //     return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  //   });
  // }
  // const filtedData = logList.filter((item) => {
  //   return (
  //     (status.toLowerCase() === '' || item.status.toLowerCase().includes(status)) &&
  //     (search.toLowerCase() === '' || item.subject.toLowerCase().includes(search))
  //   );
  // });

  return (
    <>
      <Head>
        <title>{`Dashboard ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />

      <main className="flex">
        {/* SIDE BAR*/}
        <OrganizationSideBarMenu />

        <div id="main-content" className="mx-5 w-full md:mx-10 md:w-8/12">
          <div className="my-2 h-2 rounded-md bg-green"> </div>
          <div className="flex">
            <div className=" my-4 me-1 h-20 w-20 rounded-full bg-green md:h-24 md:w-24 lg:h-28 lg:w-28"></div>
            <div className="self-center">
              <div className="ms-4 text-lg font-bold md:text-xl lg:text-2xl">
                {org?.name} - {session?.user.name}
              </div>
              <div className="ms-12 text-sm font-semibold text-black/80 md:text-base lg:text-lg">
                {org?.category.replace(/_/g, ' ')}
              </div>
            </div>
          </div>
          <div className="my-2 h-2 rounded-md bg-green"> </div>
          <div>
            <h1 className=" my-2 text-3xl font-bold tracking-tight">Report</h1>
            <Report logs={logList} />
          </div>
          <div className="my-2 h-2 rounded-md bg-green"> </div>
        </div>
      </main>
    </>
  );
}
