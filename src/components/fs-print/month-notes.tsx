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
      <div
        className={`${
          sortedOutflowRowFS?.length > 2 ? 'mb-32 min-h-[200vh]' : 'mb-16 min-h-[100vh]'
        } mx-auto my-0 flex  w-[700px] flex-col items-center gap-4 p-4 leading-5`}
      >
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
              <td className="w-[13%] border text-end ">
                {inflowCollectionRowFS?.reduce((acc, row) => acc + Number(row.amount), 0)}
              </td>
            </tr>
            <tr>
              <td colSpan={2} className="w-[90%] border ps-16">
                IGP (Schedule 2)
              </td>
              <td className="w-[13%] border text-end">
                {inflowIgpRowFS?.reduce((acc, row) => acc + Number(row.price) * row.quantity, 0)}
              </td>
            </tr>
            <tr>
              <td className="w-[85%] border border-r-0 font-bold">Total Inflows</td>
              <td className="w-[2%] border-y pe-1 text-end font-bold">P</td>
              <td className="w-[13%] border text-end font-bold" style={{ borderBottom: 'double' }}>
                {(inflowCollectionRowFS?.reduce((acc, row) => acc + Number(row.amount), 0) || 0) +
                  (inflowIgpRowFS?.reduce(
                    (acc, row) => acc + Number(row.price) * row.quantity,
                    0
                  ) || 0)}
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
            {sortedOutflowRowFS.map((outflowRow, outflowRowIdx) => (
              <tr key={outflowRowIdx} className="">
                <td className="w-[85%] border border-r-0 ps-16 capitalize">
                  {outflowRow[0].toLowerCase().replace(/_/g, ' ')} (Schedule {outflowRowIdx + 1})
                </td>
                <td className="w-[2%] border-y pe-1 text-end">{outflowRowIdx === 0 ? 'P' : ''}</td>
                <td className="w-[13%] border text-end ">
                  {outflowRow[1].reduce((acc, row) => acc + Number(row.price) * row.quantity, 0)}
                </td>
              </tr>
            ))}

            <tr>
              <td className="w-[85%] border border-r-0 font-bold">Total Outflows</td>
              <td className="w-[2%] border-y pe-1 text-end font-bold">P</td>
              <td className="w-[13%] border text-end font-bold" style={{ borderBottom: 'double' }}>
                {sortedOutflowRowFS.reduce(
                  (acc, outflowRow) =>
                    acc +
                    outflowRow[1].reduce((acc, row) => acc + Number(row.price) * row.quantity, 0),
                  0
                )}
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
              {inflowCollectionRowFS?.map((collectionRow, collectionRowIdx) => (
                <tr key={collectionRow.id} className="text-center">
                  <td className=" border">{collectionRow.date.toISOString().split('T')[0]}</td>
                  <td className=" border">{collectionRow.name}</td>
                  <td className=" border">{collectionRow.ORNumber}</td>
                  <td className=" border">
                    <div className="flex justify-between px-1">
                      <div>{collectionRowIdx === 0 ? 'P' : ''}</div>
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
                    <div>
                      {inflowCollectionRowFS?.reduce((acc, row) => acc + Number(row.amount), 0)}
                    </div>
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
              {inflowIgpRowFS?.map((IgpRow, IgpRowIdx) => (
                <tr key={IgpRow.id} className="text-center">
                  <td className=" border">{IgpRow.date.toISOString().split('T')[0]}</td>
                  <td className=" border">{IgpRow.quantity}</td>
                  <td className=" border">{IgpRow.particulars}</td>
                  <td className=" border">{IgpRow.ORNumber}</td>
                  <td className=" border">{IgpRow.unit}</td>
                  <td className=" border">{Number(IgpRow.price)}</td>
                  <td className=" border">
                    <div className="flex justify-between px-1">
                      <div>{IgpRowIdx === 0 ? 'P' : ' '}</div>
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
                    <div>
                      {inflowIgpRowFS?.reduce(
                        (acc, row) => acc + Number(row.price) * row.quantity,
                        0
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </>

        {/* Note 2 */}
        <div className="w-full text-left font-bold">Note 2: Expenses</div>
        <>
          {sortedOutflowRowFS.map((outflowRow, index) => (
            <div className="flex w-full flex-col gap-4" key={outflowRow[0]}>
              <div className="w-full ps-8 text-left font-bold capitalize">
                Schedule {index + 1}: {outflowRow[0].toLowerCase().replace(/_/g, ' ')}
              </div>
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
                  {outflowRow[1].map((row, outflowRowIdx) => (
                    <tr key={row.id} className="text-center">
                      <td className=" border">{row.date.toISOString().split('T')[0]}</td>
                      <td className=" border">{row.quantity}</td>
                      <td className=" border">{row.particulars}</td>
                      <td className=" border">{row.unit}</td>
                      <td className=" border">{Number(row.price)}</td>
                      <td className=" border">
                        <div className="flex justify-between px-1">
                          <div>{outflowRowIdx === 0 ? 'P' : ' '}</div>
                          <div>{Number(row.price) * row.quantity}</div>
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={5} className="border text-end font-bold">
                      TOTAL
                    </td>
                    <td className="border text-end font-bold" style={{ borderBottom: 'double' }}>
                      <div className="flex justify-between  px-1">
                        <div>P</div>
                        <div>
                          {outflowRow[1].reduce(
                            (acc, row) => acc + Number(row.price) * row.quantity,
                            0
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </>
      </div>
    </>
  );
}
