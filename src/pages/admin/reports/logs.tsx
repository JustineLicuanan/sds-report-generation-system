import { LogType } from '@prisma/client';
import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { useDownloadExcel } from 'react-export-table-to-excel';
import AdminNavBar from '~/components/admin-navigation-bar';
import AdminSideBarMenu from '~/components/admin-side-bar-menu';
import Pagination from '~/components/pagination';
import Table from '~/components/table';
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
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');

  const getReportLogsQuery = api.admin.log.get.useQuery({
    type: LogType.REPORT,
    includeCreatedBy: true,
  });

  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'report-logs',
    sheet: 'report',
  });

  getReportLogsQuery?.data?.sort((a, b) => {
    const dateTimeA = a.createdAt.toISOString().slice(0, 19);
    const dateTimeB = b.createdAt.toISOString().slice(0, 19);

    return dateTimeB.localeCompare(dateTimeA);
  });

  if (date.toLowerCase() === 'oldest') {
    getReportLogsQuery?.data?.sort((a, b) => {
      return a.createdAt
        .toISOString()
        .slice(0, 19)
        .localeCompare(b.createdAt.toISOString().slice(0, 19));
    });
  } else if (date.toLowerCase() === 'latest') {
    getReportLogsQuery?.data?.sort((a, b) => {
      return b.createdAt
        .toISOString()
        .slice(0, 19)
        .localeCompare(a.createdAt.toISOString().slice(0, 19));
    });
  }

  const filteredData = getReportLogsQuery?.data?.filter((item) => {
    return (
      (status.toLowerCase() === '' || item.action.toLowerCase().includes(status)) &&
      (search.toLowerCase() === '' || item.name.toLowerCase().includes(search))
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData?.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const tableHeader = ['Organization Name', 'Subject', 'Category', 'Date', 'Status'];
  return (
    <>
      {/* HEADER */}
      <Head>
        <title>{`Report Logs ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <AdminNavBar />
      <main className="flex">
        {/* SIDE BAR */}
        <div id="hide-element">
          <AdminSideBarMenu />
        </div>
        {/* MAIN CONTENT */}
        <div className="mx-3 my-4 w-full">
          <div className="mx-auto my-0 min-h-[87vh] max-w-5xl rounded-3xl px-5 py-5 shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)] md:px-9">
            {/* <div className="flex justify-between"> */}
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
              Report Logs
            </h1>
            {/* <select
                name="logs-dropdown"
                id="logs-dropdown"
                className="me-2 h-7 border-[1px] border-green bg-white px-2 py-1 text-sm md:h-9 md:text-base lg:h-11"
              >
                <option value="report" className="text-sm md:text-base">
                  Report
                </option>
                <option value="authentication" className="text-sm md:text-base">
                  Authentication
                </option>
              </select> */}
            {/* </div> */}
            <div id="hide-element" className="my-4 flex flex-col md:my-6 md:flex-row">
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
                  className="me-2 h-7 border-[1px] border-green bg-white px-2 py-1 text-sm md:h-9 md:text-base lg:h-11"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="" className="text-sm md:text-base">
                    Filter Status (All)
                  </option>
                  <option value="pending" className="text-sm md:text-base">
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
              <select
                id=""
                className="me-2 h-7 border-[1px] border-green bg-white px-2 py-1 text-sm md:h-9 md:text-base lg:h-11"
              >
                <option value="">Export</option>
                <option value="pdf" onClick={() => print()}>
                  PDF
                </option>
                <option value="excel" onClick={() => onDownload()}>
                  Excel
                </option>
              </select>
            </div>

            <div className="overflow-x-scroll sm:overflow-hidden">
              <Table data={currentData ?? []} tableHeader={tableHeader} tableRef={tableRef} />
              <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={filteredData?.length ?? 0}
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
