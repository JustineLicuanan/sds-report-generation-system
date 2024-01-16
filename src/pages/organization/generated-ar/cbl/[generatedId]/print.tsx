import { Printer } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import { CldImage } from 'next-cloudinary';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { meta } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';
import { parseSignatoryObject } from '~/utils/parse-signatory-object';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.organization(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function CBL() {
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
        <title>{`Constitutional and By-Laws ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>
      <div className="mx-auto my-0 flex max-w-[210mm] flex-col items-center justify-center ">
        <div className="mb-16 flex h-[100vh] flex-col items-center justify-center gap-8 text-center">
          {orgSignatoryInfo?.organization.image ? (
            <div className="h-24 w-24">
              <CldImage
                width="96"
                height="96"
                src={orgSignatoryInfo?.organization.imageId ?? ''}
                alt={`${orgSignatoryInfo?.organization.acronym} Logo`}
                className="h-80 w-80 rounded-full"
              />
            </div>
          ) : (
            <div className="h-80 w-80 rounded-full border-2 bg-green"></div>
          )}
          <div className="text-6xl">{orgSignatoryInfo?.organization.name}</div>
          <div className="text-6xl">CONSTITUTION AND BY-LAWS</div>
        </div>

        <div className="mb-16 flex h-[100vh] flex-col items-center  gap-8 text-justify">
          <div className="flex flex-col items-center gap-4">
            <div className="text-lg font-bold">Preamble</div>
            <div className="text-lg">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores est tempora
              deserunt nemo, quod quis quia nesciunt pariatur, fugit similique suscipit iste eius
              rem dignissimos? Voluptate adipisci iusto unde qui?
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="text-lg font-bold">Mission</div>
            <div className="text-lg">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores est tempora
              deserunt nemo, quod quis quia nesciunt pariatur, fugit similique suscipit iste eius
              rem dignissimos? Voluptate adipisci iusto unde qui?
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="text-lg font-bold">Vision</div>
            <div className="text-lg">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores est tempora
              deserunt nemo, quod quis quia nesciunt pariatur, fugit similique suscipit iste eius
              rem dignissimos? Voluptate adipisci iusto unde qui?
            </div>
          </div>
        </div>
        <div className="mb-16 flex h-[100vh] flex-col items-center  gap-8 text-justify">
          {content?.articles.map((article: any, idx: any) => (
            <div key={idx}>
              <div className="text-center font-bold">Article {article.articleNumber}</div>
              <div className="text-center">{article.description}</div>
            </div>
          ))}
        </div>
        <div className="">Signed at Cavite State University-Imus Campus on the day of [Date]</div>
        <div className="mt-4 flex flex-col items-center gap-8">
          <div className="flex flex-col items-center">
            <div className="font-bold">
              {orgSignatoryInfo?.president === '' ? '[NAME]' : orgSignatoryInfo?.president}
            </div>
            <div>President</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-bold">
              {orgSignatoryInfo?.vicePresident === '' ? '[NAME]' : orgSignatoryInfo?.vicePresident}
            </div>
            <div>Vice President</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-bold">
              {orgSignatoryInfo?.generalSecretary === ''
                ? '[NAME]'
                : orgSignatoryInfo?.generalSecretary}
            </div>
            <div>General Secretary</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-bold">
              {orgSignatoryInfo?.treasurer === '' ? '[NAME]' : orgSignatoryInfo?.treasurer}
            </div>
            <div>Treasurer</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-bold">
              {orgSignatoryInfo?.auditor === '' ? '[NAME]' : orgSignatoryInfo?.auditor}
            </div>
            <div>Auditor</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-bold">
              {orgSignatoryInfo?.recruitmentCoordinator === ''
                ? '[NAME]'
                : orgSignatoryInfo?.recruitmentCoordinator}
            </div>
            <div>Recruitment Coordinator</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-bold">
              {orgSignatoryInfo?.trainingDirector === ''
                ? '[NAME]'
                : orgSignatoryInfo?.trainingDirector}
            </div>
            <div>Training Director</div>
          </div>
          <div>Noted By:</div>
          <div className="flex items-center gap-28">
            <div className="flex flex-col items-center">
              <div className="font-bold">
                {orgSignatoryInfo?.adviser1 === '' ? '[NAME]' : orgSignatoryInfo?.adviser1}
              </div>
              <div>
                {orgSignatoryInfo?.organization.acronym}
                Adviser
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-bold">
                {orgSignatoryInfo?.adviser2 === '' ? '[ORG NAME]' : orgSignatoryInfo?.adviser2}
              </div>
              <div>
                {orgSignatoryInfo?.organization.acronym}
                Adviser
              </div>
            </div>
          </div>
          <div>Recommending Approval:</div>
          <div className="flex items-center gap-28">
            <div className="mt-4 flex flex-col items-center">
              <div className="font-bold">{signatories['CSG President']}</div>
              <div>CSG President</div>
            </div>
            <div className="mt-4 flex flex-col items-center">
              <div className="font-bold">{signatories['SDS Coordinator']}</div>
              <div>SDS Coordinator</div>
            </div>
          </div>
          <div>Recommending Approval:</div>
          <div className="mt-4 flex flex-col items-center">
            <div className="font-bold">{signatories['OSAS Head']}</div>
            <div>OSAS Head</div>
          </div>
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
