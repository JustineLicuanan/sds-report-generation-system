import { type OutputData } from '@editorjs/editorjs';
import { type GetServerSideProps } from 'next';
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

export default function GeneratedActivityProposalPage() {
  const [content, setContent] = useState<OutputData>({
    time: 1705031866294,
    blocks: [
      {
        id: 'piLMgW1m6d',
        type: 'table',
        data: {
          withHeadings: false,
          content: [
            ['<b>ACTIVITY TITLE</b>', ''],
            ['<b>DATE AND VENUE</b>', ''],
            ['<b>ACTIVITY HEAD</b>', ''],
            ['<b>RATIONALE/ OBJECTIVES</b>', ''],
            ["<b>TARGET PARTICIPANTS'</b>", ''],
            ['<b>MECHANICS</b>', ''],
            ['<b>BUDGETARY REQUIREMENT</b>', ''],
            ['<b>SOURCE OF FUND</b>', ''],
            ['<b>EXPECTED OUTPUT</b>', ''],
          ],
        },
      },
      {
        id: 'jx-588SaJv',
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
        <title>{`Activity Proposal ${meta.SEPARATOR} ${meta.NAME}`}</title>
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
        <div className="text-center font-bold">ACTIVITY PROPOSAL</div>
        <div className="rounded border p-2 print:border-none">
          {/* `holder` prop must be a unique ID for each EditorBlock instance */}
          <EditorBlock data={content} onChange={setContent} holder="activity-proposal" />
        </div>
        <div className="mt-4 flex flex-col items-center gap-8">
          <div>Prepared By:</div>
          <div className="flex flex-col items-center">
            <div>[NAME]</div>
            <div>[Org Name] Assistant Secretary</div>
          </div>
          <div>Checked By:</div>
          <div className="flex flex-col items-center">
            <div>[NAME]</div>
            <div>[Org Name] President</div>
          </div>
          <div>Noted By:</div>
          <div className="flex items-center gap-28">
            <div className="flex flex-col items-center">
              <div>[NAME]</div>
              <div>[Org Name] Adviser</div>
            </div>
            <div className="flex flex-col items-center">
              <div>[NAME]</div>
              <div>[Org Name] Adviser</div>
            </div>
          </div>
          <div>Recommending Approval:</div>
          <div className="flex items-center gap-28">
            <div className="mt-4 flex flex-col items-center">
              <div>[NAME]</div>
              <div>SDS Coordinator</div>
            </div>
            <div className="mt-4 flex flex-col items-center">
              <div>[NAME]</div>
              <div>OSAS Head</div>
            </div>
          </div>
          <div>Recommending Approval:</div>
          <div className="mt-4 flex flex-col items-center">
            <div>[NAME]</div>
            <div>Campus Administrator</div>
          </div>
        </div>
        <div id="hide-element" className="mb-4 flex justify-end gap-4">
          <button
            type="button"
            onClick={() =>
              router.push(
                `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.ACCOMPLISHMENT_REPORT}${paths.GENERATED_FILES}`
              )
            }
            className="mt-4 rounded-sm border border-gray bg-gray px-3 active:scale-95"
          >
            Back
          </button>
          <button
            type="button"
            className="mt-4 rounded-sm border border-red bg-red px-3 text-white active:scale-95"
          >
            Delete
          </button>
          <button
            type="button"
            className="mt-4 rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="mt-4 rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
          >
            Preview
          </button>
        </div>
      </div>
    </>
  );
}
