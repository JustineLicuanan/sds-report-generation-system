import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import NavBar from '~/components/navigation-bar';
import Pagination from '~/components/pagination';
import SideBarMenu from '~/components/side-bar-menu';
import Table from '~/components/table';
import { meta } from '~/meta';

export default function AdminLogPage() {
  const logData = [
    {
      subjectId: 2023001,
      organizationName: 'HGA',
      subject: 'Subject 1',
      dateCreated: '2023-10-01',
      date: '2023-10-20',
      status: 'For approval',
    },
    {
      subjectId: 2023002,
      organizationName: 'SDS',
      subject: 'Subject 2',
      dateCreated: '2023-10-01',
      date: '2023-10-11',
      status: 'Rejected',
    },
    {
      subjectId: 2023003,
      organizationName: 'BITS',
      subject: 'Subject 3',
      dateCreated: '2023-10-01',
      date: '2023-10-20',
      status: 'Approved',
    },
    {
      subjectId: 2023004,
      organizationName: 'ADS',
      subject: 'Subject 1',
      dateCreated: '2023-10-01',
      date: '2023-10-22',
      status: 'For approval',
    },
    {
      subjectId: 2023005,
      organizationName: 'TRE',
      subject: 'Subject 2',
      dateCreated: '2023-10-01',
      date: '2023-10-03',
      status: 'Rejected',
    },
    {
      subjectId: 2023006,
      organizationName: 'QWE',
      subject: 'Subject 3',
      dateCreated: '2023-10-01',
      date: '2023-10-20',
      status: 'Approved',
    },
  ];
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');

  if (date.toLowerCase() === 'oldest') {
    logData.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  } else if (date.toLowerCase() === 'latest') {
    logData.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  const filteredData = logData.filter((item) => {
    return (
      (status.toLowerCase() === '' || item.status.toLowerCase().includes(status)) &&
      (search.toLowerCase() === '' || item.organizationName.toLowerCase().includes(search))
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const tableHeader = [
    'Subject Id',
    'Organization Name',
    'Subject',
    'Created on',
    'Date',
    'Status',
  ];
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

        <div className="mx-3 mt-4 h-[87vh] w-full overflow-hidden ">
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
              <Table data={currentData} tableHeader={tableHeader} />
              <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={filteredData.length}
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
