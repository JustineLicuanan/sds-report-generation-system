import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
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

export default function ModifyFinancialStatementPage() {
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
          <div className="mb-4 text-center text-4xl font-bold">September 2023</div>
          <div className="grid grid-cols-2 grid-rows-4 gap-4">
            {/* INFLOWS */}
            <div className="col-span-1 row-span-2 flex justify-between gap-2 rounded-sm p-4 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
              <div className="flex gap-2">
                <label htmlFor="inflows" className="text-lg font-bold">
                  Inflows:
                </label>
                <select name="" id="inflows" className="rounded-sm border p-1">
                  <option value="collection">Collection</option>
                  <option value="igp">IGP</option>
                </select>
              </div>
              <button
                type="button"
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Add
              </button>
            </div>

            {/* NET */}
            <div className="col-span-1 row-span-4 flex flex-col justify-between gap-2 rounded-sm p-4 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
              <select name="" id="inflows" className="self-end rounded-sm border p-2">
                <option value="collection">Collection</option>
                <option value="igp">IGP</option>
              </select>
              <div>Net (Gross/Loss): </div>
              <div className="text-center text-4xl font-bold">[Value]</div>
            </div>

            {/* OUTFLOWS */}
            <div className="col-span-1 row-span-2 flex justify-between gap-2 rounded-sm p-4 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
              <div className="flex gap-2">
                <label htmlFor="inflows" className="text-lg font-bold">
                  Outflows:
                </label>
                <select name="" id="inflows" className="rounded-sm border p-1">
                  <option value="collection">Collection</option>
                  <option value="igp">IGP</option>
                </select>
              </div>
              <button
                type="button"
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Add
              </button>
            </div>
          </div>
          {/* TABLE */}
          <div className="mt-4 flex min-h-[40vh] w-full flex-col gap-2 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="flex justify-end">
              <input
                name="search"
                id="search-item"
                placeholder="Search"
                className="h-7 rounded-l-sm border-[1px] border-green px-2 py-2 outline-none"
              />
              <label
                htmlFor="search-item"
                className="flex h-7 w-11 items-center  rounded-r-sm border-[1px] border-l-0 border-green  px-2"
              >
                <Image
                  width={100}
                  height={100}
                  src="/search_icon.svg"
                  className="md:h-full "
                  alt="Search Icon"
                />
              </label>
            </div>
            <table className="w-full min-w-max border-collapse  border border-black text-center">
              <thead>
                <tr>
                  <th className=" border-r-0 border-black bg-green p-1 text-lg font-bold tracking-tight text-white ">
                    Type
                  </th>
                  <th className=" border-r-0 border-black bg-green p-1 text-lg font-bold tracking-tight text-white ">
                    Category
                  </th>
                  <th className=" border-r-0 border-black bg-green p-1 text-lg font-bold tracking-tight text-white ">
                    Schedule No.
                  </th>
                  <th className=" border-r-0 border-black bg-green p-1 text-lg font-bold tracking-tight text-white ">
                    Date
                  </th>
                  <th className=" border-r-0 border-black bg-green p-1 text-lg font-bold tracking-tight text-white ">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="even:bg-[#808080]/20">
                  <td className="border border-x-0 border-black py-2 text-base">Inflow</td>
                  <td className="border border-x-0 border-black py-2 text-base">IGP</td>
                  <td className="border border-x-0 border-black py-2 text-base">S-001</td>
                  <td className="border border-x-0 border-black py-2 text-base">12/26/2023 </td>
                  <td className="border border-x-0 border-black py-2 text-base">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                      >
                        Add details
                      </button>
                      <button
                        type="button"
                        className="rounded-sm border border-red bg-red px-3 text-white active:scale-95"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
