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

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.organization(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function MinutesOfTheMeeting() {
  const router = useRouter();
  const generatedId = router.query.generatedId;

  const getOrgSignatoryInfo = api.shared.orgSignatoryInfo.get.useQuery({
    include: { organization: true },
  });
  const orgSignatoryInfo = getOrgSignatoryInfo.data;

  const getARGenerated = api.shared.generatedAR.get.useQuery({
    where: { id: generatedId as string },
  });
  const generatedAR = getARGenerated.data?.[0];
  const content = generatedAR?.content && JSON.parse(generatedAR.content);

  return (
    <>
      <Head>
        <title>{`Minutes of the Meeting ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>
      <div className="mx-auto my-0 flex max-w-[210mm] flex-col gap-8 ">
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
        <div className="text-center font-bold">MINUTES OF THE MEETING</div>
        <div className="flex flex-col gap-4">
          <div>
            <span className="font-bold">DATE AND LOCATION: </span>
            {content?.date} - {content?.location}
          </div>
          <div>
            <span className="font-bold">TIME STARTED: </span>
            {content?.time}
          </div>
          <div>
            <span className="font-bold">PRESIDER: </span>
            {content?.presiderName} - {content?.presiderPosition}
          </div>
          <div>
            <div className="font-bold">ATTENDEES</div>
            <table className="mx-auto my-0 w-1/2 ">
              <thead>
                <tr>
                  <th className="py-4 font-bold">(Name)</th>
                  <th className="py-4 font-bold">(Position)</th>
                </tr>
              </thead>
              <tbody>
                {content?.attendees.map((attendees: any, idx: any) => (
                  <tr key={idx}>
                    <td>• {attendees.name}</td>
                    <td>{attendees.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <div className="font-bold">AGENDA</div>
          {content?.agenda.map((agenda: any, idx: any) => (
            <div key={idx} className="ms-4">
              <div>{agenda.agendaContent ? `• ${agenda.agendaContent}` : 'No agendas'}</div>
            </div>
          ))}
        </div>
        <hr />
        <div className="flex flex-col gap-4">
          <div className="font-bold">COMMENCEMENT:</div>
          {content?.commencement.map((commencement: any, idx: any) => (
            <div key={idx} className="ms-4 flex flex-col gap-4">
              <div>
                {commencement.commencementContent
                  ? `• ${commencement.commencementContent}`
                  : 'No Commencements'}
              </div>
            </div>
          ))}
        </div>
        <div>
          <span className="font-bold">TIME ADJOURNED: </span> {content?.timeAdjourned}{' '}
        </div>
        <div>Prepared by:</div>
        <div className="flex flex-col">
          <div className="font-bold">
            {orgSignatoryInfo?.generalSecretary === ''
              ? '[NAME]'
              : orgSignatoryInfo?.generalSecretary}
          </div>
          <div className="">{orgSignatoryInfo?.organization.acronym} Secretary</div>
        </div>
        <div>Noted by:</div>
        <div className="flex flex-col">
          <div className="font-bold">
            {orgSignatoryInfo?.president === '' ? '[NAME]' : orgSignatoryInfo?.president}
          </div>
          <div className="">{orgSignatoryInfo?.organization.acronym} President</div>
        </div>
        <div className="flex gap-20">
          <div className="flex flex-col">
            <div className="font-bold">
              {orgSignatoryInfo?.adviser1 === '' ? '[NAME]' : orgSignatoryInfo?.adviser1}
            </div>
            <div className="">{orgSignatoryInfo?.organization.acronym} Adviser</div>
          </div>
          <div className="flex flex-col">
            <div className="font-bold">
              {orgSignatoryInfo?.adviser2 === '' ? '[NAME]' : orgSignatoryInfo?.adviser2}
            </div>
            <div className="">{orgSignatoryInfo?.organization.acronym} Adviser</div>
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
