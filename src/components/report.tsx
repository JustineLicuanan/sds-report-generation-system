import Image from 'next/image';
import { useRouter } from 'next/router';
import { paths } from '~/meta';

type Report = {
  subjectId: number;
  subject: string;
  category: string;
  date: string;
  status: string;
};

export default function Report({ reports }: { reports: Report[] }) {
  // const [activeReport, setActiveReport] = useState<number | null>(null);
  // const [reportsState, setReportsState] = useState(reports);
  // const toggleShowOption = (id: number) => {
  //   if (activeReport === id) {
  //     // Clicking the same button again, hide the div
  //     setActiveReport(null);
  //   } else {
  //     // Clicking a new button, show the div and hide others
  //     setActiveReport(id);
  //   }
  // };

  const router = useRouter();
  // const toggleHide = (isHidden: boolean, id: number) => {
  //   const updatedReports = reportsState.map((report) => {
  //     if (report.id === id) {
  //       return {
  //         ...report,
  //         isHidden: !isHidden,
  //       };
  //     }
  //     return report;
  //   });
  //   setReportsState(updatedReports);
  // };

  // const filteredData = reportsState.filter((item) => !item.isHidden);

  return (
    <>
      <div className="overflow-x-scroll sm:overflow-hidden">
        <table
          id="myTable"
          className="w-full min-w-max border-collapse  border border-black text-center "
        >
          <thead>
            <tr>
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
              <th className=" border-r-0 border-black bg-green px-2 py-2 text-base font-bold tracking-tight text-white md:text-lg lg:text-xl">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.subjectId} className=" even:bg-[#808080]/20">
                <td className="border border-x-0 border-black px-2 py-4 text-sm md:text-base">
                  <button
                    onClick={() =>
                      router.push(
                        `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}/${report.subjectId}`
                      )
                    }
                    className="justify-center p-1 text-lg underline underline-offset-2 hover:text-black/80"
                  >
                    {report.subject}
                  </button>
                </td>
                <td className="border border-x-0 border-black px-2 py-4 text-sm md:text-base">
                  {report.category}
                </td>
                <td className="border border-x-0 border-black  px-2 py-4 text-sm md:text-base">
                  {report.date}
                </td>
                {(report.status === 'Rejected' && (
                  <td className="border border-x-0 border-black px-2 py-4 font-semibold text-[#FF0000]">
                    {report.status}
                  </td>
                )) ||
                  (report.status === 'Approved' && (
                    <td className="border border-x-0 border-black px-2 py-4 font-semibold text-[#00FF00]">
                      {report.status}
                    </td>
                  )) ||
                  (report.status === 'Pending' && (
                    <td className="border border-x-0 border-black px-2 py-4 ">{report.status}</td>
                  ))}
                <td className="border border-x-0 border-black px-2 py-4">
                  <div className="flex items-center justify-center ">
                    <button
                      type="button"
                      onClick={() => {
                        if (report.status === 'Pending') {
                          alert('Update button clicked!');
                        }
                      }}
                      className={`${
                        report.status !== 'Pending'
                          ? 'cursor-not-allowed bg-gray/40'
                          : 'group/update'
                      } relative mx-2 flex flex-col items-center justify-center rounded-sm bg-gray p-2`}
                    >
                      <Image src="/update_icon.svg" width={20} height={20} alt="Update Icon" />
                      <div className="absolute left-12 z-[4] hidden rounded-md bg-gray px-2 py-1 text-left text-sm font-medium group-hover/update:block lg:left-12   lg:text-base">
                        Update
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (report.status === 'Pending') {
                          alert('Delete button clicked!');
                        }
                      }}
                      className={`${
                        report.status !== 'Pending'
                          ? 'cursor-not-allowed bg-red/20'
                          : 'group/delete'
                      }  relative mx-2 flex flex-col items-center justify-center rounded-sm bg-red p-2`}
                    >
                      <Image src="/delete_icon.svg" width={20} height={20} alt="Delete Icon" />
                      <div className="absolute left-12 z-[4] hidden rounded-md bg-gray px-2 py-1 text-left text-sm font-medium group-hover/delete:block lg:left-12 lg:text-base">
                        Delete
                      </div>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
