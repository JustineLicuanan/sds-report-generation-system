import { FinancialStatement, MonthlyFS } from '@prisma/client';
import { inferRouterOutputs } from '@trpc/server';
import { AppRouter } from '~/server/api/root';
import { api } from '~/utils/api';
import { getMonthName } from '~/utils/get-month-name';

export default function MonthCashFlow({
  monthly,
  orgSignatoryInfo,
  FS,
}: {
  monthly: MonthlyFS;
  orgSignatoryInfo: inferRouterOutputs<AppRouter>['shared']['orgSignatoryInfo']['get'];
  FS: FinancialStatement;
}) {
  const getInflowCollectionRowFSQuery = api.shared.inflowCollectionRowFS.get.useQuery({
    where: { monthlyId: monthly.id as string },
  });
  const inflowCollectionRowFS = getInflowCollectionRowFSQuery?.data;

  const getInflowIgpRowFSQuery = api.shared.inflowIgpRowFS.get.useQuery({
    where: { monthlyId: monthly.id as string },
  });
  const inflowIgpRowFS = getInflowIgpRowFSQuery?.data;

  let runningBalance = 20000;
  // const [currentBalance, setCurrentBalance] = useState(runningBalance);

  return (
    <>
      <div className="mx-auto my-0 mb-16 flex min-h-[100vh] flex-col items-center p-4">
        <div className="flex flex-col items-center">
          <div className="font-bold">{orgSignatoryInfo?.organization.name}</div>
          <div>MONTHLY CASH FLOW</div>
          <div>For the month of {getMonthName(monthly?.month as number)}</div>
        </div>
        <div className="mt-4">
          <table className="">
            <thead>
              <tr className="">
                <th className="border p-1">Date</th>
                <th className="border p-1">Particulars</th>
                <th className="border p-1">Schedule No.</th>
                <th className="border p-1">Beginning Balance</th>
                <th className="border p-1">Cash Received</th>
                <th className="border p-1">Cash Disbursed</th>
                <th className="border p-1">Running Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr className="">
                <td className=" p-1">8/31/2023</td>
                <td className=" p-1">Actual Cash Count</td>
                <td className=" p-1"></td>
                <td className=" p-1">{runningBalance}</td>
                <td className=" p-1"></td>
                <td className=" p-1"></td>
                <td className=" p-1">{runningBalance}</td>
              </tr>

              <tr className="">
                <td colSpan={7} className=" p-1 font-bold">
                  Inflows
                </td>
              </tr>
              {inflowCollectionRowFS?.map((collectionRow, index) => {
                // Assuming inflow.amount is a number
                runningBalance += Number(collectionRow.amount);

                return (
                  <tr key={collectionRow.id}>
                    <td className=" p-1"></td>
                    <td className=" p-1">Collection</td>
                    <td className=" p-1">S-001</td>
                    <td className=" p-1"></td>
                    <td className=" p-1">{Number(collectionRow.amount)}</td>
                    <td className=" p-1"></td>
                    <td className=" p-1">{runningBalance}</td>
                  </tr>
                );
              })}
              {inflowIgpRowFS?.map((IgpRow, index) => (
                <tr key={IgpRow.id}>
                  <td className=" p-1"></td>
                  <td className=" p-1">IGP</td>
                  <td className=" p-1">S-002</td>
                  <td className=" p-1"></td>
                  <td className=" p-1">50.00</td>
                  <td className=" p-1"></td>
                  <td className=" p-1">20,100.00</td>
                </tr>
              ))}

              <tr className="">
                <td colSpan={7} className=" p-1 font-bold">
                  Outflows
                </td>
              </tr>
              <tr>
                <td className=" p-1"></td>
                <td className=" p-1">Food Expense</td>
                <td className=" p-1">S-001</td>
                <td className=" p-1"></td>
                <td className=" p-1"></td>
                <td className=" p-1">2.00</td>
                <td className=" p-1">20,098.00</td>
              </tr>
              <tr>
                <td className=" p-1"></td>
                <td className=" p-1">Supplies Expense</td>
                <td className=" p-1">S-002</td>
                <td className=" p-1"></td>
                <td className=" p-1"></td>
                <td className=" p-1">3.00</td>
                <td className=" p-1">20,095.00</td>
              </tr>
              <tr>
                <td className=" p-1"></td>
                <td className=" p-1">Transportation Expense</td>
                <td className=" p-1">S-003</td>
                <td className=" p-1"></td>
                <td className=" p-1"></td>
                <td className=" p-1">4.00</td>
                <td className=" p-1">20,091.00</td>
              </tr>
              <tr>
                <td className=" p-1"></td>
                <td className=" p-1">Representation Expense</td>
                <td className=" p-1">S-004</td>
                <td className=" p-1"></td>
                <td className=" p-1"></td>
                <td className=" p-1">1.00</td>
                <td className=" p-1">20,090.00</td>
              </tr>
              <tr className="font-bold">
                <td colSpan={3} className="border-y p-1">
                  TOTAL - MONTH OF SEPTEMBER
                </td>
                <td className="border-y p-1">20,000.00</td>
                <td className="border-y p-1">100.00</td>
                <td className="border-y p-1">(10.00)</td>
                <td className="border-y p-1" style={{ borderBottom: 'double' }}>
                  {runningBalance}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
