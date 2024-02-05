import { FinancialStatement, MonthlyFS } from '@prisma/client';
import { inferRouterOutputs } from '@trpc/server';
import { AppRouter } from '~/server/api/root';
import { api } from '~/utils/api';
import { getMonthName } from '~/utils/get-month-name';
import { sortOutflowRowFS } from '~/utils/sort-outflow-fs';

export default function MonthCashFlow({
  monthly,
  orgSignatoryInfo,
  FS,
  monthlyActualCash,
}: {
  monthly: MonthlyFS;
  orgSignatoryInfo: inferRouterOutputs<AppRouter>['shared']['orgSignatoryInfo']['get'];
  FS: FinancialStatement;
  monthlyActualCash: number;
}) {
  const getInflowCollectionRowFSQuery = api.shared.inflowCollectionRowFS.get.useQuery({
    where: { monthlyId: monthly.id as string },
  });
  const inflowCollectionRowFS = getInflowCollectionRowFSQuery?.data;

  const getInflowIgpRowFSQuery = api.shared.inflowIgpRowFS.get.useQuery({
    where: { monthlyId: monthly.id as string },
  });
  const inflowIgpRowFS = getInflowIgpRowFSQuery?.data;

  const getOutflowRowFSQuery = api.shared.outflowRowFS.get.useQuery({
    where: { monthlyId: monthly.id as string },
  });

  const outflowRowFS = getOutflowRowFSQuery?.data;
  const sortedOutflowRowFS = sortOutflowRowFS(outflowRowFS ?? []);

  let collectionTotal =
    inflowCollectionRowFS?.reduce((acc, row) => acc + Number(row.amount), 0) ?? 0;
  let IgpTotal =
    inflowIgpRowFS?.reduce((acc, row) => acc + Number(row.price) * row.quantity, 0) ?? 0;
  let outflowTotal = sortedOutflowRowFS.reduce(
    (acc, outflowRow) =>
      acc + outflowRow[1].reduce((acc, row) => acc + Number(row.price) * row.quantity, 0),
    0
  );

  let runningBalance = monthlyActualCash + collectionTotal + IgpTotal;
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
                <td className=" p-1">{monthlyActualCash}</td>
                <td className=" p-1"></td>
                <td className=" p-1"></td>
                <td className=" p-1">{monthlyActualCash}</td>
              </tr>
              <tr className="">
                <td colSpan={7} className=" p-1 font-bold">
                  Inflows
                </td>
              </tr>
              <tr>
                <td className=" p-1"></td>
                <td className=" p-1">Collection</td>
                <td className=" p-1">S-001</td>
                <td className=" p-1"></td>
                <td className=" p-1">{collectionTotal}</td>
                <td className=" p-1"></td>
                <td className=" p-1">{monthlyActualCash + (collectionTotal ?? 0)}</td>
              </tr>
              <tr>
                <td className=" p-1"></td>
                <td className=" p-1">IGP</td>
                <td className=" p-1">S-002</td>
                <td className=" p-1"></td>
                <td className=" p-1">{IgpTotal}</td>
                <td className=" p-1"></td>
                <td className=" p-1">{runningBalance}</td>
              </tr>
              <tr className="">
                <td colSpan={7} className=" p-1 font-bold">
                  Outflows
                </td>
              </tr>
              {sortedOutflowRowFS.map((outflowRow, outflowRowIdxCF) => (
                <tr key={outflowRowIdxCF}>
                  <td className=" p-1"></td>
                  <td className=" p-1 capitalize">
                    {outflowRow[0].toLowerCase().replace(/_/g, ' ')}
                  </td>
                  <td className=" p-1">S-00{outflowRowIdxCF + 1}</td>
                  <td className=" p-1"></td>
                  <td className=" p-1"></td>
                  <td className=" p-1">
                    {outflowRow[1].reduce((acc, row) => acc + Number(row.price) * row.quantity, 0)}
                  </td>
                  <td className=" p-1">
                    {
                      (runningBalance -= outflowRow[1].reduce(
                        (acc, row) => acc + Number(row.price) * row.quantity,
                        0
                      ))
                    }
                  </td>
                </tr>
              ))}

              <tr className="font-bold">
                <td colSpan={3} className="border-y p-1">
                  TOTAL - MONTH OF {getMonthName(monthly?.month as number).toUpperCase()}
                </td>
                <td className="border-y p-1">{monthlyActualCash}</td>
                <td className="border-y p-1">{collectionTotal + IgpTotal}</td>
                <td className="border-y p-1">({outflowTotal})</td>
                <td className="border-y p-1" style={{ borderBottom: 'double' }}>
                  {monthlyActualCash -
                    sortedOutflowRowFS.reduce(
                      (acc, outflowRow) =>
                        acc +
                        outflowRow[1].reduce(
                          (acc, row) => acc + Number(row.price) * row.quantity,
                          0
                        ),
                      0
                    ) +
                    (collectionTotal ?? 0) +
                    (inflowIgpRowFS?.reduce(
                      (acc, row) => acc + Number(row.price) * row.quantity,
                      0
                    ) ?? 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
