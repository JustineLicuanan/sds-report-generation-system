import { LogAction, type Report } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CustomDialog } from '~/components/custom-dialog';
import { useToast } from '~/components/ui/use-toast';
import { paths } from '~/meta';
import { api } from '~/utils/api';

export default function Report({ logs: reports }: { logs: Report[] }) {
  const router = useRouter();
  const utils = api.useContext();
  const { toast } = useToast();

  const archiveReport = api.shared.report.archive.useMutation({
    onSuccess: async () => {
      toast({
        variant: 'c-primary',
        description: `✔️ Report has been archived.`,
      });
      await utils.shared.report.invalidate();
    },

    onError: () => {
      toast({
        variant: 'destructive',
        title: '❌ Internal Server Error',
        description: `Archival of report failed.`,
      });
    },
  });

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
            {reports.map((report) => (
              <tr key={report.id} className=" even:bg-[#808080]/20">
                <td className="border border-x-0 border-black px-2 py-4 text-sm md:text-base">
                  <Link
                    href={`${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}/${report.id}`}
                    className="justify-center p-1 text-lg underline underline-offset-2 hover:text-black/80"
                  >
                    {report.subject}
                  </Link>
                </td>
                <td className="border border-x-0 border-black px-2 py-4 text-sm md:text-base">
                  {report.category}
                </td>
                <td className="border border-x-0 border-black  px-2 py-4 text-sm md:text-base">
                  {report.createdAt.toLocaleString('en-US', { timeZone: 'Asia/Manila' })}
                </td>
                {(report.status === LogAction.REJECTED && (
                  <td className="border border-x-0 border-black px-2 py-4 font-semibold text-[#FF0000]">
                    {report.status}
                  </td>
                )) ||
                  (report.status === LogAction.APPROVED && (
                    <td className="border border-x-0 border-black px-2 py-4 font-semibold text-[#00FF00]">
                      {report.status}
                    </td>
                  )) ||
                  (report.status === LogAction.PENDING && (
                    <td className="border border-x-0 border-black px-2 py-4 ">{report.status}</td>
                  ))}
                <td className="border border-x-0 border-black px-2 py-4">
                  <div className="flex items-center justify-center ">
                    <Link
                      href={`${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}/${report.id}`}
                      className={`${
                        report.status !== LogAction.PENDING
                          ? 'cursor-not-allowed opacity-50'
                          : 'group/update'
                      } relative mx-2 flex flex-col items-center justify-center rounded-sm bg-gray p-2`}
                    >
                      <Image src="/update_icon.svg" width={20} height={20} alt="Update Icon" />
                      <div className="text-bottom absolute bottom-12 z-[4] hidden rounded-md bg-gray px-2 py-1 text-sm font-medium group-hover/update:block lg:bottom-12   lg:text-base">
                        Update
                      </div>
                    </Link>

                    <CustomDialog
                      handleContinue={() => {
                        archiveReport.mutate({
                          id: report.id,
                          subject: report.subject,
                          category: report.category,
                        });
                      }}
                      description="This action will archive your consulted report from our servers."
                    >
                      <button
                        type="button"
                        className={`${
                          report.status !== LogAction.PENDING
                            ? 'cursor-not-allowed opacity-50'
                            : 'group/delete'
                        }  relative mx-2 flex flex-col items-center justify-center rounded-sm bg-red p-2`}
                      >
                        <Image src="/delete_icon.svg" width={20} height={20} alt="Delete Icon" />
                        <div className="text-bottom absolute bottom-12 z-[4] hidden rounded-md bg-gray px-2 py-1 text-sm font-medium group-hover/delete:block lg:bottom-12 lg:text-base">
                          Delete
                        </div>
                      </button>
                    </CustomDialog>
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
