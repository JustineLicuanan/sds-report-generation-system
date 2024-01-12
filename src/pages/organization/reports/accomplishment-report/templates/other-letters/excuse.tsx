import { OutputData } from '@editorjs/editorjs';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { logo, meta, paths } from '~/meta';
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

const EditorBlock = dynamic(() => import('~/components/editor'), { ssr: false });

export default function RequestLetterPage() {
  const [content, setContent] = useState<OutputData>({
    time: 1705037343671,
    blocks: [
      {
        id: 'tb3D1JU1ue',
        type: 'paragraph',
        data: {
          text: '[Date]',
          alignment: 'left',
        },
      },
      {
        id: 'tlhRFE3WKG',
        type: 'paragraph',
        data: {
          text: '',
          alignment: 'left',
        },
      },
      {
        id: 'KgAiXu9DeT',
        type: 'paragraph',
        data: {
          text: "Dear Sir/Ma'am,<br>",
          alignment: 'left',
        },
      },
      {
        id: 'azbztKh_Fy',
        type: 'paragraph',
        data: {
          text: '',
          alignment: 'left',
        },
      },
      {
        id: 'o6_ZvZm3Y6',
        type: 'paragraph',
        data: {
          text: 'Greetings!',
          alignment: 'left',
        },
      },
      {
        id: 'Z52LcAnM1v',
        type: 'paragraph',
        data: {
          text: '',
          alignment: 'left',
        },
      },
      {
        id: 'd4kuyzfCZH',
        type: 'paragraph',
        data: {
          text: '[Message]',
          alignment: 'left',
        },
      },
      {
        id: 'o_D8V-4t69',
        type: 'table',
        data: {
          withHeadings: false,
          content: [
            ['<b>NAME</b>', '<b>PROGRAM - SECTION</b>'],
            ['[Name]', '[PROGRAM] - [SECTION]'],
          ],
        },
      },
      {
        id: 'gZnPmMFx5O',
        type: 'paragraph',
        data: {
          text: '',
          alignment: 'left',
        },
      },
    ],
    version: '2.28.2',
  });
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{`Request Letter ${meta.SEPARATOR} ${meta.NAME}`}</title>
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
        <div className="rounded border p-2 print:border-none">
          {/* `holder` prop must be a unique ID for each EditorBlock instance */}
          <EditorBlock data={content} onChange={setContent} holder="activity-proposal-message" />
        </div>
        <div className="items-left mt-4 flex flex-col gap-8">
          <div>Thank you for your unending support.</div>
          <div>Respectfully yours,</div>
          <div className="items-left flex gap-28">
            <div className="flex flex-col gap-8">
              <div>Prepared by:</div>
              <div className="items-left flex flex-col">
                <div>[NAME]</div>
                <div>[Org Name] Adviser</div>
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <div>Recommending Approval:</div>
              <div className="items-left flex flex-col">
                <div>[NAME]</div>
                <div>[Org Name] Adviser</div>
              </div>
            </div>
          </div>
          <div>Recommending Approval:</div>
          <div className="items-left mt-4 flex flex-col">
            <div>[NAME]</div>
            <div>Campus Administrator</div>
          </div>
        </div>
        <div id="hide-element" className="mb-4 flex justify-end gap-4">
          <button
            type="button"
            onClick={() =>
              router.push(
                `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.ACCOMPLISHMENT_REPORT}${paths.TEMPLATE}`
              )
            }
            className="mt-4 rounded-sm border border-gray bg-gray px-3 active:scale-95"
          >
            Back
          </button>
          <button
            type="button"
            className="mt-4 rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
}
