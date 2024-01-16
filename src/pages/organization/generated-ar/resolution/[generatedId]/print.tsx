import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { logo, meta } from '~/meta';
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

export default function Resolution() {
  const getReportSignatoryQuery = api.shared.reportSignatory.get.useQuery();
  const repSignatory = getReportSignatoryQuery?.data ?? [];
  const signatories = parseSignatoryObject(repSignatory);
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
        <div className="flex flex-col items-center">
          <div className=" font-bold">Resolution No. XXX, A.Y. 2023 - 2024</div>
          <div className=" text-center font-bold">
            RESOLUTION FOR SELECTING OF NEW CAVITE ACTIVE SPORTS SOCIETY FOR ATHLETES ADVISERS FOR
            ACADEMIC YEAR 2023 – 2024
          </div>
        </div>
        <div className="flex flex-col gap-4 text-justify">
          <div className="">
            <span className="font-bold">WHEREAS,</span> Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Ex dignissimos hic dolor exercitationem ad vero unde harum iusto qui
            necessitatibus laborum possimus aperiam, obcaecati a at voluptatum perferendis aliquam
            delectus blanditiis quisquam quibusdam optio quidem sequi saepe. Repellendus, similique
            est?
          </div>
          <div className="">
            <span className="font-bold">WHEREAS,</span> Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Ex dignissimos hic dolor exercitationem ad vero unde harum iusto qui
            necessitatibus laborum possimus aperiam, obcaecati a at voluptatum perferendis aliquam
            delectus blanditiis quisquam quibusdam optio quidem sequi saepe. Repellendus, similique
            est?
          </div>
          <div className="">
            <span className="font-bold">WHEREAS,</span> Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Ex dignissimos hic dolor exercitationem ad vero unde harum iusto qui
            necessitatibus laborum possimus aperiam, obcaecati a at voluptatum perferendis aliquam
            delectus blanditiis quisquam quibusdam optio quidem sequi saepe. Repellendus, similique
            est?
          </div>
          <div className="">
            <span className="font-bold">WHEREAS,</span> Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Ex dignissimos hic dolor exercitationem ad vero unde harum iusto qui
            necessitatibus laborum possimus aperiam, obcaecati a at voluptatum perferendis aliquam
            delectus blanditiis quisquam quibusdam optio quidem sequi saepe. Repellendus, similique
            est?
          </div>
        </div>
        <div className="">
          Signed in Cavite State University – Imus Campus on the [N]th day of the [Month] [Year].
        </div>
        <div className="flex flex-col items-center">
          <div className="font-bold">[ORG NAME]</div>
          <div className="">Executive Board of Officers</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="font-bold">[NAME]</div>
          <div className="">President</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="font-bold">[NAME]</div>
          <div className="">Vice President</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="font-bold">[NAME]</div>
          <div className="">General Secretary</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="font-bold">[NAME]</div>
          <div className="">Finance</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="font-bold">[NAME]</div>
          <div className="">Training Director</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="font-bold">[NAME]</div>
          <div className="">Recruitment Coordinator</div>
        </div>
        <div>Noted by:</div>
        <div className="flex justify-between gap-20">
          <div className="flex flex-col items-center">
            <div className="font-bold">[NAME]</div>
            <div className="">ORG Adviser</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-bold">[NAME]</div>
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
      </div>
    </>
  );
}
