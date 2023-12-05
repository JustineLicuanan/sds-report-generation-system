import {type Log, LogAction } from '@prisma/client';
import {type MutableRefObject } from 'react';

type YourComponentProps = {
  data: Log[];
  tableHeader: string[];
  tableRef: MutableRefObject<null>;
};

export default function Table({ data, tableHeader, tableRef }: YourComponentProps) {
  return (
    <>
      <table
        id="myTable"
        ref={tableRef}
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
          {data.length === 0 ? ( // Check if data is empty
            <tr>
              <td colSpan={tableHeader.length}>No result found</td>
            </tr>
          ) : (
            data.map((data) => (
              <tr key={data.reportId} className=" even:bg-[#808080]/20">
                <td className="border border-x-0 border-black px-2 py-4 text-sm md:text-base">
                  {data.name}
                </td>
                <td className="border border-x-0 border-black px-2 py-4 text-sm md:text-base">
                  {data.subject}
                </td>
                <td className="border border-x-0 border-black px-2 py-4 text-sm md:text-base">
                  {data.category}
                </td>
                <td className="border border-x-0 border-black  px-2 py-4 text-sm md:text-base">
                  {data.createdAt.toLocaleString('en-US', { timeZone: 'Asia/Manila' })}
                </td>
                {(data.action === LogAction.REJECTED && (
                  <td className="border border-x-0 border-black px-2 py-4 font-semibold text-red">
                    {data.action}
                  </td>
                )) ||
                  (data.action === LogAction.APPROVED && (
                    <td className="border border-x-0 border-black px-2 py-4 font-semibold text-[#00aa00]">
                      {data.action}
                    </td>
                  )) ||
                  (data.action === LogAction.PENDING && (
                    <td className="border border-x-0 border-black px-2 py-4 ">{data.action}</td>
                  ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}
