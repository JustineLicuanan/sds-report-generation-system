import { api } from '~/utils/api';
import { parseSignatoryObject } from '~/utils/parse-signatory-object';

export default function SignatoriesAR() {
  // Signatories
  const getReportSem = api.shared.reportSemester.get.useQuery();
  const reportSem = getReportSem.data;

  const getOrgSignatoryInfo = api.shared.orgSignatoryInfo.get.useQuery({
    include: { organization: true },
  });
  const orgSignatoryInfo = getOrgSignatoryInfo.data;

  const getReportSignatoryQuery = api.shared.reportSignatory.get.useQuery();
  const repSignatory = getReportSignatoryQuery?.data ?? [];
  const signatories = parseSignatoryObject(repSignatory);

  return (
    <>
      <div className="mx-auto my-0 mb-16 flex min-h-[100vh] flex-col items-center p-4">
        <div className="mt-4 flex flex-col items-center gap-4">
          <div>Prepared By:</div>
          <div className="flex flex-col items-center">
            <div className="font-bold">
              {orgSignatoryInfo?.generalSecretary === ''
                ? '[NAME]'
                : orgSignatoryInfo?.generalSecretary}
            </div>
            <div>{orgSignatoryInfo?.organization.acronym} Secretary</div>
          </div>

          <div>Checked By:</div>
          <div className="flex flex-col items-center">
            <div className="font-bold">
              {orgSignatoryInfo?.president === '' ? '[NAME]' : orgSignatoryInfo?.president}
            </div>
            <div>{orgSignatoryInfo?.organization.acronym} President</div>
          </div>
          <div>Noted By:</div>
          <div className="flex flex-col justify-between gap-4">
            <div className="flex justify-between gap-32">
              <div className="flex flex-col items-center">
                <div className="font-bold">
                  {orgSignatoryInfo?.adviser1 === '' ? '[NAME]' : orgSignatoryInfo?.adviser1}
                </div>
                <div>{orgSignatoryInfo?.organization.acronym} Adviser</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-bold">
                  {orgSignatoryInfo?.adviser2 === '' ? '[NAME]' : orgSignatoryInfo?.adviser2}
                </div>
                <div>{orgSignatoryInfo?.organization.acronym} Adviser</div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-bold">
                {orgSignatoryInfo?.deptChairperson === ''
                  ? '[NAME]'
                  : orgSignatoryInfo?.deptChairperson}
              </div>
              <div>Department Chairperson</div>
            </div>
          </div>
          <div>Recommending Approval:</div>
          <div className="mt-4 flex flex-col items-center">
            <div className="font-bold">{signatories['CSG Secretary']}</div>
            <div>CSG Secretary</div>
          </div>
          <div className="mt-4 flex flex-col items-center">
            <div className="font-bold">{signatories['CSG President']}</div>
            <div>CSG President</div>
          </div>
          <div className="mt-4 flex justify-between gap-32">
            <div className="flex flex-col items-center">
              <div className="font-bold">{signatories['SDS Coordinator']}</div>
              <div>SDS Coordinator</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-bold">{signatories['OSAS Head']}</div>
              <div>OSAS HEAD</div>
            </div>
          </div>
          <div>Approved By:</div>
          <div className="flex flex-col items-center">
            <div className="font-bold">{signatories['Campus Administrator']}</div>
            <div>Campus Administrator</div>
          </div>
        </div>
      </div>
    </>
  );
}
