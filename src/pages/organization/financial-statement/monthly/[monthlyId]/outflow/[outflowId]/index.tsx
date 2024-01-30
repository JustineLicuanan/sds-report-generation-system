import { Check, Eye, Pencil, Trash2, X } from 'lucide-react';
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

  // const getFSInflowQuery = api.shared.inflowCollectionFS.get.useQuery({
  //   where: { id: inflowId as string },
  // });
  // const FSInflow = getFSInflowQuery?.data;

  const getFSInflowRow = api.shared.inflowCollectionRowFS.get.useQuery({
    where: { inflowCollectionId: inflowId as string },
  });
  const FSInflowRow = getFSInflowRow.data;

  const getReportSemQuery = api.shared.reportSemester.get.useQuery();
  const reportSem = getReportSemQuery?.data;

  const [disable, setDisable] = useState(false);
  const header = ['Date', 'Name', 'OR No.', 'Amount', 'Receipt', 'Action'];

  const deleteFSInflowRow = api.shared.inflowCollectionRowFS.delete.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ FS Inflow Row has been deleted' });
      await utils.shared.inflowCollectionRowFS.invalidate();
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
          <div className="mb-4 text-4xl font-bold">Outflow: S-001 [Category]</div>
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
                    `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}/${monthId as string}${
                      paths.MODIFY_FINANCIAL_STATEMENT
                    }${paths.INFLOWS}/${inflowId}${paths.COLLECTION_ROW}${paths.CREATE}`
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
            <div>
              <div className="flex w-full border border-black bg-green">
                <div className="w-[10%] p-1 text-center text-lg font-bold text-white ">Date</div>
                <div className="w-[10%] p-1 text-center text-lg font-bold text-white ">
                  Quantity
                </div>
                <div className="w-[15%] p-1 text-center text-lg font-bold text-white ">
                  Particulars
                </div>
                <div className="w-[10%] p-1 text-center text-lg font-bold text-white ">OR No.</div>
                <div className="w-[10%] p-1 text-center text-lg font-bold text-white ">Unit</div>
                <div className="w-[10%] p-1 text-center text-lg font-bold text-white ">Price</div>
                <div className="w-[10%] p-1 text-center text-lg font-bold text-white ">Amount</div>
                <div className="w-[15%] p-1 text-center text-lg font-bold text-white ">Receipt</div>
                <div className="w-[10%] p-1 text-center text-lg font-bold text-white ">Action</div>
              </div>
              {FSInflowRow?.map((inflowRow, index) => (
                <div key={index} className="flex">
                  <input
                    type="text"
                    name=""
                    id=""
                    className="w-[10%] border p-1 text-center focus:z-10 focus:font-bold"
                  />
                  <input
                    type="text"
                    name=""
                    id=""
                    className="w-[10%] border p-1 text-center focus:z-10 focus:font-bold"
                  />
                  <input
                    type="text"
                    name=""
                    id=""
                    className="w-[15%] border p-1 text-center focus:z-10 focus:font-bold"
                  />
                  <input
                    type="text"
                    name=""
                    id=""
                    className="w-[10%] border p-1 text-center focus:z-10 focus:font-bold"
                  />
                  <input
                    type="text"
                    name=""
                    id=""
                    className="w-[10%] border p-1 text-center focus:z-10 focus:font-bold"
                  />
                  <input
                    type="text"
                    name=""
                    id=""
                    className="w-[10%] border p-1 text-center focus:z-10 focus:font-bold"
                  />
                  <input
                    type="text"
                    name=""
                    id=""
                    className="w-[10%] border p-1 text-center focus:z-10 focus:font-bold"
                  />
                  <div className="flex w-[15%] items-center justify-between border px-4">
                    <div className="flex gap-4">
                      <button
                        type="button"
                        className="rounded-sm border border-yellow bg-yellow px-1 active:scale-95"
                      >
                        Upload
                      </button>
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
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="my-1 rounded-sm border border-gray bg-gray p-1 active:scale-95"
                      >
                        <Eye />
                      </button>
                    </div>
                  </div>
                  <div className="flex w-[10%] justify-center gap-2 border">
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}/${monthId as string}${
                            paths.MODIFY_FINANCIAL_STATEMENT
                          }${paths.INFLOWS}/${inflowId}${paths.COLLECTION_ROW}/${inflowRow.id}${
                            paths.EDIT
                          }`
                        )
                      }
                      className="my-1 rounded-sm border border-gray bg-gray p-1 active:scale-95"
                    >
                      <Pencil />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteFSInflowRow.mutate({ id: inflowRow.id })}
                      className="my-1 rounded-sm border border-red bg-red p-1 text-white active:scale-95"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
