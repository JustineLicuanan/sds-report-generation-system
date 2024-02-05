import { FinancialStatement, MonthlyFS, ReportSemester } from '@prisma/client';
import { inferRouterOutputs } from '@trpc/server';
import { Printer } from 'lucide-react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import ExpenseSummary from '~/components/fs-print/expense-summary';
import FrontPageFS from '~/components/fs-print/front-page';
import Liquidation from '~/components/fs-print/liquidation';
import MonthCashFlow from '~/components/fs-print/month-cash-flow';
import MonthLabel from '~/components/fs-print/month-label';
import MonthNotes from '~/components/fs-print/month-notes';
import MonthSignatories from '~/components/fs-print/month-signatories';
import Receipt from '~/components/fs-print/receipt';
import SemCashFlow from '~/components/fs-print/semester-cash-flow';
import SemSignatories from '~/components/fs-print/semester-signatories';
import { meta } from '~/meta';
import { AppRouter } from '~/server/api/root';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.organization(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function CompiledFS() {
  const router = useRouter();

  // Signatories
  const getReportSem = api.shared.reportSemester.get.useQuery();
  const reportSem = getReportSem.data;

  const getOrgSignatoryInfo = api.shared.orgSignatoryInfo.get.useQuery({
    include: { organization: true },
  });
  const orgSignatoryInfo = getOrgSignatoryInfo.data;

  // Month
  const getMonthlyFSQuery = api.shared.monthlyFS.get.useQuery();
  const monthlyFS = getMonthlyFSQuery?.data;

  // FS
  const getFSQuery = api.shared.FS.getOrCreate.useQuery();
  const FS = getFSQuery?.data;

  const getInflowCollectionRowFSQuery = api.shared.inflowCollectionRowFS.get.useQuery();
  const inflowCollectionRowFS = getInflowCollectionRowFSQuery?.data;

  const getInflowIgpRowFSQuery = api.shared.inflowIgpRowFS.get.useQuery();
  const inflowIgpRowFS = getInflowIgpRowFSQuery?.data;

  const getOutflowRowFSQuery = api.shared.outflowRowFS.get.useQuery();
  const outflowRowFS = getOutflowRowFSQuery?.data;

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
      return acc;
    },
    [Number(FS?.actualCash)] as number[]
  );

  return (
    <>
      <Head>
        <title>{`Compiled Financial Statement ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>
      <FrontPageFS
        reportSem={reportSem as ReportSemester}
        orgSignatoryInfo={
          orgSignatoryInfo as inferRouterOutputs<AppRouter>['shared']['orgSignatoryInfo']['get']
        }
      />
      <SemCashFlow
        reportSem={reportSem as ReportSemester}
        orgSignatoryInfo={
          orgSignatoryInfo as inferRouterOutputs<AppRouter>['shared']['orgSignatoryInfo']['get']
        }
      />
      <SemSignatories
        reportSem={reportSem as ReportSemester}
        orgSignatoryInfo={
          orgSignatoryInfo as inferRouterOutputs<AppRouter>['shared']['orgSignatoryInfo']['get']
        }
      />
      {monthlyFS?.map((monthly, monthlyIndex) => {
        return (
          <Fragment key={monthly.id}>
            <MonthLabel monthly={monthly as MonthlyFS} />
            <ExpenseSummary
              monthly={monthly as MonthlyFS}
              orgSignatoryInfo={
                orgSignatoryInfo as inferRouterOutputs<AppRouter>['shared']['orgSignatoryInfo']['get']
              }
              monthlyActualCash={monthlyActualCash[monthlyIndex] ?? 0}
            />
            <MonthCashFlow
              monthly={monthly as MonthlyFS}
              orgSignatoryInfo={
                orgSignatoryInfo as inferRouterOutputs<AppRouter>['shared']['orgSignatoryInfo']['get']
              }
              FS={FS as FinancialStatement}
              monthlyActualCash={monthlyActualCash[monthlyIndex] ?? 0}
            />
            <MonthNotes
              monthly={monthly as MonthlyFS}
              orgSignatoryInfo={
                orgSignatoryInfo as inferRouterOutputs<AppRouter>['shared']['orgSignatoryInfo']['get']
              }
              FS={FS as FinancialStatement}
            />
            <MonthSignatories
              monthly={monthly as MonthlyFS}
              reportSem={reportSem as ReportSemester}
              orgSignatoryInfo={
                orgSignatoryInfo as inferRouterOutputs<AppRouter>['shared']['orgSignatoryInfo']['get']
              }
            />
            <Receipt
              monthly={monthly as MonthlyFS}
              orgSignatoryInfo={
                orgSignatoryInfo as inferRouterOutputs<AppRouter>['shared']['orgSignatoryInfo']['get']
              }
              FS={FS as FinancialStatement}
            />
            <Liquidation
              orgSignatoryInfo={
                orgSignatoryInfo as inferRouterOutputs<AppRouter>['shared']['orgSignatoryInfo']['get']
              }
              monthly={monthly as MonthlyFS}
              FS={FS as FinancialStatement}
              monthlyActualCash={monthlyActualCash[monthlyIndex] ?? 0}
            />
          </Fragment>
        );
      })}
      <button
        type="button"
        onClick={() => window.print()}
        className="fixed bottom-8 right-8 rounded-full bg-yellow p-4 text-6xl active:scale-95 print:hidden"
      >
        <Printer />
      </button>
    </>
  );
}
