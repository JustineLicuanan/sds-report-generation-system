import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import NavBar from '~/components/navigation-bar';
import SideBarMenu from '~/components/side-bar-menu';
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

export default function UserLogPage() {
  const userLogData = [
    {
      subjectId: 2023001,
      subject: 'Technology',
      dateCreated: '2023-10-01',
      date: '09/20/23',
      status: 'For approval',
    },
    {
      subjectId: 2023002,
      subject: 'Music',
      dateCreated: '2023-10-01',
      date: '09/21/23',
      status: 'Rejected',
    },
    {
      subjectId: 2023003,
      subject: 'Games',
      dateCreated: '2023-10-01',
      date: '09/22/23',
      status: 'Approved',
    },
  ];

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');

  userLogData.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  if (date.toLowerCase() === 'oldest') {
    userLogData.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  } else if (date.toLowerCase() === 'latest') {
    userLogData.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }
  const filtedData = userLogData.filter((item) => {
    return (
      (status.toLowerCase() === '' || item.status.toLowerCase().includes(status)) &&
      (search.toLowerCase() === '' || item.subject.toLowerCase().includes(search))
    );
  });

  return (
    <>
      {/* HEADER */}
      <Head>
        <title>{`Logs ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <NavBar showNotificationButton={true} />
      <main className="flex">
        {/* SIDE BAR */}
        <SideBarMenu />

        {/* MAIN CONTENT */}

        <div className="mx-3 mt-4 h-[87vh] w-full overflow-hidden">
          <div className="mx-auto my-0 h-[87vh] max-w-5xl   rounded-3xl px-5 py-5 shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)] md:px-9">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">Log</h1>
            <div className="my-4 flex flex-col md:my-6 md:flex-row">
              {/* SEARCH */}
              <div className="flex">
                <label
                  htmlFor="search-item"
                  className="flex h-7 w-7  items-center border-[1px]  border-r-0 border-green px-2 md:h-9 md:w-9 lg:h-11 lg:w-11"
                >
                  <Image
                    width={100}
                    height={100}
                    src="/search_icon.svg"
                    className="w-fit md:h-full"
                    alt="Search Icon"
                  />
                </label>
                <input
                  type="text"
                  name="search"
                  id="search-item"
                  placeholder="Search subject name"
                  className="h-7 border-[1px] border-green px-2 py-1 outline-none md:h-9 md:text-lg lg:h-11 lg:text-xl"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {/* SORT BY DATE */}
              <div className="mt-3 md:ms-5 md:mt-0">
                <select
                  name="sort-date"
                  id="sort-date"
                  className="me-2 h-7 border-[1px] border-green bg-white px-2 py-1 text-sm md:h-9 md:text-base lg:h-11"
                  onChange={(e) => setDate(e.target.value)}
                >
                  <option value="latest" className="text-sm md:text-base">
                    Sort by Date (Latest)
                  </option>
                  <option value="oldest" className="text-sm md:text-base">
                    Sort by Date (Oldest)
                  </option>
                </select>

                {/* SORT BY STATUS */}
                <select
                  name="sort-status"
                  id="sort-status"
                  className="h-7 border-[1px] border-green bg-white px-2 py-1 text-sm md:h-9 md:text-base lg:h-11"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="" className="text-sm md:text-base">
                    Filter Status (All)
                  </option>
                  <option value="for approval" className="text-sm md:text-base">
                    Pending
                  </option>
                  <option value="approved" className="text-sm md:text-base">
                    Approved
                  </option>
                  <option value="rejected" className="text-sm md:text-base">
                    Rejected
                  </option>
                </select>
              </div>
            </div>

            <div className="overflow-x-scroll sm:overflow-hidden">
              <table
                id="myTable"
                className="w-full min-w-max border-collapse  border border-black text-center "
              >
                <thead>
                  <tr>
                    <th className=" border-r-0 border-black bg-green px-2 py-2 text-base font-bold tracking-tight text-white md:text-lg lg:text-xl">
                      Subject Id
                    </th>
                    <th className=" border-r-0 border-black bg-green px-2 py-2 text-base font-bold tracking-tight text-white md:text-lg lg:text-xl">
                      Subject
                    </th>
                    <th className=" border-r-0 border-black bg-green px-2 py-2 text-base font-bold tracking-tight text-white md:text-lg lg:text-xl">
                      Created on
                    </th>
                    <th className=" border-r-0 border-black bg-green px-2 py-2 text-base font-bold tracking-tight text-white md:text-lg lg:text-xl">
                      Date
                    </th>
                    <th className=" border-r-0 border-black bg-green px-2 py-2 text-base font-bold tracking-tight text-white md:text-lg lg:text-xl">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtedData.map((data) => (
                    <tr key={data.subjectId} className=" even:bg-[#808080]/20">
                      <td className="border border-x-0 border-black px-2 py-4 text-sm md:text-base">
                        {data.subjectId}
                      </td>
                      <td className="border border-x-0 border-black px-2 py-4 text-sm md:text-base">
                        {data.subject}
                      </td>
                      <td className="border border-x-0 border-black px-2 py-4 text-sm md:text-base">
                        {data.dateCreated}
                      </td>
                      <td className="border border-x-0 border-black  px-2 py-4 text-sm md:text-base">
                        {data.date}
                      </td>
                      {(data.status === 'Rejected' && (
                        <td className="border border-x-0 border-black px-2 py-4 font-semibold text-[#FF0000]">
                          {data.status}
                        </td>
                      )) ||
                        (data.status === 'Approved' && (
                          <td className="border border-x-0 border-black px-2 py-4 font-semibold text-[#00FF00]">
                            {data.status}
                          </td>
                        )) ||
                        (data.status === 'For approval' && (
                          <td className="border border-x-0 border-black px-2 py-4 ">
                            {data.status}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
