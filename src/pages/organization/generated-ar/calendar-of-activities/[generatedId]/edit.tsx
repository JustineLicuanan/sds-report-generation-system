import { type OutputData } from '@editorjs/editorjs';
import { type GetServerSideProps } from 'next';
import { CldImage } from 'next-cloudinary';
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

export default function GeneratedCalendarOfActivitiesPage() {
  const [content1stSem, setContent1stSem] = useState<OutputData>({
    time: 1705032952429,
    blocks: [
      {
        id: '-LLtXYvsJH',
        type: 'header',
        data: {
          text: 'FIRST SEMESTER',
          level: 2,
          alignment: 'center',
        },
      },
      {
        id: 'YOrNnTH38z',
        type: 'paragraph',
        data: {
          text: '[Semester Period]<br>',
          alignment: 'center',
        },
      },
      {
        id: 'n6cA_Uyg2Y',
        type: 'table',
        data: {
          withHeadings: false,
          content: [['<b>EVENT</b>', '<b>DATE</b>', '<b>LOCATION</b>']],
        },
      },
      {
        id: 'JPEXOrjjqK',
        type: 'paragraph',
        data: {
          text: '',
          alignment: 'left',
        },
      },
    ],
    version: '2.28.2',
  });
  const [content2ndSem, setContent2ndSem] = useState<OutputData>({
    time: 1705032952429,
    blocks: [
      {
        id: '-LLtXYvsJH',
        type: 'header',
        data: {
          text: 'SECOND SEMESTER',
          level: 2,
          alignment: 'center',
        },
      },
      {
        id: 'YOrNnTH38z',
        type: 'paragraph',
        data: {
          text: '[Semester Period]<br>',
          alignment: 'center',
        },
      },
      {
        id: 'n6cA_Uyg2Y',
        type: 'table',
        data: {
          withHeadings: false,
          content: [['<b>EVENT</b>', '<b>DATE</b>', '<b>LOCATION</b>']],
        },
      },
      {
        id: 'JPEXOrjjqK',
        type: 'paragraph',
        data: {
          text: '',
          alignment: 'left',
        },
      },
    ],
    version: '2.28.2',
  });
  const getOrgSignatoryInfo = api.shared.orgSignatoryInfo.get.useQuery({
    include: { organization: true },
  });
  const orgSignatoryInfo = getOrgSignatoryInfo.data;

  const getReportSignatoryQuery = api.shared.reportSignatory.get.useQuery();
  const signatories = parseSignatoryObject(getReportSignatoryQuery?.data ?? []);

  const router = useRouter();
  return (
    <>
      <Head>
        <title>{`Activity Proposal ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>
      <div className="mx-auto my-0 flex max-w-[210mm] flex-col gap-8 ">
        <div className="relative flex flex-col items-center print:h-[100vh]">
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
              alt="SDS Logo"
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
          <div className="w-full rounded border p-2 print:border-none">
            {/* `holder` prop must be a unique ID for each EditorBlock instance */}
            <EditorBlock
              data={content1stSem}
              onChange={setContent1stSem}
              holder="calendar-of-activities-first"
              className="relative"
            />
          </div>
        </div>

        <div className="relative mb-16 print:h-[100vh] ">
          <div className="w-full rounded border p-2 print:border-none">
            {/* `holder` prop must be a unique ID for each EditorBlock instance */}
            <EditorBlock
              data={content2ndSem}
              onChange={setContent2ndSem}
              holder="calendar-of-activities-second"
              className="relative"
            />
          </div>
        </div>

        <div className="items-left mt-4 flex flex-col gap-8">
          <div>Prepared By:</div>
          <div className="items-left flex flex-col">
            <div className="font-bold">[NAME]</div>
            <div>[Org Name] Secretary</div>
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
          <div className="items-left flex gap-28">
            <div className="items-left mt-4 flex flex-col">
              <div className="font-bold">{signatories['SDS Coordinator']}</div>
              <div>SDS Coordinator</div>
            </div>
            <div className="items-left mt-4 flex flex-col">
              <div className="font-bold">{signatories['OSAS Head']}</div>
              <div>OSAS Head</div>
            </div>
          </div>
          <div>Recommending Approval:</div>
          <div className="items-left mt-4 flex flex-col">
            <div className="font-bold">{signatories['Campus Administrator']}</div>
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
                `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.ACCOMPLISHMENT_REPORT}${paths.GENERATED_FILES}`
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
