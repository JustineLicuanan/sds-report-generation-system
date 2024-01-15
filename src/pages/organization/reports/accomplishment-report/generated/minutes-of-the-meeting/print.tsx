import { type GetServerSideProps } from 'next';
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
  const { ARGeneratedId } = router.query;

  const getARGenerated = api.shared.ARGenerated.get.useQuery({
    where: { id: ARGeneratedId as string },
  });
  const ARGenerated = getARGenerated.data?.[0];
  const contentString = ARGenerated?.content;
  const contentObject = contentString ? JSON.parse(contentString) : null;
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
            <div className="font-bold">ORG NAME</div>
            <div className="">org gmail account</div>
          </div>
          <Image
            src={logo.SDS_LOGO}
            alt="Bagong Pilipinas"
            height={100}
            width={100}
            className="h-24 w-24 "
          />
          <div className="h-24 w-24 rounded-full border"></div>
        </div>
        <div className="text-center font-bold">MINUTES OF THE MEETING</div>
        <div className="flex flex-col gap-4">
          <div>
            <span className="font-bold">DATE AND LOCATION: </span>
            {contentObject?.[0]?.date} - {contentObject?.[0]?.location}
          </div>
          <div>
            <span className="font-bold">TIME STARTED: </span>
            [time]
          </div>
          <div>
            <span className="font-bold">PRESIDENT: </span>
            [name] - [position]
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
                {contentObject?.attendees.map((attendees, idx) => (
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
          {contentObject?.agenda.map((agenda, idx) => (
            <div className="ms-4">
              <div>{agenda.agendaContent ? `• ${agenda.agendaContent}` : 'No agendas'}</div>
            </div>
          ))}
        </div>
        <hr />
        <div className="flex flex-col gap-4">
          <div className="font-bold">COMMENCEMENT:</div>
          {contentObject?.commencement.map((commencement, idx) => (
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
          <span className="font-bold">TIME ADJOURNED: </span> [time]{' '}
        </div>
        <div>Prepared by:</div>
        <div className="flex flex-col">
          <div className="font-bold">[NAME]</div>
          <div className="">[ORG] Secretary</div>
        </div>
        <div>Noted by:</div>
        <div className="flex flex-col">
          <div className="font-bold">[NAME]</div>
          <div className="">[ORG] President</div>
        </div>
        <div className="flex gap-20">
          <div className="flex flex-col">
            <div className="font-bold">[NAME]</div>
            <div className="">[ORG] Adviser</div>
          </div>
          <div className="flex flex-col">
            <div className="font-bold">[NAME]</div>
            <div className="">[ORG] Adviser</div>
          </div>
        </div>
      </div>
    </>
  );
}
