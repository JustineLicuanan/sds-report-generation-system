import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
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

export default function OrganizationPage() {
  return (
    <>
      <Head>
        <title>{`Financial Statement ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />

      <main className="flex">
        {/* SIDE BAR*/}
        <OrganizationSideBarMenu />
        <div id="main-content" className="mx-4 my-4  w-full  gap-8">
          <div className="mb-4 text-center text-4xl font-bold">Financial Statement</div>

          <div className="grid grid-cols-4 grid-rows-2 gap-4">
            <div className="col-span-2 row-span-2 flex flex-col items-center justify-center gap-2 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
              <div className="text-lg font-bold">Submit a Financial Statement</div>
              <div className="text-center font-medium">
                Submit a concise financial statement that provides a brief overview of the
                organization's financial status and transactions.
              </div>
              <button
                type="button"
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Upload
              </button>
            </div>

            <div className="col-span-2 row-span-1 flex flex-col gap-2 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
              <div className="text-lg font-bold">NOTE</div>
              <div className="font-medium">
                Regularly update and organize your financial records for efficient analysis.
              </div>
            </div>

            <div className="col-span-2 row-span-1 flex flex-col items-center justify-center  gap-2 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
              <div className="text-lg font-bold">Generate Financial Statement</div>
              <div className="text-center font-medium">
                The generated file will be based on the info below.
              </div>
              <button
                type="button"
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Generate
              </button>
            </div>
          </div>
          <div className="mt-4 min-h-[40vh] rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="mb-4 text-center text-2xl font-bold">First Semester 2023 - 2024</div>
            <div className="border-sm  my-2 flex items-center justify-between gap-2 border border-input">
              <div className="flex w-1/2 items-center justify-between gap-2  p-2">
                <div className="text-lg font-bold">Month of September</div>
                <button
                  type="button"
                  className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                >
                  Modify
                </button>
              </div>
              <div className="flex w-1/2 items-center justify-between gap-2 p-2">
                <div className="text-lg font-bold">Generate:</div>
                <button
                  type="button"
                  className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                >
                  Cashflow
                </button>
                <button
                  type="button"
                  className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                >
                  Profit/Loss
                </button>
                <button
                  type="button"
                  className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                >
                  Financial Position
                </button>
              </div>
            </div>
            <div className="border-sm  my-2 flex items-center justify-between gap-2 border border-input">
              <div className="flex w-1/2 items-center justify-between gap-2  p-2">
                <div className="text-lg font-bold">Month of October</div>
                <button
                  type="button"
                  className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                >
                  Modify
                </button>
              </div>
              <div className="flex w-1/2 items-center justify-between gap-2 p-2">
                <div className="text-lg font-bold">Generate:</div>
                <button
                  type="button"
                  className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                >
                  Cashflow
                </button>
                <button
                  type="button"
                  className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                >
                  Profit/Loss
                </button>
                <button
                  type="button"
                  className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                >
                  Financial Position
                </button>
              </div>
            </div>
            <div className="border-sm  my-2 flex items-center justify-between gap-2 border border-input">
              <div className="flex w-1/2 items-center justify-between gap-2  p-2">
                <div className="text-lg font-bold">Month of November</div>
                <button
                  type="button"
                  className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                >
                  Modify
                </button>
              </div>
              <div className="flex w-1/2 items-center justify-between gap-2 p-2">
                <div className="text-lg font-bold">Generate:</div>
                <button
                  type="button"
                  className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                >
                  Cashflow
                </button>
                <button
                  type="button"
                  className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                >
                  Profit/Loss
                </button>
                <button
                  type="button"
                  className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                >
                  Financial Position
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
