import { GetServerSideProps } from 'next';
import Head from 'next/head';
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

export default function Forms() {
  return (
    <>
      <Head>
        <title>{`Forms ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>
      <div className="mx-auto my-0 flex h-[100vh] flex-col items-center justify-center ">
        <div className="mb-16 flex h-[100vh] items-center justify-center text-6xl">
          RECEIVING FORM
        </div>
        <div className="mb-16 flex h-[100vh] items-center justify-center text-6xl">
          TRANSMITTAL FORM
        </div>
      </div>
    </>
  );
}
