import { type GetServerSideProps } from 'next';
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
        <title>{`Receipts ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>
      <div className="mx-auto my-0 flex flex-col items-center ">
        <div className="mb-16 flex h-[100vh] flex-col items-center justify-center text-6xl">
          RECEIPTS
        </div>

        <div className="mb-16 flex h-[100vh]  flex-col items-center justify-center  text-6xl">
          COLLECTIONS
        </div>
        <div className="mb-16 flex h-[100vh]  flex-col items-center justify-center  text-6xl "></div>
        <div className="mb-16 flex h-[100vh] w-full  flex-col items-center justify-end ">
          <div className="flex justify-between gap-32">
            <div className="flex flex-col items-center gap-4">
              <div>Verified and Checked by:</div>
              <div className="mt-4 flex flex-col items-center">
                <div>[NAME]</div>
                <div>[ORG] Treasurer</div>
              </div>
              <div className="mt-4 flex flex-col items-center font-bold">
                <div>[NAME]</div>
                <div>CSG Treasurer</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div>Audited by:</div>
              <div className="mt-4 flex flex-col items-center">
                <div>[NAME]</div>
                <div>[ORG] Auditor</div>
              </div>
              <div className="mt-4 flex flex-col items-center font-bold">
                <div>[NAME]</div>
                <div>CSG Auditor</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16 flex h-[100vh]  flex-col items-center justify-center  text-6xl ">
          IGP
        </div>
        <div className="mb-16 flex h-[100vh]   flex-col items-center justify-center  text-6xl "></div>
        <div className="mb-16 flex h-[100vh] w-full  flex-col items-center justify-end ">
          <div className="flex justify-between gap-32">
            <div className="flex flex-col items-center gap-4">
              <div>Verified and Checked by:</div>
              <div className="mt-4 flex flex-col items-center">
                <div>[NAME]</div>
                <div>[ORG] Treasurer</div>
              </div>
              <div className="mt-4 flex flex-col items-center font-bold">
                <div>[NAME]</div>
                <div>CSG Treasurer</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div>Audited by:</div>
              <div className="mt-4 flex flex-col items-center">
                <div>[NAME]</div>
                <div>[ORG] Auditor</div>
              </div>
              <div className="mt-4 flex flex-col items-center font-bold">
                <div>[NAME]</div>
                <div>CSG Auditor</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16 flex h-[100vh]  flex-col items-center justify-center  text-6xl ">
          Expenses
        </div>
        <div className="mb-16 flex h-[100vh]   flex-col items-center justify-center  text-6xl "></div>

        <div className="mb-16 flex h-[100vh]  flex-col items-center justify-center  text-6xl ">
          Food Expense Receipts
        </div>

        <div className="mb-16 flex h-[100vh]  flex-col items-center justify-center text-center text-6xl ">
          Supplies Expense Receipts
        </div>
        <div className="mb-16 flex h-[100vh]   flex-col items-center justify-center  text-6xl "></div>
        <div className="mb-16 flex h-[100vh] w-full  flex-col items-center justify-end ">
          <div className="flex justify-between gap-32">
            <div className="flex flex-col items-center gap-4">
              <div>Verified and Checked by:</div>
              <div className="mt-4 flex flex-col items-center">
                <div>[NAME]</div>
                <div>[ORG] Treasurer</div>
              </div>
              <div className="mt-4 flex flex-col items-center font-bold">
                <div>[NAME]</div>
                <div>CSG Treasurer</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div>Audited by:</div>
              <div className="mt-4 flex flex-col items-center">
                <div>[NAME]</div>
                <div>[ORG] Auditor</div>
              </div>
              <div className="mt-4 flex flex-col items-center font-bold">
                <div>[NAME]</div>
                <div>CSG Auditor</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16 flex h-[100vh]  flex-col items-center justify-center text-center text-6xl ">
          Transporation Expense Receipts
        </div>
        <div className="mb-16 flex h-[100vh]   flex-col items-center justify-center  text-6xl "></div>
        <div className="mb-16 flex h-[100vh] w-full  flex-col items-center justify-end ">
          <div className="flex justify-between gap-32">
            <div className="flex flex-col items-center gap-4">
              <div>Verified and Checked by:</div>
              <div className="mt-4 flex flex-col items-center">
                <div>[NAME]</div>
                <div>[ORG] Treasurer</div>
              </div>
              <div className="mt-4 flex flex-col items-center font-bold">
                <div>[NAME]</div>
                <div>CSG Treasurer</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div>Audited by:</div>
              <div className="mt-4 flex flex-col items-center">
                <div>[NAME]</div>
                <div>[ORG] Auditor</div>
              </div>
              <div className="mt-4 flex flex-col items-center font-bold">
                <div>[NAME]</div>
                <div>CSG Auditor</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
