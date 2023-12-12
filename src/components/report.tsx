import { LogAction, type Report } from '@prisma/client';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { paths } from '~/meta';

export default function Report({ logs }: { logs: Report[] }) {
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
                Category
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
            {logs.map((log) => (
              <tr key={log.id} className=" even:bg-[#808080]/20">
                <td className="border border-x-0 border-black px-2 py-4 text-sm md:text-base">
                  <button
                    onClick={() =>
                      router.push(`${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}/${log.id}`)
                    }
                    className="justify-center p-1 text-lg underline underline-offset-2 hover:text-black/80"
                  >
                    {log.subject}
                  </button>
                </td>
                <td className="border border-x-0 border-black px-2 py-4 text-sm md:text-base">
                  {log.category}
                </td>
                <td className="border border-x-0 border-black  px-2 py-4 text-sm md:text-base">
                  {log.createdAt.toLocaleString('en-US', { timeZone: 'Asia/Manila' })}
                </td>
                {(log.status === LogAction.REJECTED && (
                  <td className="border border-x-0 border-black px-2 py-4 font-semibold text-[#FF0000]">
                    {log.status}
                  </td>
                )) ||
                  (log.status === LogAction.APPROVED && (
                    <td className="border border-x-0 border-black px-2 py-4 font-semibold text-[#00FF00]">
                      {log.status}
                    </td>
                  )) ||
                  (log.status === LogAction.PENDING && (
                    <td className="border border-x-0 border-black px-2 py-4 ">{log.status}</td>
                  ))}
                <td className="border border-x-0 border-black px-2 py-4">
                  <div className="flex items-center justify-center ">
                    <button
                      type="button"
                      onClick={() => {
                        if (log.status === LogAction.PENDING) {
                          alert('Update button clicked!');
                        }
                      }}
                      className={`${
                        log.status !== LogAction.PENDING
                          ? 'cursor-not-allowed opacity-50'
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
                        if (log.status === LogAction.PENDING) {
                          alert('Delete button clicked!');
                        }
                      }}
                      className={`${
                        log.status !== LogAction.PENDING
                          ? 'cursor-not-allowed opacity-50'
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
