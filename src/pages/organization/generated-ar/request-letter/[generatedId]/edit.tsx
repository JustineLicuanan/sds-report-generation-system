import { type OutputData } from '@editorjs/editorjs';
import { type GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { logo, meta, paths } from '~/meta';
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

const EditorBlock = dynamic(() => import('~/components/editor'), { ssr: false });

export default function RequestLetterPage() {
  const [content, setContent] = useState<OutputData>({
    time: 1705030194807,
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
          text: '<b>[NAME]</b>',
          alignment: 'left',
        },
      },
      {
        id: 'OTDJR5Bv9H',
        type: 'paragraph',
        data: {
          text: '[Position]',
          alignment: 'left',
        },
      },
      {
        id: 'lD_NNJ4aUu',
        type: 'paragraph',
        data: {
          text: '[Location]',
          alignment: 'left',
        },
      },
      {
        id: 'sbUL7Qd0nF',
        type: 'paragraph',
        data: {
          text: '',
          alignment: 'left',
        },
      },
      {
        id: 'dSBvLr0V69',
        type: 'paragraph',
        data: {
          text: 'Dear [Name],<br>',
          alignment: 'left',
        },
      },
      {
        id: '2CmCsAP1SV',
        type: 'paragraph',
        data: {
          text: 'Greetings of Peace!',
          alignment: 'left',
        },
      },
      {
        id: 'VljqMMPM3v',
        type: 'paragraph',
        data: {
          text: '',
          alignment: 'left',
        },
      },
      {
        id: 'qwwZRx08GD',
        type: 'paragraph',
        data: {
          text: '[Your Message]',
          alignment: 'left',
        },
      },
    ],
    version: '2.28.2',
  });
  const getReportSignatoryQuery = api.shared.reportSignatory.get.useQuery();
  const repSignatory = getReportSignatoryQuery?.data ?? [];
  const signatories = parseSignatoryObject(repSignatory);

  const router = useRouter();
  return (
    <>
      <Head>
        <title>{`Request Letter ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>
      <div className="mx-auto my-0 flex max-w-[210mm] flex-col gap-8 ">
        <div className="flex items-center justify-center gap-2">
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
          <EditorBlock
            data={updateARGeneratedForm.watch('content')}
            onChange={(value) => updateARGeneratedForm.setValue('content', value)}
            setEditorInstance={setEditorInstance}
            holder="request-letter"
          />
        </div>
        <div className="items-left mt-4 flex flex-col gap-8">
          <div>Respectfully yours,</div>
          <div className="items-left flex flex-col">
            <div className="font-bold">[NAME]</div>
            <div>[Org Name] President</div>
          </div>
          <div>Checked By:</div>
          <div className="items-left flex flex-col">
            <div className="font-bold">[NAME]</div>
            <div>CSG President</div>
          </div>
          <div>Noted By:</div>
          <div className="items-left flex gap-28">
            <div className="items-left flex flex-col">
              <div className="font-bold">[NAME]</div>
              <div>[Org Name] Adviser</div>
            </div>
            <div className="items-left flex flex-col">
              <div className="font-bold">[NAME]</div>
              <div>[Org Name] Adviser</div>
            </div>
          </div>
          <div>Recommending Approval:</div>
          <div className="items-left mt-4 flex flex-col">
            <div className="font-bold">[NAME]</div>
            <div className="font-bold">
              [Position] (e.g.: Chairperson, Department of Physical Education)
            </div>
          </div>
          <div>Approved by:</div>
          <div className="items-left mt-4 flex flex-col">
            <div>{signatories['Campus Administrator']}</div>
            <div>Campus Administrator</div>
          </div>
        </div>
        <div id="hide-element" className="mb-4 flex justify-end gap-4">
          <button
            type="button"
            onClick={() =>
              router.push(
                `${paths.ORGANIZATION}${paths.GENERATED_AR}
              `
              )
            }
            className="mt-4 rounded-sm border border-gray bg-gray px-3 active:scale-95"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() =>
              router.push(
                `${paths.ORGANIZATION}${paths.GENERATED_AR}
              `
              )
            }
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
