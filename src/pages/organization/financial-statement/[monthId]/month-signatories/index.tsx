import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { meta } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';
import { getMonthName } from '~/utils/get-month-name';
import { parseSignatoryObject } from '~/utils/parse-signatory-object';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.organization(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function MonthSignatories() {
  const router = useRouter();
  const monthId = router.query.monthId;
  const getMonthlyFSQuery = api.shared.monthlyFS.get.useQuery({
    where: { id: monthId as string },
  });
  const monthlyFS = getMonthlyFSQuery?.data?.[0];

  const getReportSemQuery = api.shared.reportSemester.get.useQuery();
  const reportSem = getReportSemQuery?.data;

  const getOrgSignatoryInfo = api.shared.orgSignatoryInfo.get.useQuery({
    include: { organization: true },
  });
  const orgSignatoryInfo = getOrgSignatoryInfo.data;

  const getReportSignatoryQuery = api.shared.reportSignatory.get.useQuery();
  const repSignatory = getReportSignatoryQuery?.data ?? [];
  const signatories = parseSignatoryObject(repSignatory);
  return (
    <>
      <Head>
        <title>{`Month Signatories ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>
      <div className="mx-auto my-0 flex flex-col items-center p-4">
        <div className="font-bold">
          Financial Statement ({getMonthName(monthlyFS?.month as number)} {reportSem?.yearStart} -{' '}
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
        </div>
      </div>
    </>
  );
}
