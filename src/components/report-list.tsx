import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { paths } from '~/meta';

type Report = {
  id: number;
  subject: string;
  date: string;
  status: string;
};
export default function ReportList({ reports }: { reports: Report[] }) {
  const [activeReport, setActiveReport] = useState<number | null>(null);
  const toggleShowOption = (id: number) => {
    if (activeReport === id) {
      // Clicking the same button again, hide the div
      setActiveReport(null);
    } else {
      // Clicking a new button, show the div and hide others
      setActiveReport(id);
    }
  };

  return (
    <>
      {reports.map((report) => (
        <button
          onClick={() => toggleShowOption(report.id)}
          key={report.id}
          className={`relative mb-2 mt-2 h-16 w-full rounded-md border border-[green] p-1 shadow-[0_2px_4px_0px_rgba(0,0,0,0.25)] ${
            activeReport === report.id ? 'bg-yellow' : 'bg-[#ffffff]'
          }  hover:bg-yellow`}
        >
          <h1 className=" text-left text-xl font-semibold ">{report.subject}</h1>
          <div className="mt-1 text-right text-lg text-black">{report.date}</div>

          {report.status === 'Approved' ? (
            <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full border-2 border-black bg-[#0CF022] font-bold">
              <Image src="/approved_icon.svg" alt="Approved Icon" width={100} height={100} />
            </div>
          ) : report.status === 'Rejected' ? (
            <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full border-2 border-black bg-[#FF0000] font-bold">
              <Image width={100} height={100} src="/rejected_icon.png" alt="Rejected Icon" />
            </div>
          ) : (
            <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full border-2 border-black bg-yellow font-bold">
              <Image width={100} height={100} src="/pending_icon.png" alt="Pending Icon" />
            </div>
          )}
          {activeReport === report.id && (
            <div className="absolute left-full top-1/2 z-[1] flex flex-col bg-gray py-1">
              <Link
                href={`${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}/${report.id}`}
                className="bg-slate-300 px-5 py-2 hover:bg-yellow "
              >
                Open
              </Link>
            </div>
          )}
        </button>
      ))}
    </>
  );
}