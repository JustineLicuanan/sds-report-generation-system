import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
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

export default function FinancialStatementPage() {
  const router = useRouter();
  const getReportSem = api.shared.reportSemester.get.useQuery();
  const reportSem = getReportSem.data;

  const getFinancialStatementQuery = api.shared.FS.getOrCreate.useQuery();
  const FS = getFinancialStatementQuery?.data;

  const getFSMonthQuery = api.shared.monthlyFS.get.useQuery();
  const FSMonth = getFSMonthQuery?.data;

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
          <div className="mb-4 text-center text-4xl font-bold">Financial Statement</div>

          <div className="grid grid-cols-4 grid-rows-2 gap-4">
            <div className="col-span-2 row-span-2 flex flex-col items-center justify-center gap-2 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
              <div className="text-lg font-bold">Submit a Financial Statement</div>
              <div className="text-center font-medium">
                Submit a concise financial statement that provides a brief overview of the
                organization&apos;s financial status and transactions.
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                >
                  Done
                </button>
                <button
                  type="button"
                  className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                >
                  Upload
                </button>
              </div>
            </div>

            <div className="col-span-2 row-span-1 flex flex-col gap-2 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
              <div className="text-center text-lg font-bold">Organization and School Positions</div>
              <div className="flex flex-col items-center gap-2">
                <div className="font-medium">
                  Regularly update and organize your financial records for efficient analysis.
                </div>
                <button
                  type="button"
                  onClick={() => router.push(`${paths.ORGANIZATION}${paths.MY_ORGANIZATION}`)}
                  className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                >
                  Go to my organization
                </button>
              </div>
            </div>

            <div className="col-span-2 row-span-1 flex flex-col items-center justify-center  gap-2 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
              <div className="text-lg font-bold">Actual Cash</div>
              <div className="text-center font-medium">Input the Actual Cash in this semester.</div>
              <div className="flex gap-4">
                <input
                  type="text"
                  name=""
                  id="actual-cash"
                  className="rounded-sm border border-input"
                />
                <button
                  type="button"
                  className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                >
                  Set
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 min-h-[40vh] rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="mb-4 text-center text-2xl font-bold">
              {reportSem?.term} SEMESTER {reportSem?.yearStart} - {reportSem?.yearEnd}
            </div>
            <button
              type="button"
              className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              onClick={() =>
                router.push(
                  `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}${paths.ADD_NEW_MONTH}`
                )
              }
            >
              Add new month
            </button>
            {FSMonth?.map((month) => (
              <div
                key={month.id}
                className="border-sm  my-2 flex items-center justify-between gap-2 border border-input"
              >
                <div className="flex w-1/2 items-center justify-between gap-2  p-2">
                  <div className="text-lg font-bold">Month of {getMonthName(month.month)}</div>
                  <button
                    type="button"
                    className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                    onClick={() =>
                      router.push(
                        `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}/${month.id}${paths.MODIFY_FINANCIAL_STATEMENT}`
                      )
                    }
                  >
                    Modify
                  </button>
                </div>
                <div className="flex w-1/2 items-center justify-between gap-2 p-2">
                  <div className="text-lg font-bold">Generate:</div>
                  <select
                    name=""
                    id="fs-file-dropdown"
                    className="rounded-sm border border-yellow px-1 py-1"
                  >
                    <option value="">Select a file below to generate</option>
                    <option
                      value="Month Label"
                      onClick={() =>
                        router.push(
                          `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}/${month.id}${paths.MONTH_LABEL}`
                        )
                      }
                    >
                      Month Label
                    </option>
                    <option
                      value="Sem Cash Flow"
                      onClick={() =>
                        router.push(
                          `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}/${month.id}${paths.SEM_CASH_FLOW}`
                        )
                      }
                    >
                      Sem Cash Flow
                    </option>
                    <option
                      value="Sem Signatories"
                      onClick={() =>
                        router.push(
                          `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}/${month.id}${paths.SEM_SIGNATORIES}`
                        )
                      }
                    >
                      Sem Signatories
                    </option>
                    <option
                      value="Expense Summary"
                      onClick={() =>
                        router.push(
                          `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}/${month.id}${paths.EXPENSE_SUMMARY}`
                        )
                      }
                    >
                      Expense Summary
                    </option>
                    <option
                      value="Month Cash Flow"
                      onClick={() =>
                        router.push(
                          `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}/${month.id}${paths.MONTH_CASH_FLOW}`
                        )
                      }
                    >
                      Month Cash Flow
                    </option>
                    <option
                      value="Month Notes"
                      onClick={() =>
                        router.push(
                          `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}/${month.id}${paths.MONTH_NOTES}`
                        )
                      }
                    >
                      Month Notes
                    </option>
                    <option
                      value="Signatories Per Month"
                      onClick={() =>
                        router.push(
                          `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}/${month.id}${paths.MONTH_SIGNATORIES}`
                        )
                      }
                    >
                      Signatories Per Month
                    </option>
                    <option
                      value="Receipts"
                      onClick={() =>
                        router.push(
                          `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}/${month.id}${paths.RECEIPTS}`
                        )
                      }
                    >
                      Receipts
                    </option>
                    <option
                      value="Forms"
                      onClick={() =>
                        router.push(
                          `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}/${month.id}${paths.FORMS}`
                        )
                      }
                    >
                      Forms
                    </option>
                    <option
                      value="Liquidation"
                      onClick={() =>
                        router.push(
                          `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}/${month.id}${paths.LIQUIDATION}`
                        )
                      }
                    >
                      Liquidation
                    </option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
