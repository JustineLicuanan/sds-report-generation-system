import { FinancialStatement, MonthlyFS, ReportSemester } from '@prisma/client';
import { inferRouterOutputs } from '@trpc/server';
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
  const monthlyId = router.query.monthlyId;

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
      <SemCashFlow />
      <SemSignatories
        reportSem={reportSem as ReportSemester}
        orgSignatoryInfo={
          orgSignatoryInfo as inferRouterOutputs<AppRouter>['shared']['orgSignatoryInfo']['get']
        }
      />
      {monthlyFS?.map((monthly) => {
        return (
          <Fragment key={monthly.id}>
            <MonthLabel monthly={monthly as MonthlyFS} />
            <ExpenseSummary
              monthly={monthly as MonthlyFS}
              orgSignatoryInfo={
                orgSignatoryInfo as inferRouterOutputs<AppRouter>['shared']['orgSignatoryInfo']['get']
              }
              FS={FS as FinancialStatement}
            />
            <MonthCashFlow
              monthly={monthly as MonthlyFS}
              orgSignatoryInfo={
                orgSignatoryInfo as inferRouterOutputs<AppRouter>['shared']['orgSignatoryInfo']['get']
              }
              FS={FS as FinancialStatement}
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
            <Liquidation />
          </Fragment>
        );
      })}
    </>
  );
}
