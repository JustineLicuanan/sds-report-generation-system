import { GetServerSideProps } from 'next';
import Head from 'next/head';
import ExpenseSummary from '~/components/fs-print/expense-summary';
import Liquidation from '~/components/fs-print/liquidation';
import MonthCashFlow from '~/components/fs-print/month-cash-flow';
import MonthLabel from '~/components/fs-print/month-label';
import MonthNotes from '~/components/fs-print/month-notes';
import MonthSignatories from '~/components/fs-print/month-signatories';
import SemCashFlow from '~/components/fs-print/semester-cash-flow';
import SemSignatories from '~/components/fs-print/semester-signatories';
import { meta } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
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
  return (
    <>
      <Head>
        <title>{`Compiled Financial Statement ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>
      <SemCashFlow />
      <SemSignatories />
      <MonthLabel />
      <ExpenseSummary />
      <ExpenseSummary />
      <MonthCashFlow />
      <MonthNotes />
      <MonthSignatories />
      <Liquidation />
    </>
  );
}
