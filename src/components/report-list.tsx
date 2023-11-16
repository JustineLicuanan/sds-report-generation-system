import { useRouter } from 'next/router';
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
  const router = useRouter();

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
          onClick={() =>
            router.push(`${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}/${report.id}`)
          }
          key={report.id}
          className={`group relative mb-2 mt-2 h-16 w-full rounded-md border border-[green] p-1 shadow-[0_2px_4px_0px_rgba(0,0,0,0.25)] ${
            activeReport === report.id ? 'bg-yellow' : 'bg-[#ffffff]'
          }  hover:bg-yellow`}
        >
          <h1 className="flex justify-between ">
            <div className="text-xl font-semibold">{report.subject}</div>
            <div
              className={`text-lg font-semibold ${
                report.status === 'Approved'
                  ? 'text-green'
                  : report.status === 'Rejected'
                  ? 'text-red'
                  : 'text-yellow group-hover:text-black'
              } `}
            >
              {report.status}
            </div>
          </h1>
          <div className="mt-1 text-right text-lg text-black">{report.date}</div>
        </button>
      ))}
    </>
  );
}
