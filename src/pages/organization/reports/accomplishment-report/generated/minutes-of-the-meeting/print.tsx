import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { logo, meta } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
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
            [date] - [location]
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
                <tr className="">
                  <th className="py-4 font-bold">(Name)</th>
                  <th className="py-4 font-bold">(Position)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>• [Name]</td>
                  <td>[Position]</td>
                </tr>
                <tr>
                  <td>• [Name]</td>
                  <td>[Position]</td>
                </tr>
                <tr>
                  <td>• [Name]</td>
                  <td>[Position]</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <div className="font-bold">AGENDA</div>
          <div className="ms-4">
            <div>
              • Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fuga dignissimos nulla
              voluptatem corporis, a libero.
            </div>
            <div>• Lorem ipsum dolor sit amet.</div>
            <div>
              • Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur, culpa!
            </div>
          </div>
        </div>
        <hr />
        <div className="flex flex-col gap-4">
          <div className="font-bold">COMMENCEMENT:</div>
          <div className="ms-4 flex flex-col gap-4">
            <div>
              • Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maiores impedit dolores
              dicta excepturi architecto unde accusantium, eaque laudantium porro laborum, ad
              ducimus aperiam sequi dolore?
            </div>
            <div>
              • Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maiores impedit dolores
              dicta excepturi architecto unde accusantium, eaque laudantium porro laborum, ad
              ducimus aperiam sequi dolore?
            </div>
          </div>
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
