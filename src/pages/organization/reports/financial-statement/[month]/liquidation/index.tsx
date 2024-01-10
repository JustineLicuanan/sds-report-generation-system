import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { logo, meta } from '~/meta';
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

export default function Liquidation() {
  return (
    <>
      <Head>
        <title>{`Liquidation ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>
      <div className="mx-auto my-0 flex w-[700px] flex-col items-center gap-4 p-4 leading-5">
        <div className="flex gap-2">
          <Image
            src={logo.PHILIPPINE_LOGO}
            alt="Bagong Pilipinas"
            height={100}
            width={100}
            className="h-24 w-24 "
          />
          <Image
            src={logo.CVSU_LOGO}
            alt="Bagong Pilipinas"
            height={100}
            width={100}
            className="h-24 w-24 "
          />
          <div className=" flex flex-col items-center">
            <div>Republic of the Philippines</div>
            <div className="font-bold">CAVITE STATE UNIVERSITY</div>
            <div className="font-bold">Imus Campus</div>
            <div className="font-bold">Student Development Services</div>
            <div className="font-bold">ORG NAME</div>
            <div className="">org gmail account</div>
          </div>
          <Image
            src={logo.SDS_LOGO}
            alt="Bagong Pilipinas"
            height={100}
            width={100}
            className="h-24 w-24 "
          />
          <div className="h-24 w-24 rounded-full border"></div>
        </div>

        <div>
          <div className="flex flex-col items-center">
            <div className="font-bold">LIQUIDATION REPORT</div>
            <div className="font-bold">CLEAN UP DRIVE (RESO 005)</div>
          </div>
        </div>
        <table className="w-full">
          <tbody>
            <tr className="">
              <td className="w-[85%]">Cash on hand</td>
              <td className="w-[2%] text-end">P</td>
              <td className="w-[13%] text-end ">100.00</td>
            </tr>

            <tr className="">
              <td colSpan={3} className="w-[100%] font-bold">
                LESS: Expenses Paid
              </td>
            </tr>

            <tr>
              <td colSpan={2} className="w-[85%] ps-8">
                Food Expense (Schedule 1)
              </td>
              <td className="w-[15%]  text-end ">2.00</td>
            </tr>

            <tr>
              <td colSpan={2} className="w-[85%] ps-8">
                Supplies Expense (Schedule 2)
              </td>
              <td className="w-[15%]  text-end ">3.00</td>
            </tr>

            <tr>
              <td colSpan={2} className="w-[85%] ps-8">
                Transportation Expense (Schedule 3)
              </td>
              <td className="w-[15%]  text-end ">4.00</td>
            </tr>

            <tr>
              <td colSpan={2} className="w-[85%] ps-8">
                Representation Expense (Schedule 4)
              </td>
              <td className="w-[15%]  text-end ">1.00</td>
            </tr>

            <tr>
              <td className="w-[85%] font-bold">TOTAL OUTFLOWS</td>
              <td className="w-[2%] text-end font-bold">P</td>
              <td
                className="w-[13%] border-y text-end font-bold"
                style={{ borderBottom: 'double' }}
              >
                (10.00)
              </td>
            </tr>

            <tr>
              <td className="w-[85%]  font-bold">EXCESS (DEFICIT) CASH</td>
              <td className="w-[2%] text-end font-bold">P</td>
              <td
                className="w-[13%] border-y text-end font-bold"
                style={{ borderBottom: 'double' }}
              >
                20,090.00
              </td>
            </tr>
          </tbody>
        </table>

        <div className="w-full text-left font-bold">Schedule 1: Food Expense</div>

        <table className="w-full">
          <thead>
            <tr>
              <th className=" border">DATE</th>
              <th className=" border">QUANTITY</th>
              <th className=" border">PARTICULARS</th>
              <th className=" border">OR NO.</th>
              <th className=" border">UNIT</th>
              <th className=" border">PRICE</th>
              <th className=" border">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              <td className=" border">9/21/2023</td>
              <td className=" border">1</td>
              <td className=" border">CANDY</td>
              <td className=" border">0011</td>
              <td className=" border">PC/S</td>
              <td className=" border">1</td>
              <td className=" border">
                <div className="flex justify-between px-1">
                  <div>P</div>
                  <div>1</div>
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={6} className="border text-end font-bold">
                TOTAL
              </td>
              <td className="border text-end font-bold" style={{ borderBottom: 'double' }}>
                <div className="flex justify-between  px-1">
                  <div>P</div>
                  <div>1.00</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="w-full text-left font-bold">Schedule 2: Supplies Expenses</div>
        <table className="w-full">
          <thead>
            <tr>
              <th className=" border">DATE</th>
              <th className=" border">QUANTITY</th>
              <th className=" border">PARTICULARS</th>
              <th className=" border">UNIT</th>
              <th className=" border">PRICE</th>
              <th className=" border">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              <td className=" border">9/21/2023</td>
              <td className=" border">1</td>
              <td className=" border">A4 BONDPAPER</td>
              <td className=" border">PC/S</td>
              <td className=" border">3</td>
              <td className=" border">
                <div className="flex justify-between px-1">
                  <div>P</div>
                  <div>3</div>
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={5} className="border text-end font-bold">
                TOTAL
              </td>
              <td className="border text-end font-bold" style={{ borderBottom: 'double' }}>
                <div className="flex justify-between  px-1">
                  <div>P</div>
                  <div>3.00</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="w-full text-left font-bold">Schedule 3: Transportation Expenses</div>
        <table className="w-full">
          <thead>
            <tr>
              <th className=" border">DATE</th>
              <th className=" border">QUANTITY</th>
              <th className=" border">PARTICULARS</th>
              <th className=" border">UNIT</th>
              <th className=" border">PRICE</th>
              <th className=" border">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              <td className=" border">9/21/2023</td>
              <td className=" border">1</td>
              <td className=" border">LALAMOVE</td>
              <td className=" border">PC/S</td>
              <td className=" border">4</td>
              <td className=" border">
                <div className="flex justify-between px-1">
                  <div>P</div>
                  <div>4</div>
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={5} className="border text-end font-bold">
                TOTAL
              </td>
              <td className="border text-end font-bold" style={{ borderBottom: 'double' }}>
                <div className="flex justify-between  px-1">
                  <div>P</div>
                  <div>4.00</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="w-full text-left font-bold">Schedule 4 : Representation Expenses</div>
        <table className="w-full">
          <thead>
            <tr>
              <th className=" border">DATE</th>
              <th className=" border">QUANTITY</th>
              <th className=" border">PARTICULARS</th>
              <th className=" border">UNIT</th>
              <th className=" border">PRICE</th>
              <th className=" border">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              <td className=" border">9/21/2023</td>
              <td className=" border">1</td>
              <td className=" border">PRINTS</td>
              <td className=" border">PC/S</td>
              <td className=" border">1</td>
              <td className=" border">
                <div className="flex justify-between px-1">
                  <div>P</div>
                  <div>1</div>
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={5} className="border text-end font-bold">
                TOTAL
              </td>
              <td className="border text-end font-bold" style={{ borderBottom: 'double' }}>
                <div className="flex justify-between  px-1">
                  <div>P</div>
                  <div>1.00</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
