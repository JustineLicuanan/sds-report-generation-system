import { FinancialStatement, MonthlyFS } from '@prisma/client';
import { inferRouterOutputs } from '@trpc/server';
import { CldImage } from 'next-cloudinary';
import { AppRouter } from '~/server/api/root';
import { api } from '~/utils/api';
import { parseSignatoryObject } from '~/utils/parse-signatory-object';
import { sortOutflowRowFS } from '~/utils/sort-outflow-fs';

export default function Receipt({
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

  const getReportSignatoryQuery = api.shared.reportSignatory.get.useQuery();
  const repSignatory = getReportSignatoryQuery?.data ?? [];
  const signatories = parseSignatoryObject(repSignatory);

  return (
    <>
      <div className="mx-auto my-0 flex min-h-[500vh] flex-col items-center ">
        <div className="mb-16 flex min-h-[100vh] flex-col items-center justify-center text-6xl">
          RECEIPTS
        </div>

        <div className="mb-16 flex min-h-[100vh]  flex-col items-center justify-center  text-6xl">
          COLLECTIONS
        </div>
        <div className="mb-16 flex min-h-[100vh] flex-col items-center gap-4 ">
          {inflowCollectionRowFS?.map((collectionRow, collectionRowIdxR) => (
            <div key={collectionRowIdxR} className="w-full">
              {collectionRow?.receiptId ? (
                <div className="h-48 w-48">
                  <CldImage
                    width="96"
                    height="96"
                    src={collectionRow?.receiptId ?? ''}
                    alt={`Collection Receipt`}
                    className="h-48 w-48"
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
          ))}
        </div>
        <div className="mb-16 flex min-h-[100vh] w-full  flex-col items-center justify-end ">
          <div className="flex justify-between gap-32">
            <div className="flex flex-col items-center gap-4">
              <div>Verified and Checked by:</div>
              <div className="mt-4 flex flex-col items-center">
                <div>{orgSignatoryInfo?.treasurer === '' ? '[NAME]' : orgSignatoryInfo?.treasurer}</div>
                <div>{orgSignatoryInfo?.organization.acronym} Treasurer</div>
              </div>
              <div className="mt-4 flex flex-col items-center font-bold">
                <div>{signatories['CSG Treasurer']}</div>
                <div>CSG Treasurer</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div>Audited by:</div>
              <div className="mt-4 flex flex-col items-center">
                <div>{orgSignatoryInfo?.auditor === '' ? '[NAME]' : orgSignatoryInfo?.auditor}</div>
                <div>{orgSignatoryInfo?.organization.acronym} Auditor</div>
              </div>
              <div className="mt-4 flex flex-col items-center font-bold">
                <div>{signatories['CSG Auditor']}</div>
                <div>CSG Auditor</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16 flex min-h-[100vh]  flex-col items-center justify-center  text-6xl ">
          IGP
        </div>
        <div className="mb-16 flex min-h-[100vh] flex-col items-center gap-4 text-6xl ">
          {inflowIgpRowFS?.map((IgpRow, IgpRowIdxR) => (
            <div key={IgpRowIdxR} className="w-full">
              {IgpRow?.receiptId ? (
                <div className="h-48 w-48">
                  <CldImage
                    width="96"
                    height="96"
                    src={IgpRow?.receiptId ?? ''}
                    alt={`IGP Receipt`}
                    className="h-48 w-48"
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
          ))}
        </div>

        <div className="mb-16 flex min-h-[100vh] w-full  flex-col items-center justify-end ">
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

        <div className="mb-16 flex min-h-[100vh]  flex-col items-center justify-center  text-6xl ">
          Expenses
        </div>
        <div className="mb-16 flex min-h-[100vh]   flex-col items-center justify-center  text-6xl "></div>
        {sortedOutflowRowFS.map((outflowRow, outflowRowIdxR) => (
          <div className="min-h-[300vh]" key={outflowRowIdxR}>
            <div className="mb-16 flex min-h-[100vh]  flex-col items-center justify-center text-center text-6xl capitalize">
              {outflowRow[0].toLowerCase().replace(/_/g, ' ')} Receipts
            </div>
            <div className="mb-32 flex min-h-[100vh] flex-col items-center gap-4">
              {outflowRow[1].map((row, outflowRowIdxR) => (
                <div key={outflowRowIdxR}>
                  {row?.receiptId ? (
                    <div className="">
                      <CldImage
                        width="192"
                        height="192"
                        src={row?.receiptId ?? ''}
                        alt={`Collection Receipt`}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              ))}
            </div>

            <div className="mb-16 flex min-h-[100vh] w-full  flex-col items-center justify-end ">
              <div className="flex justify-between gap-32">
                <div className="flex flex-col items-center gap-4">
                  <div>Verified and Checked by:</div>
                  <div className="mt-4 flex flex-col items-center">
                    <div className="font-bold">
                      {orgSignatoryInfo?.treasurer === '' ? '[NAME]' : orgSignatoryInfo?.treasurer}
                    </div>
                    <div>[ORG] Treasurer</div>
                  </div>
                  <div className="mt-4 flex flex-col items-center font-bold">
                    <div className="font-bold">
                      {orgSignatoryInfo?.adviser1 === '' ? '[NAME]' : orgSignatoryInfo?.adviser1}
                    </div>
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
        ))}
      </div>
    </>
  );
}
