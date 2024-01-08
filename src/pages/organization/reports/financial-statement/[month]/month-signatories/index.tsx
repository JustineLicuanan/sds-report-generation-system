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

export default function MonthSignatories() {
  return (
    <>
      <Head>
        <title>{`Month Signatories ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>
      <div className="mx-auto my-0 flex flex-col items-center p-4">
        <div className="font-bold">Financial Statement ([Month] 2023 - 2024)</div>
        <div className="mt-4 flex flex-col items-center gap-4">
          <div>Prepared By:</div>
          <div className="flex flex-col items-center">
            <div>[NAME]</div>
            <div>[Org Name] Treasurer</div>
          </div>
          <div>Audited By:</div>
          <div className="flex flex-col items-center">
            <div>[NAME]</div>
            <div>[Org Name] Auditor</div>
          </div>
          <div>Checked By:</div>
          <div className="flex flex-col items-center">
            <div>[NAME]</div>
            <div>[Org Name] President</div>
          </div>
          <div>Noted By:</div>
          <div className="flex justify-between gap-32">
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col items-center">
                <div>[NAME]</div>
                <div>[Org Name] Adviser</div>
              </div>
              <div>Verified and Checked by:</div>
              <div className="mt-4 flex flex-col items-center">
                <div>[NAME]</div>
                <div>CSG Treasurer</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col items-center">
                <div>[NAME]</div>
                <div>[Org Name] Adviser</div>
              </div>
              <div>Audited by:</div>
              <div className="mt-4 flex flex-col items-center">
                <div>[NAME]</div>
                <div>CSG Auditor</div>
              </div>
            </div>
          </div>
          <div>Recommending Approval:</div>
          <div className="mt-4 flex flex-col items-center">
            <div>[NAME]</div>
            <div>CSG President</div>
          </div>
        </div>
      </div>
    </>
  );
}
