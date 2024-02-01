import { FinancialStatement, MonthlyFS } from '@prisma/client';
import { inferRouterOutputs } from '@trpc/server';
import { AppRouter } from '~/server/api/root';
import { api } from '~/utils/api';
import { getMonthName } from '~/utils/get-month-name';
import { sortOutflowRowFS } from '~/utils/sort-outflow-fs';

export default function MonthNotes({
  monthly,
  orgSignatoryInfo,
  FS,
}: {
  monthly: MonthlyFS;
  orgSignatoryInfo: inferRouterOutputs<AppRouter>['shared']['orgSignatoryInfo']['get'];
  FS: FinancialStatement;
}) {
  const getInflowCollectionRowFSQuery = api.shared.inflowCollectionRowFS.get.useQuery({
    where: { monthlyId: monthly.id as string },
  });
  const inflowCollectionRowFS = getInflowCollectionRowFSQuery?.data;

  const getInflowIgpRowFSQuery = api.shared.inflowIgpRowFS.get.useQuery({
    where: { monthlyId: monthly.id as string },
  });
  const inflowIgpRowFS = getInflowIgpRowFSQuery?.data;

  const getOutflowRowFSQuery = api.shared.outflowRowFS.get.useQuery({
    where: { monthlyId: monthly.id as string },
  });

  const outflowRowFS = getOutflowRowFSQuery?.data;
  const sortedOutflowRowFS = sortOutflowRowFS(outflowRowFS ?? []);

  return (
    <>
      <div className="mx-auto my-0 mb-16 flex min-h-[100vh] w-[700px] flex-col items-center gap-4 p-4 leading-5">
        <div className="flex flex-col items-center">
          <div className="font-bold">{orgSignatoryInfo?.organization.name}</div>
          <div>Notes to Financial Statement</div>
          <div>
            {getMonthName(monthly?.month as number)} {monthly?.year}
          </div>
        </div>
        <table className="w-full">
          <tbody>
            <tr>
              <td className="w-[100%] font-bold" colSpan={3}>
                Note 1: Revenue
              </td>
            </tr>
            <tr>
              <td className="w-[100%] border ps-8" colSpan={3}>
                Inflows
              </td>
            </tr>
            <tr className="">
              <td className="w-[85%] border border-r-0 ps-16">Collection (Schedule 1)</td>
              <td className="w-[2%] border-y pe-1 text-end">P</td>
              <td className="w-[13%] border text-end ">50.00</td>
            </tr>
            <tr>
              <td colSpan={2} className="w-[90%] border ps-16">
                IGP (Schedule 2)
              </td>
              <td className="w-[13%] border text-end">50.00</td>
            </tr>
            <tr>
              <td className="w-[85%] border border-r-0 font-bold">Total Inflows</td>
              <td className="w-[2%] border-y pe-1 text-end font-bold">P</td>
              <td className="w-[13%] border text-end font-bold" style={{ borderBottom: 'double' }}>
                100.00
              </td>
            </tr>
          </tbody>
        </table>

        <table className="w-full">
          <tbody>
            <tr>
              <td className="w-[100%] font-bold" colSpan={3}>
                Note 2: Expenses
              </td>
            </tr>
            <tr>
              <td className="w-[100%] border ps-8" colSpan={3}>
                Outflows
              </td>
            </tr>
            {sortedOutflowRowFS.map((outflowRow) => (
              <tr className="">
                <td className="w-[85%] border border-r-0 ps-16">Food Expense (Schedule 1)</td>
                <td className="w-[2%] border-y pe-1 text-end">P</td>
                <td className="w-[13%] border text-end ">2.00</td>
              </tr>
            ))}

            <tr>
              <td className="w-[85%] border border-r-0 font-bold">Total Outflows</td>
              <td className="w-[2%] border-y pe-1 text-end font-bold">P</td>
              <td className="w-[13%] border text-end font-bold" style={{ borderBottom: 'double' }}>
                10.00
              </td>
            </tr>
          </tbody>
        </table>

        {/* Note 1 */}
        <div className="w-full text-left font-bold">Note 1: Revenue</div>
        <>
          <div className="w-full ps-8 text-left font-bold">Schedule 1: Collection</div>

          <table className="w-full">
            <thead>
              <tr>
                <th className="w-[15%] border">DATE</th>
                <th className="w-[55%] border">NAME</th>
                <th className="w-[15%] border">OR NO.</th>
                <th className="w-[15%] border">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {inflowCollectionRowFS?.map((collectionRow, index) => (
                <tr key={index} className="text-center">
                  <td className=" border">{collectionRow.date.toISOString().split('T')[0]}</td>
                  <td className=" border">{collectionRow.name}</td>
                  <td className=" border">{collectionRow.ORNumber}</td>
                  <td className=" border">
                    <div className="flex justify-between px-1">
                      <div>P</div>
                      <div>{Number(collectionRow.amount)}</div>
                    </div>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} className="border text-end font-bold">
                  TOTAL
                </td>
                <td
                  colSpan={3}
                  className="border text-end font-bold"
                  style={{ borderBottom: 'double' }}
                >
                  <div className="flex justify-between  px-1">
                    <div>P</div>
                    <div>50.00</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="w-full ps-8 text-left font-bold">Schedule 2: IGP</div>

          <table className="w-full">
            <thead>
              <tr key="index">
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
              {inflowIgpRowFS?.map((IgpRow, index) => (
                <tr className="text-center">
                  <td className=" border">{IgpRow.date.toISOString().split('T')[0]}</td>
                  <td className=" border">{IgpRow.quantity}</td>
                  <td className=" border">{IgpRow.particulars}</td>
                  <td className=" border">{IgpRow.ORNumber}</td>
                  <td className=" border">{IgpRow.unit}</td>
                  <td className=" border">{Number(IgpRow.price)}</td>
                  <td className=" border">
                    <div className="flex justify-between px-1">
                      <div>P</div>
                      <div>{Number(IgpRow.price) * IgpRow.quantity}</div>
                    </div>
                  </td>
                </tr>
              ))}

              <tr>
                <td colSpan={6} className="border text-end font-bold">
                  TOTAL
                </td>
                <td className="border text-end font-bold" style={{ borderBottom: 'double' }}>
                  <div className="flex justify-between  px-1">
                    <div>P</div>
                    <div>250.00</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </>

        {/* Note 2 */}
        <div className="w-full text-left font-bold">Note 2: Expenses</div>
        <>
          <div className="w-full ps-8 text-left font-bold">Schedule 1: Food</div>
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
                <td className=" border">2 PC CHICKENJOY</td>
                <td className=" border">PC/S</td>
                <td className=" border">250</td>
                <td className=" border">
                  <div className="flex justify-between px-1">
                    <div>P</div>
                    <div>1</div>
                  </div>
                </td>
              </tr>
              <tr className="text-center">
                <td className=" border">9/21/2023</td>
                <td className=" border">1</td>
                <td className=" border">SPAGHETTI</td>
                <td className=" border">PC/S</td>
                <td className=" border">100</td>
                <td className=" border">
                  <div className="flex justify-end px-1">
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
                    <div>2.00</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="w-full ps-8 text-left font-bold">Schedule 2: Supplies</div>
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

          <div className="w-full ps-8 text-left font-bold">Schedule 3: Transportation</div>
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

          <div className="w-full ps-8 text-left font-bold">Schedule 4 : Representation </div>
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
        </>
      </div>
    </>
  );
}
