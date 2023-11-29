import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
import Report from '~/components/report';
import { meta } from '~/meta';
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

export default function OrganizationPage() {
  const reports = [
    {
      subjectId: 2023001,
      subject: 'Technology',
      category: 'Financial',
      date: '09/20/23',
      status: 'Pending',
    },
    {
      subjectId: 2023002,
      subject: 'Music',
      category: 'Financial',
      date: '09/21/23',
      status: 'Rejected',
    },
    {
      subjectId: 2023003,
      subject: 'Games',
      category: 'Financial',
      date: '09/22/23',
      status: 'Approved',
    },
  ];

  // const [search, setSearch] = useState('');
  // const [status, setStatus] = useState('');
  const [date] = useState('');

  reports.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  if (date.toLowerCase() === 'oldest') {
    reports.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  } else if (date.toLowerCase() === 'latest') {
    reports.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }
  // const filtedData = reports.filter((item) => {
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
              <div className="ms-4 text-base font-extrabold md:text-lg lg:text-xl">
                Organization Name
              </div>
              <div className="ms-12 text-base font-extrabold md:text-lg lg:text-xl">Category</div>
            </div>
          </div>
          <div className="my-2 h-2 rounded-md bg-green"> </div>
          <div>
            <h1 className=" my-2 text-3xl font-bold tracking-tight">Report</h1>
            <Report reports={reports} />
          </div>
          <div className="my-2 h-2 rounded-md bg-green"> </div>
        </div>
      </main>
    </>
  );
}
