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

export default function CBL() {
  return (
    <>
      <Head>
        <title>{`Constitutional and By-Laws ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>
      <div className="mx-auto my-0 flex max-w-[210mm] flex-col items-center justify-center ">
        <div className="mb-16 flex h-[100vh] flex-col items-center justify-center gap-8 text-center">
          <div className="h-80 w-80 rounded-full border-2 bg-green">Org Logo</div>
          <div className="text-6xl">[ORG NAME]</div>
          <div className="text-6xl">CONSTITUTION AND BY-LAWS</div>
        </div>

        <div className="mb-16 flex h-[100vh] flex-col items-center  gap-8 text-justify">
          <div className="flex flex-col items-center gap-4">
            <div className="text-lg font-bold">Preamble</div>
            <div className="text-lg">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores est tempora
              deserunt nemo, quod quis quia nesciunt pariatur, fugit similique suscipit iste eius
              rem dignissimos? Voluptate adipisci iusto unde qui?
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="text-lg font-bold">Mission</div>
            <div className="text-lg">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores est tempora
              deserunt nemo, quod quis quia nesciunt pariatur, fugit similique suscipit iste eius
              rem dignissimos? Voluptate adipisci iusto unde qui?
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="text-lg font-bold">Vision</div>
            <div className="text-lg">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores est tempora
              deserunt nemo, quod quis quia nesciunt pariatur, fugit similique suscipit iste eius
              rem dignissimos? Voluptate adipisci iusto unde qui?
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
