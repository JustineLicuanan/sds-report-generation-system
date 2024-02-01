import { ReportSemester } from '@prisma/client';
import { inferRouterOutputs } from '@trpc/server';
import { AppRouter } from '~/server/api/root';
import { api } from '~/utils/api';
import { parseSignatoryObject } from '~/utils/parse-signatory-object';

export default function SemSignatories({
  reportSem,
  orgSignatoryInfo,
}: {
  reportSem: ReportSemester;
  orgSignatoryInfo: inferRouterOutputs<AppRouter>['shared']['orgSignatoryInfo']['get'];
}) {
  const getReportSignatoryQuery = api.shared.reportSignatory.get.useQuery();
  const repSignatory = getReportSignatoryQuery?.data ?? [];
  const signatories = parseSignatoryObject(repSignatory);

  return (
    <>
      <div className="mx-auto my-0 mb-16 flex min-h-[100vh] flex-col items-center p-4">
        <div className="font-bold capitalize">
          Financial Statement ({reportSem?.term.toLowerCase()} Semester | {reportSem?.yearStart} -{' '}
          {reportSem?.yearEnd})
        </div>
        <div className="mt-4 flex flex-col items-center gap-4">
          <div>Prepared By:</div>
          <div className="flex flex-col items-center">
            <div>{orgSignatoryInfo?.treasurer === '' ? '[NAME]' : orgSignatoryInfo?.treasurer}</div>
            <div>{orgSignatoryInfo?.organization.acronym} Treasurer</div>
          </div>
          <div>Audited By:</div>
          <div className="flex flex-col items-center">
            <div>{orgSignatoryInfo?.auditor === '' ? '[NAME]' : orgSignatoryInfo?.auditor}</div>
            <div>{orgSignatoryInfo?.organization.acronym} Auditor</div>
          </div>
          <div>Checked By:</div>
          <div className="flex flex-col items-center">
            <div>{orgSignatoryInfo?.president === '' ? '[NAME]' : orgSignatoryInfo?.president}</div>
            <div>{orgSignatoryInfo?.organization.acronym} President</div>
          </div>
          <div>Noted By:</div>
          <div className="flex justify-between gap-32">
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col items-center">
                <div>
                  {orgSignatoryInfo?.adviser1 === '' ? '[NAME]' : orgSignatoryInfo?.adviser1}
                </div>
                <div>{orgSignatoryInfo?.organization.acronym} Adviser</div>
              </div>
              <div>Verified and Checked by:</div>
              <div className="mt-4 flex flex-col items-center">
                <div>{signatories['CSG Treasurer']}</div>
                <div>CSG Treasurer</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col items-center">
                <div>
                  {orgSignatoryInfo?.adviser2 === '' ? '[NAME]' : orgSignatoryInfo?.adviser2}
                </div>
                <div>{orgSignatoryInfo?.organization.acronym} Adviser</div>
              </div>
              <div>Audited by:</div>
              <div className="mt-4 flex flex-col items-center">
                <div>{signatories['CSG Auditor']}</div>
                <div>CSG Auditor</div>
              </div>
            </div>
          </div>
          <div>Recommending Approval:</div>
          <div className="mt-4 flex flex-col items-center">
            <div>{signatories['CSG President']}</div>
            <div>CSG President</div>
          </div>
          <div className="mt-4 flex justify-between gap-32">
            <div className="flex flex-col items-center">
              <div>{signatories['SDS Coordinator']}</div>
              <div>SDS Coordinator</div>
            </div>
            <div className="flex flex-col items-center">
              <div>{signatories['OSAS Head']}</div>
              <div>OSAS HEAD</div>
            </div>
          </div>
          <div>Approved By:</div>
          <div className="flex flex-col items-center">
            <div>{signatories['Campus Administrator']}</div>
            <div>Campus Administrator</div>
          </div>
        </div>
      </div>
    </>
  );
}
