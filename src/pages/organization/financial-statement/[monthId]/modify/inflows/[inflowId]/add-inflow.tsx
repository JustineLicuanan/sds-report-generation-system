import { Check, Pencil, Trash2, X } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
import { useToast } from '~/components/ui/use-toast';
import { meta, paths } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';
import { getMonthName } from '~/utils/get-month-name';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.organization(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function AddInflowFinancialStatementPage() {
  const router = useRouter();
  const monthId = router.query.monthId;
  const inflowId = router.query.inflowId;
  const utils = api.useContext();
  const { toast } = useToast();

  const getMonthNameQuery = api.shared.monthlyFS.get.useQuery({
    where: { id: monthId as string },
  });
  const monthly = getMonthNameQuery?.data?.[0];

  const getFSInflowQuery = api.shared.inflowCollectionFS.get.useQuery();
  const FSInflow = getFSInflowQuery?.data;

  const getFSInflowRow = api.shared.inflowCollectionRowFS.get.useQuery();
  const FSInflowRow = getFSInflowRow.data;

  const getReportSemQuery = api.shared.reportSemester.get.useQuery();
  const reportSem = getReportSemQuery?.data;

  const [disable, setDisable] = useState(false);
  const header = ['Date', 'Name', 'OR No.', 'Amount', 'Receipt', 'Action'];

  const deleteFSInflowRow = api.shared.inflowCollectionRowFS.delete.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ FS Inflow Row has been deleted' });
      await utils.shared.orgSignatoryInfo.invalidate();
    },
    // This is the callback function after failed backend execution. This is mostly used for 'unique' data conflict errors like unique email, etc.
    onError: () => {
      toast({
        variant: 'destructive',
        title: '❌ Internal Server Error',
        description: 'Deleting of FS Inflow Row failed.',
      });
    },
  });
  return (
    <>
      <Head>
        <title>{`Financial Statement ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />

      <main className="flex">
        {/* SIDE BAR*/}
        <OrganizationSideBarMenu />
        <div id="main-content" className="mx-4 my-4  w-full  gap-8">
          <div className="mb-4 text-4xl font-bold">Inflow: [ S-001 ] (Collection)</div>
          <div className="text-medium text-lg capitalize">
            {reportSem?.term.toLowerCase()} Semester - {getMonthName(monthly?.month as number)}
          </div>
          <div className="grid grid-cols-2 grid-rows-4 gap-4">
            {/* NET */}
            <div className="col-span-2 row-span-4 flex flex-col justify-between gap-2 rounded-sm p-4 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
              <label htmlFor="short-desc">Short Description:</label>
              <textarea
                name="short-desc"
                id="short-desc"
                cols={10}
                rows={3}
                className={`${disable ? 'bg-gray opacity-50' : ''} rounded-sm border p-1`}
                disabled={disable}
              ></textarea>
              <button
                type="button"
                onClick={() => setDisable(true)}
                className={`${
                  disable ? 'opacity-50' : ''
                } self-end rounded-sm border border-yellow bg-yellow px-3 active:scale-95`}
                disabled={disable}
              >
                Submit
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="mt-4 flex min-h-[40vh] w-full flex-col gap-2 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}/${monthId}${paths.MODIFY_FINANCIAL_STATEMENT}${paths.INFLOWS}/${inflowId}${paths.COLLECTION_ROW}${paths.CREATE}`
                  )
                }
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Add row
              </button>
              <button
                type="button"
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Done
              </button>
            </div>
            <table className="w-full min-w-max border-collapse  border border-black text-center">
              <thead>
                <tr>
                  {header.map((header, index) => (
                    <th
                      key={index}
                      className=" border-r-0 border-black bg-green p-1 text-lg font-bold tracking-tight text-white "
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FSInflowRow?.map((inflowRow) => (
                  <tr className="even:bg-[#808080]/20">
                    <td className="border border-x-0 border-black py-2 text-base">
                      {inflowRow.date.toISOString().split('T')[0]}
                    </td>
                    <td className="border border-x-0 border-black py-2 text-base">
                      {inflowRow.name}
                    </td>
                    <td className="border border-x-0 border-black py-2 text-base">
                      {inflowRow.ORNumber}
                    </td>
                    <td className="border border-x-0 border-black py-2 text-base">
                      {inflowRow.amount?.toString()}
                    </td>
                    <td className=" border border-x-0 border-black  py-2 ">
                      <div className="flex items-center justify-center">
                        {inflowRow.receipt ? (
                          <div className="text-green">
                            <Check />
                          </div>
                        ) : (
                          <div className="text-red">
                            <X />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="border border-x-0 border-black py-2 text-base">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}/${monthId}${paths.MODIFY_FINANCIAL_STATEMENT}${paths.INFLOWS}/${inflowId}${paths.COLLECTION_ROW}/${inflowRow.id}${paths.EDIT}`
                            )
                          }
                          className="rounded-sm border border-gray bg-gray p-1 active:scale-95"
                        >
                          <Pencil />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteFSInflowRow.mutate({ id: inflowRow.id })}
                          className="rounded-sm border border-red bg-red p-1 text-white active:scale-95"
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
