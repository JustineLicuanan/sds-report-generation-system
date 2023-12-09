import { LogType } from '@prisma/client';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { api } from '~/utils/api';

export default function PDFSample() {
  const [search, setSearch] = useState('');
  const getAuthLogsQuery = api.admin.log.get.useQuery({ type: LogType.AUTH });

  getAuthLogsQuery?.data?.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const filteredData = getAuthLogsQuery?.data?.filter((item) => {
    return search.toLowerCase() === '' || item.name.toLowerCase().includes(search);
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(100);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData?.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const targetRef = useRef(null);
  const tableHeader = ['Name', 'Email', 'Action', 'Date'];

  return (
    <>
      <div id="download-button" className="m-4 flex justify-center">
        <button
          type="button"
          onClick={() => print()}
          className='font-medium" cursor-pointer rounded-md bg-yellow px-8 py-2 text-lg'
        >
          Download
        </button>
      </div>
      <div className="overflow-x-scroll p-5 sm:overflow-hidden" ref={targetRef}>
        <div
          id="nav-container"
          className="flex w-full items-center justify-center py-1 md:px-7 md:py-2"
        >
          <div id="titles" className="flex items-center justify-center px-1">
            <Image
              src="/cvsu_logo.png"
              alt="CVSU Logo"
              height={100}
              width={100}
              id="logo"
              className="h-10 w-10 rounded-full md:h-12  md:w-12"
            />
            <div className="mt-[-5px] leading-3 ">
              <div id="title" className="ms-2 text-lg font-bold sm:text-xl md:text-2xl lg:text-3xl">
                Office of Student Development Services
              </div>
              <div id="sub-title" className="ms-2">
                Report-File Scheduling and Management System
              </div>
            </div>
          </div>
        </div>
        <table
          id="myTable"
          className="mt-10 w-full min-w-max  border-collapse border border-black text-center"
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
      </div>
    </>
  );
}
