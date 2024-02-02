import { CldImage } from 'next-cloudinary';
import { api } from '~/utils/api';

export default function FrontPageAR() {
  // Signatories
  const getReportSem = api.shared.reportSemester.get.useQuery();
  const reportSem = getReportSem.data;

  const getOrgSignatoryInfo = api.shared.orgSignatoryInfo.get.useQuery({
    include: { organization: true },
  });
  const orgSignatoryInfo = getOrgSignatoryInfo.data;
  return (
    <>
      <div className="mx-auto my-0 mb-16 flex min-h-[100vh] w-[700px] flex-col items-center justify-center gap-8 p-4 leading-5">
        {orgSignatoryInfo?.organization.image ? (
          <div className="h-80 w-80">
            <CldImage
              width="320"
              height="320"
              src={orgSignatoryInfo?.organization.imageId ?? ''}
              alt={`${orgSignatoryInfo?.organization.acronym} Logo`}
              className="rounded-full"
            />
          </div>
        ) : (
          <div className="h-80 w-80 rounded-full border bg-green"></div>
        )}
        <div className="text-center text-5xl font-bold">
          ACCOMPLISHMENT REPORT FOR {reportSem?.term.toUpperCase()} SEMESTER ACADEMIC YEAR{' '}
          {reportSem?.yearStart} - {reportSem?.yearEnd}
        </div>

        <div className="text-center text-5xl font-bold">{orgSignatoryInfo?.organization.name}</div>
      </div>
    </>
  );
}
