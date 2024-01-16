import { Printer } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import { CldImage } from 'next-cloudinary';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { logo, meta } from '~/meta';
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

export default function Resolution() {
  const getReportSignatoryQuery = api.shared.reportSignatory.get.useQuery();
  const repSignatory = getReportSignatoryQuery?.data ?? [];
  const signatories = parseSignatoryObject(repSignatory);

  const getOrgSignatoryInfo = api.shared.orgSignatoryInfo.get.useQuery({
    include: { organization: true },
  });
  const orgSignatoryInfo = getOrgSignatoryInfo.data;

  const router = useRouter();
  const generatedId = router.query.generatedId;

  const getARGenerated = api.shared.generatedAR.get.useQuery({
    where: { id: generatedId as string },
  });
  const generatedAR = getARGenerated.data?.[0];
  const content = generatedAR?.content && JSON.parse(generatedAR.content);
  return (
    <>
      <Head>
        <title>{`Resolution ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>
      <div className="mx-auto my-0 flex max-w-[210mm] flex-col items-center justify-center gap-8 ">
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
            <div className="font-bold">{orgSignatoryInfo?.organization.name}</div>
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
        <div className="flex flex-col items-center">
          <div className=" font-bold">
            Resolution No. {content?.resolutionNumber}, A.Y. 2023 - 2024
          </div>
          <div className=" text-center font-bold">
            {content?.appointees === 'advisers'
              ? 'RESOLUTION FOR SELECTING OF NEW CAVITE ACTIVE SPORTS SOCIETY FOR ATHLETES ADVISERS FOR ACADEMIC YEAR'
              : 'RESOLUTION FOR APPOINTING OF APPOINTED COMMITTEE MEMBERS OF CAVITE ACTIVE SPORTS SOCIETY FOR ATHLETES'}{' '}
            2023 - 2024
          </div>
        </div>
        {content?.resolution.map((content: any, idx: any) => (
          <div key={idx} className="flex w-full flex-col gap-4 text-justify">
            <div className="">
              <span className="font-bold">{content.whereas},</span> {content.description}
            </div>
          </div>
        ))}

        <div className="">
          Signed in Cavite State University – Imus Campus on the{' '}
          {new Date(content?.signedDate).getDate()}th day of the{' '}
          {getMonthName(new Date(content?.signedDate).getMonth() + 1)}{' '}
          {new Date(content?.signedDate).getFullYear()}.
        </div>
        <div className="flex flex-col items-center">
          <div className="font-bold">
            {orgSignatoryInfo?.organization.name === ''
              ? '[ORG NAME]'
              : orgSignatoryInfo?.organization.name}
          </div>
          <div className="">Executive Board of Officers</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="font-bold">
            {orgSignatoryInfo?.president === '' ? '[NAME]' : orgSignatoryInfo?.president}
          </div>
          <div className="">President</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="font-bold">
            {orgSignatoryInfo?.vicePresident === '' ? '[NAME]' : orgSignatoryInfo?.vicePresident}
          </div>
          <div className="">Vice President</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="font-bold">
            {orgSignatoryInfo?.generalSecretary === ''
              ? '[NAME]'
              : orgSignatoryInfo?.generalSecretary}
          </div>
          <div className="">General Secretary</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="font-bold">
            {orgSignatoryInfo?.finance === '' ? '[NAME]' : orgSignatoryInfo?.finance}
          </div>
          <div className="">Finance</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="font-bold">
            {orgSignatoryInfo?.trainingDirector === ''
              ? '[NAME]'
              : orgSignatoryInfo?.trainingDirector}
          </div>
          <div className="">Training Director</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="font-bold">
            {orgSignatoryInfo?.recruitmentCoordinator === ''
              ? '[NAME]'
              : orgSignatoryInfo?.recruitmentCoordinator}
          </div>
          <div className="">Recruitment Coordinator</div>
        </div>
        <div>Noted by:</div>
        <div className="flex justify-between gap-20">
          <div className="flex flex-col items-center">
            <div className="font-bold">
              {orgSignatoryInfo?.adviser1 === '' ? '[NAME]' : orgSignatoryInfo?.adviser1}
            </div>
            <div className="">ORG Adviser</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-bold">
              {orgSignatoryInfo?.adviser2 === '' ? '[NAME]' : orgSignatoryInfo?.adviser2}
            </div>
            <div className="">ORG Adviser</div>
          </div>
        </div>
        <div>Recommending Approval:</div>
        <div className="flex flex-col items-center">
          <div className="font-bold">{signatories['SDS Coordinator']}</div>
          <div className="">SDS Coordinator</div>
        </div>
        <div>Approved by:</div>
        <div className="flex flex-col items-center">
          <div className="font-bold">{signatories['OSAS Head']}</div>
          <div className="">OSAS Head</div>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="fixed bottom-8 right-8 rounded-full bg-yellow p-4 text-6xl active:scale-95 print:hidden"
        >
          <Printer />
        </button>
      </div>
    </>
  );
}
