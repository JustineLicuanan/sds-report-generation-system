import { ReportStatus, type Report } from '@prisma/client';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { paths } from '~/meta';

export default function ReportList({ reports }: { reports: Report[] }) {
  const [activeReport] = useState<string | null>(null);
  const router = useRouter();

  // const toggleShowOption = (id: number) => {
  //   if (activeReport === id) {
  //     // Clicking the same button again, hide the div
  //     setActiveReport(null);
  //   } else {
  //     // Clicking a new button, show the div and hide others
  //     setActiveReport(id);
  //   }
  // };

  return (
    <>
      {reports.map((report) => (
        <button
          onClick={() => router.push(`${paths.ADMIN}${paths.ORGANIZATION_REPORTS}/${report.id}`)}
          key={report.id}
          className={`group relative mb-2 mt-2 h-16 w-full rounded-md border border-[green] p-1 shadow-[0_2px_4px_0px_rgba(0,0,0,0.25)] ${
            activeReport === report.id ? 'bg-yellow' : 'bg-[#ffffff]'
          }  hover:bg-yellow`}
        >
          <h1 className="flex justify-between ">
            <div className="text-xl font-semibold">{report.subject}</div>
            <div
              className={`me-4 text-lg font-semibold ${
                report.status === ReportStatus.APPROVED
                  ? 'text-green'
                  : report.status === ReportStatus.REJECTED
                  ? 'text-red'
                  : 'text-yellow group-hover:text-black'
              } `}
            >
              {report.status}
            </div>
          </h1>
          {report.status === ReportStatus.APPROVED ? (
            <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full border-2 border-black bg-[#0CF022] font-bold">
              <Image src="/approved_icon.svg" alt="Approved Icon" width={100} height={100} />
            </div>
          ) : report.status === ReportStatus.REJECTED ? (
            <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full border-2 border-black bg-[#FF0000] font-bold">
              <Image width={100} height={100} src="/rejected_icon.png" alt="Rejected Icon" />
            </div>
          ) : (
            <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full border-2 border-black bg-yellow font-bold">
              <Image width={100} height={100} src="/pending_icon.png" alt="Pending Icon" />
            </div>
          )}
          <div className="mt-1 text-right text-lg text-black">
            {report.createdAt.toLocaleString('en-US', { timeZone: 'Asia/Manila' })}
          </div>
        </button>
      ))}
    </>
  );
}
