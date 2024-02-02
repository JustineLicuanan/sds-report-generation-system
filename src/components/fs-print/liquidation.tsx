import { FinancialStatement, MonthlyFS } from '@prisma/client';
import { inferRouterOutputs } from '@trpc/server';
import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import { logo } from '~/meta';
import { AppRouter } from '~/server/api/root';
import { api } from '~/utils/api';
import { sortOutflowRowFS } from '~/utils/sort-outflow-fs';

export default function Liquidation({
  monthly,
  orgSignatoryInfo,
  FS,
}: {
  monthly: MonthlyFS;
  orgSignatoryInfo: inferRouterOutputs<AppRouter>['shared']['orgSignatoryInfo']['get'];
  FS: FinancialStatement;
}) {
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
            <div className="text-center font-bold">{orgSignatoryInfo?.organization.name}</div>
            <div className="">{orgSignatoryInfo?.organization.contactEmail}</div>
          </div>
          <Image
            src={logo.SDS_LOGO}
            alt="Bagong Pilipinas"
            height={100}
            width={100}
            className="h-24 w-24 "
          />
          {orgSignatoryInfo?.organization.image ? (
            <div className="h-24 w-24">
              <CldImage
                width="96"
                height="96"
                src={orgSignatoryInfo?.organization.imageId ?? ''}
                alt={`${orgSignatoryInfo?.organization.acronym} Logo`}
                className="rounded-full"
              />
            </div>
          ) : (
            <div className="h-24 w-24 rounded-full border"></div>
          )}
        </div>

        <div>
          <div className="flex flex-col items-center">
            <div className="font-bold">LIQUIDATION REPORT</div>
            <div className="font-bold">CLEAN UP DRIVE (RESO 001)</div>
          </div>
        </div>
        <table className="w-full">
          <tbody>
            <tr className="">
              <td className="w-[85%]">Cash on hand</td>
              <td className="w-[2%] text-end">P</td>
              <td className="w-[13%] text-end ">{Number(FS.actualCash)}</td>
            </tr>

            <tr className="">
              <td colSpan={3} className="w-[100%] font-bold">
                LESS: Expenses Paid
              </td>
            </tr>

            {sortedOutflowRowFS.map((outflowRow, outflowRowIdxL) => (
              <tr key={outflowRowIdxL}>
                <td colSpan={2} className="w-[85%] ps-8 capitalize">
                  {outflowRow[0].toLowerCase().replace(/_/g, ' ')} (Schedule {outflowRowIdxL + 1})
                </td>
                <td className="w-[15%]  text-end ">
                  {outflowRow[1].reduce((acc, row) => acc + Number(row.price) * row.quantity, 0)}
                </td>
              </tr>
            ))}
            <tr>
              <td className="w-[85%] font-bold">TOTAL OUTFLOWS</td>
              <td className="w-[2%] text-end font-bold">P</td>
              <td
                className="w-[13%] border-y text-end font-bold"
                style={{ borderBottom: 'double' }}
              >
                (
                {sortedOutflowRowFS.reduce(
                  (acc, outflowRow) =>
                    acc +
                    outflowRow[1].reduce((acc, row) => acc + Number(row.price) * row.quantity, 0),
                  0
                )}
                )
              </td>
            </tr>

            <tr>
              <td className="w-[85%]  font-bold">EXCESS (DEFICIT) CASH</td>
              <td className="w-[2%] text-end font-bold">P</td>
              <td
                className="w-[13%] border-y text-end font-bold"
                style={{ borderBottom: 'double' }}
              >
                {Number(FS.actualCash) -
                  sortedOutflowRowFS.reduce(
                    (acc, outflowRow) =>
                      acc +
                      outflowRow[1].reduce((acc, row) => acc + Number(row.price) * row.quantity, 0),
                    0
                  )}
              </td>
            </tr>
          </tbody>
        </table>
        {sortedOutflowRowFS.map((outflowRow, outflowRowIdx) => (
          <div className="flex w-full flex-col gap-4" key={outflowRow[0]}>
            <div className="w-full text-left font-bold capitalize">
              Schedule {outflowRowIdx + 1}: {outflowRow[0].toLowerCase().replace(/_/g, ' ')}
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
      </div>
    </>
  );
}
