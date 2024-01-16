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

export default function AddOutflowFinancialStatementPage() {
  const router = useRouter();
  const { monthId, id: outflowId } = router.query;
  const utils = api.useContext();
  const { toast } = useToast();

  const getMonthly = api.shared.monthlyFS.get.useQuery({ where: { id: monthId as string } });
  const monthly = getMonthly.data?.[0];

  const getFSOutflow = api.shared.outflowFS.get.useQuery({ where: { id: outflowId as string } });
  const FSOutflow = getFSOutflow.data?.[0];

  const getOutflowRow = api.shared.outflowRowFS.get.useQuery({
    where: { outflowId: FSOutflow?.id },
  });
  const outflowRowFS = getOutflowRow.data;

  const getReportSemQuery = api.shared.reportSemester.get.useQuery();
  const reportSem = getReportSemQuery?.data;

  const deleteFSOutflowRow = api.shared.outflowRowFS.delete.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ FS Outflow Row has been deleted' });
      await utils.shared.outflowRowFS.invalidate();
    },
    // This is the callback function after failed backend execution. This is mostly used for 'unique' data conflict errors like unique email, etc.
    onError: () => {
      toast({
        variant: 'destructive',
        title: '❌ Internal Server Error',
        description: 'Deleting of FS Outflow Row failed.',
      });
    },
  });
  const [disable, setDisable] = useState(false);

  const header = [
    'Date',
    'Quantity',
    'Particulars',
    'Unit',
    'Price',
    'Amount',
    'Receipt',
    'Action',
  ];
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
          <div className="mb-4 text-4xl font-bold">
            Outflow: (
            <span className="capitalize">
              {FSOutflow?.category.replace(/_/g, ' ').toLowerCase()}
            </span>
            )
          </div>
          <div className="text-medium text-lg capitalize">
            {reportSem?.term.toLowerCase()} Semester -{' '}
            {monthly?.month && getMonthName(monthly.month)}
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
                    `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}/${monthId}${paths.MODIFY_FINANCIAL_STATEMENT}${paths.OUTFLOWS}/${outflowId}${paths.COLLECTION_ROW}${paths.CREATE}`
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
                {outflowRowFS?.map((outflowRow) => (
                  <tr className="even:bg-[#808080]/20">
                    <td className="border border-x-0 border-black py-2 text-base">
                      {outflowRow.date.toISOString().split('T')[0]}
                    </td>
                    <td className="border border-x-0 border-black py-2 text-base">
                      {outflowRow.quantity}
                    </td>
                    <td className="border border-x-0 border-black py-2 text-base">
                      {outflowRow.particulars}
                    </td>
                    <td className="border border-x-0 border-black py-2 text-base">
                      {outflowRow.unit}
                    </td>
                    <td className="border border-x-0 border-black py-2 text-base">
                      {outflowRow.price.toString()}
                    </td>
                    <td className="border border-x-0 border-black py-2 text-base">
                      {Number(outflowRow.price) * outflowRow.quantity}
                    </td>
                    <td className="border border-x-0 border-black py-2 text-base">
                      <button
                        type="button"
                        className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                      >
                        Upload
                      </button>
                    </td>
                    <td className="border border-x-0 border-black py-2 text-base">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          className="rounded-sm border border-red bg-red px-3 text-white active:scale-95"
                          onClick={() => deleteFSOutflowRow.mutate({ id: outflowRow.id })}
                        >
                          Delete
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
