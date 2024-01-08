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
      <div className="mx-auto my-0 flex w-[700px] flex-col items-center gap-4 p-4 leading-5">
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
            <div className="font-bold">Profit and Loss Statement</div>
            <div className="font-bold">As of [DATE]</div>
          </div>
        </div>
        <table className="w-full">
          <tbody>
            <tr className="">
              <td className="w-[85%]">Revenue (Note 1)</td>
              <td className="w-[2%] text-end">P</td>
              <td className="w-[13%] text-end ">100.00</td>
            </tr>
            <tr>
              <td colSpan={2} className="w-[90%] ">
                Less: Expenses (Note 2)
              </td>
              <td className="w-[13%]  text-end ">(10.00)</td>
            </tr>
            <tr>
              <td className="w-[85%] font-bold">Net Income/(Gross)</td>
              <td className="w-[2%] text-end font-bold">P</td>
              <td
                className="w-[13%] border-y text-end font-bold"
                style={{ borderBottom: 'double' }}
              >
                90.00
              </td>
            </tr>
          </tbody>
        </table>

        <div>
          <div className="flex flex-col items-center">
            <div className="font-bold">ORG NAME</div>
            <div className="font-bold">Statement of Cash Flow</div>
            <div className="font-bold">As of [DATE]</div>
          </div>
        </div>
        <table className="w-full">
          <tbody>
            <tr>
              <td colSpan={3} className="font-bold">
                Inflows
              </td>
            </tr>
            <tr className="">
              <td className="w-[85%] ps-8">Collection (Schedule 1)</td>
              <td className="w-[2%] text-end">P</td>
              <td className="w-[13%] text-end ">50.00</td>
            </tr>
            <tr>
              <td colSpan={2} className="w-[90%] ps-8">
                IGP (Schedule 2)
              </td>
              <td className="w-[13%] text-end ">50.00</td>
            </tr>
            <tr>
              <td className="w-[85%] font-bold">Total Inflows</td>
              <td className="w-[2%] text-end font-bold">P</td>
              <td
                className="w-[13%] border-y text-end font-bold"
                style={{ borderBottom: 'double' }}
              >
                100.00
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="font-bold">
                Outflows
              </td>
            </tr>
            <tr className="">
              <td className="w-[85%] ps-8">Food Expenses (Schedule 1)</td>
              <td className="w-[2%] text-end">P</td>
              <td className="w-[13%] text-end">5.00</td>
            </tr>
            <tr>
              <td colSpan={2} className="w-[90%] ps-8">
                Supplies Expenses (Schedule 2)
              </td>
              <td className="w-[13%] text-end ">7.00</td>
            </tr>
            <tr>
              <td className="w-[85%] font-bold">Total Outflows</td>
              <td className="w-[2%] text-end font-bold">P</td>
              <td
                className="w-[13%] border-y text-end font-bold"
                style={{ borderBottom: 'double' }}
              >
                12.00
              </td>
            </tr>

            <tr>
              <td colSpan={2} className="w-[90%] pt-2 font-bold">
                Net Cash Flow (Inflows)
              </td>
              <td className="w-[13%] pt-2 text-end">88.00</td>
            </tr>
            <tr>
              <td colSpan={2} className="w-[90%] font-bold">
                Add: Cash Balance Remaining as of [DATE]
              </td>
              <td className="w-[13%] text-end ">20,000.00</td>
            </tr>
            <tr>
              <td className="w-[85%] font-bold">Cash</td>
              <td className="w-[2%] text-end font-bold">P</td>
              <td
                className="w-[13%]  border-y text-end font-bold"
                style={{ borderBottom: 'double' }}
              >
                20,088.00
              </td>
            </tr>
          </tbody>
        </table>

        <div>
          <div className="flex flex-col items-center">
            <div className="font-bold">ORG NAME</div>
            <div className="font-bold">Financial Position</div>
            <div className="font-bold">As of [DATE]</div>
          </div>
        </div>
        <table className="w-full">
          <tbody>
            <tr>
              <td colSpan={3} className="font-bold">
                ASSETS
              </td>
            </tr>
            <tr className="">
              <td className="w-[85%] ps-8">Cash</td>
              <td className="w-[2%] text-end">P</td>
              <td className="w-[13%] text-end ">20, 090.00</td>
            </tr>
            <tr>
              <td colSpan={2} className="w-[90%] ps-8">
                Noted Receivable (Note 3)
              </td>
              <td className="w-[13%] text-end ">0.00</td>
            </tr>
            <tr>
              <td className="w-[85%] font-bold">TOTAL ASSETS</td>
              <td className="w-[2%] text-end font-bold">P</td>
              <td
                className="w-[13%] border-y text-end font-bold"
                style={{ borderBottom: 'double' }}
              >
                20, 090.00
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="font-bold">
                EQUITY
              </td>
            </tr>
            <tr className="">
              <td className="w-[85%] ps-8">Fund</td>
              <td className="w-[2%] text-end">P</td>
              <td className="w-[13%] text-end ">20, 000.00</td>
            </tr>
            <tr>
              <td colSpan={2} className="w-[90%] ps-8">
                Net Gross
              </td>
              <td className="w-[13%] text-end ">90.00</td>
            </tr>
            <tr>
              <td className="w-[85%] font-bold">TOTAL EQUITY</td>
              <td className="w-[2%] text-end font-bold">P</td>
              <td
                className="w-[13%] border-y text-end font-bold"
                style={{ borderBottom: 'double' }}
              >
                20, 090.00
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
