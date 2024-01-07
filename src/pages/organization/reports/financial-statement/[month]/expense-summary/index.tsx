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

export default function MonthLabel() {
  return (
    <>
      <Head>
        <title>{`Expense Summary ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>
      <div className="mx-auto my-0 flex w-[700px] flex-col items-center gap-4  p-4">
        <div className="flex gap-2">
          <div className="h-24 w-24 rounded-full border"></div>
          <div className="h-24 w-24 rounded-full border"></div>
          <div className=" flex flex-col items-center">
            <div>Republic of the Philippines</div>
            <div className="font-bold">CAVITE STATE UNIVERSITY</div>
            <div className="font-bold">Imus Campus</div>
            <div className="font-bold">Student Development Services</div>
            <div className="font-bold">ORG NAME</div>
            <div className="">org gmail account</div>
          </div>
          <div className="h-24 w-24 rounded-full border"></div>
          <div className="h-24 w-24 rounded-full border"></div>
        </div>
        <div>
          <div className="flex flex-col items-center">
            <div className="font-bold">ORG NAME</div>
            <div className="font-bold">Statement of Cash Flow</div>
            <div className="font-bold">As of September 30, 2023</div>
          </div>
          <div className="bg-gray">
            <div className=" font-bold">Inflows</div>
            <div className=" flex w-full justify-between gap-32">
              <div className="ms-4">Collection (Schedule 1(Schedule 1)</div>
              <div className="">P 50</div>
            </div>
            <div className=" flex w-full justify-between gap-32">
              <div className="ms-4">IGP (Schedule 2)</div>
              <div className="">P 50</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
