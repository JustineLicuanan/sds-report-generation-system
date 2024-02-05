import { FinancialStatement, MonthlyFS, ReportSemester } from '@prisma/client';
import { inferRouterOutputs } from '@trpc/server';
import { Fragment } from 'react';
import SemCFMonth from '~/components/fs-print/sem-cf-month';
import { AppRouter } from '~/server/api/root';
import { api } from '~/utils/api';
import { sortOutflowRowFS } from '~/utils/sort-outflow-fs';
import { OrderBy } from '~/zod-schemas/utils';

export default function SemCashFlow({
  reportSem,
  orgSignatoryInfo,
}: {
  reportSem: ReportSemester;
  orgSignatoryInfo: inferRouterOutputs<AppRouter>['shared']['orgSignatoryInfo']['get'];
}) {
  // Month
  const getMonthlyFSQuery = api.shared.monthlyFS.get.useQuery({
    orderBy: { month: OrderBy.ASC },
    current: true,
  });
  const monthlyFS = getMonthlyFSQuery?.data;
  console.log(monthlyFS);
  // FS
  const getFSQuery = api.shared.FS.getOrCreate.useQuery();
  const FS = getFSQuery?.data;

  const getInflowCollectionRowFSQuery = api.shared.inflowCollectionRowFS.get.useQuery();
  const inflowCollectionRowFS = getInflowCollectionRowFSQuery?.data;

  const getInflowIgpRowFSQuery = api.shared.inflowIgpRowFS.get.useQuery();
  const inflowIgpRowFS = getInflowIgpRowFSQuery?.data;

  const getOutflowRowFSQuery = api.shared.outflowRowFS.get.useQuery();

  const outflowRowFS = getOutflowRowFSQuery?.data;
  const sortedOutflowRowFS = sortOutflowRowFS(outflowRowFS ?? []);

  const monthlyActualCash = (monthlyFS ?? []).reduce(
    (acc, month, idx) => {
      const collectionTotal = (inflowCollectionRowFS ?? []).reduce((accu, row) => {
        if (row.monthlyId === month.id) {
          accu += Number(row.amount);
        }
        return accu;
      }, 0);

      const IgpTotal = (inflowIgpRowFS ?? []).reduce((accu, row) => {
        if (row.monthlyId === month.id) {
          accu += Number(row.price) * row.quantity;
        }
        return accu;
      }, 0);

      const outflowTotal = (outflowRowFS ?? []).reduce((accu, row) => {
        if (row.monthlyId === month.id) {
          accu += Number(row.price) * row.quantity;
        }
        return accu;
      }, 0);

      acc.push((acc[idx] ?? 0) + collectionTotal + IgpTotal - outflowTotal);
      console.log(collectionTotal);
      return acc;
    },
    [Number(FS?.actualCash)] as number[]
  );

  return (
    <>
      <div className="mx-auto my-0 mb-16 flex min-h-[100vh] flex-col items-center p-4">
        <div className="flex flex-col items-center">
          <div className="font-bold">{orgSignatoryInfo?.organization.name}</div>
          <div className="capitalize">{reportSem?.term.toLowerCase()} Semester Cash Flow</div>
        </div>
        {monthlyFS?.map((monthly, monthlyIdx) => (
          <Fragment key={monthly.id}>
            <SemCFMonth
              monthly={monthly as MonthlyFS}
              orgSignatoryInfo={
                orgSignatoryInfo as inferRouterOutputs<AppRouter>['shared']['orgSignatoryInfo']['get']
              }
              FS={FS as FinancialStatement}
              monthlyActualCash={monthlyActualCash[monthlyIdx] ?? 0}
            />
          </Fragment>
        ))}
      </div>
    </>
  );
}
