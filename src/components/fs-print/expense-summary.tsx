import { FinancialStatement, MonthlyFS } from '@prisma/client';
import { inferRouterOutputs } from '@trpc/server';
import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import { logo } from '~/meta';
import { AppRouter } from '~/server/api/root';

export default function ExpenseSummary({
  monthly,
  orgSignatoryInfo,
  FS,
}: {
  monthly: MonthlyFS;
  orgSignatoryInfo: inferRouterOutputs<AppRouter>['shared']['orgSignatoryInfo']['get'];
  FS: FinancialStatement;
}) {
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
