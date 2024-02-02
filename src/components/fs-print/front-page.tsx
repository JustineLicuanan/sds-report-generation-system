import { ReportSemester } from '@prisma/client';
import { inferRouterOutputs } from '@trpc/server';
import { CldImage } from 'next-cloudinary';
import { AppRouter } from '~/server/api/root';

export default function FrontPageFS({
  reportSem,
  orgSignatoryInfo,
}: {
  reportSem: ReportSemester;
  orgSignatoryInfo: inferRouterOutputs<AppRouter>['shared']['orgSignatoryInfo']['get'];
}) {
  return (
    <>
      <div className="mx-auto my-0 mb-16 flex min-h-[100vh] w-[700px] flex-col items-center justify-center gap-4 p-4 leading-5">
        {orgSignatoryInfo?.organization.image ? (
          <div className="">
            <CldImage
              width="96"
              height="96"
              src={orgSignatoryInfo?.organization.imageId ?? ''}
              alt={`${orgSignatoryInfo?.organization.acronym} Logo`}
              className="h-80 w-80 rounded-full"
            />
          </div>
        ) : (
          <div className="h-80 w-80 rounded-full border bg-green"></div>
        )}
        <div className="text-4xl">Financial Statement</div>
        <div className="text-4xl capitalize">{reportSem?.term.toLowerCase()} Semester</div>
        <div className="text-4xl">
          A.Y {reportSem?.yearStart} - {reportSem?.yearEnd}
        </div>
      </div>
    </>
  );
}
