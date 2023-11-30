import { LogType } from '@prisma/client';
import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { useDownloadExcel } from 'react-export-table-to-excel';
import AdminNavBar from '~/components/admin-navigation-bar';
import AdminSideBarMenu from '~/components/admin-side-bar-menu';
import Pagination from '~/components/pagination';
import { meta } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
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
  const [search, setSearch] = useState('');
  const getAuthLogsQuery = api.admin.log.get.useQuery({ type: LogType.AUTH });

  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'auth-logs',
    sheet: 'auth',
  });

  getAuthLogsQuery?.data?.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const filteredData = getAuthLogsQuery?.data?.filter((item) => {
    return search.toLowerCase() === '' || item.name.toLowerCase().includes(search);
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData?.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const tableHeader = ['Name', 'Email', 'Action', 'Date'];
  return (
    <>
      {/* HEADER */}
      <Head>
        <title>{`Auth Logs ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <AdminNavBar />
      <main className="flex">
        {/* SIDE BAR */}
        <AdminSideBarMenu />

        {/* MAIN CONTENT */}

        <div className="mx-3 my-4 w-full">
          <div className="mx-auto my-0 min-h-[87vh] max-w-5xl rounded-3xl px-5 py-5 shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)] md:px-9">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">Log</h1>
            <div className="my-4 flex flex-col justify-between md:my-6 md:flex-row">
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
              <button
                onClick={onDownload}
                className="mt-2 flex h-7 w-fit items-center gap-2 border-[1px] border-green bg-white px-2 py-1 text-sm hover:bg-yellow md:mt-0 md:h-9 md:text-base lg:h-11"
              >
                <div>Export</div>
                <Image src="/excel_icon.svg" alt="Excel Icon" width={20} height={20} />
              </button>
            </div>

            <div className="overflow-x-scroll sm:overflow-hidden">
              <table
                ref={tableRef}
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
                  {currentData?.length === 0 ? ( // Check if data is empty
                    <tr>
                      <td colSpan={tableHeader.length}>No result found</td>
                    </tr>
                  ) : (
                    currentData?.map((data, index) => (
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
                          {data.createdAt.toLocaleString('en-US', { timeZone: 'Asia/Manila' })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={getAuthLogsQuery?.data?.length ?? 0}
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
