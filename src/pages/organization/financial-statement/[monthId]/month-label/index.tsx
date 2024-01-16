import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { meta } from '~/meta';
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

export default function MonthLabel() {
  const router = useRouter();
  const monthId = router.query.monthId;
  const getMonthlyFSQuery = api.shared.monthlyFS.get.useQuery({
    where: { id: monthId as string },
  });
  const monthlyFS = getMonthlyFSQuery?.data?.[0];
  return (
    <>
      <Head>
        <title>{`Month Label ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>
      <div className="mx-auto my-0 flex h-[100vh] flex-col items-center justify-center p-4">
        <div className="text-6xl font-bold uppercase">
          {getMonthName(monthlyFS?.month as number)}
        </div>
      </div>
    </>
  );
}
