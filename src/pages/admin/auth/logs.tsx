import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import AdminSideBarMenu from '~/components/admin-side-bar-menu';
import NavBar from '~/components/navigation-bar';
import Pagination from '~/components/pagination';
import { meta } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { authRedirects } from '~/utils/auth-redirects';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.admin(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function AdminLogPage() {
  const logData = [
    {
      name: 'Admin',
      email: 'admin@example.com',
      action: 'Sigin in',
      date: '2023-11-27',
    },
    {
      name: 'Admin',
      email: 'admin@example.com',
      action: 'Sigin in',
      date: '2023-11-27',
    },
  ];
  const [search, setSearch] = useState('');

  logData.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const filteredData = logData.filter((item) => {
    return search.toLowerCase() === '' || item.name.toLowerCase().includes(search);
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const tableHeader = ['Name', 'Email', 'Action', 'Date'];
  return (
    <>
      {/* HEADER */}
      <Head>
        <title>{`Auth Logs ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <NavBar />
      <main className="flex">
        {/* SIDE BAR */}
        <AdminSideBarMenu />

        {/* MAIN CONTENT */}

        <div className="mx-3 my-4 w-full">
          <div className="mx-auto my-0 min-h-[87vh] max-w-5xl rounded-3xl px-5 py-5 shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)] md:px-9">
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
                    className="md:h-full "
                    alt="Search Icon"
                  />
                </label>
                <input
                  name="search"
                  id="search-item"
                  placeholder="Search organization"
                  className="h-7 border-[1px] border-green px-2 py-1 outline-none md:h-9 md:text-lg lg:h-11 lg:text-xl"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-scroll sm:overflow-hidden">
              <table
                id="myTable"
                className="w-full min-w-max border-collapse  border border-black text-center "
              >
                <thead>
                  <tr>
                    {tableHeader.map((header, index) => (
                      <th
                        key={index}
                        className=" border-r-0 border-black bg-green px-2 py-2 text-base font-bold tracking-tight text-white md:text-lg lg:text-xl"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentData.length === 0 ? ( // Check if data is empty
                    <tr>
                      <td colSpan={tableHeader.length}>No result found</td>
                    </tr>
                  ) : (
                    currentData.map((data, index) => (
                      <tr key={index} className=" even:bg-[#808080]/20">
                        <td className="border border-x-0 border-black px-2 py-4 text-sm md:text-base">
                          {data.name}
                        </td>
                        <td className="border border-x-0 border-black px-2 py-4 text-sm md:text-base">
                          {data.email}
                        </td>
                        <td className="border border-x-0 border-black px-2 py-4 text-sm md:text-base">
                          {data.action}
                        </td>
                        <td className="border border-x-0 border-black px-2 py-4 text-sm md:text-base">
                          {data.date}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={logData.length}
                currentPage={currentPage}
                paginate={paginate}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
