import EditorJS, { OutputData } from '@editorjs/editorjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { type GetServerSideProps } from 'next';
import { CldImage } from 'next-cloudinary';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '~/components/ui/use-toast';
import { logo, meta, paths } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';
import { parseSignatoryObject } from '~/utils/parse-signatory-object';
import { schemas } from '~/zod-schemas';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.organization(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

const EditorBlock = dynamic(() => import('~/components/editor'), { ssr: false });

type UpdateARGeneratedInputs = z.infer<typeof schemas.shared.generatedAR.update>;

export default function ActivityProposalPage() {
  const router = useRouter();
  const utils = api.useContext();
  const { toast } = useToast();

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

  const generatedId = router.query.generatedId;

  const getARGenerated = api.shared.generatedAR.get.useQuery({
    where: { id: generatedId as string },
  });
  const generatedAR = getARGenerated.data?.[0];

  // These are for Editor.js 'content' from database. You also need to pass 'setEditorInstance' as prop to your EditorBlock component. Check at the very top for the EditorJS import
  const [hasRendered, setHasRendered] = useState(false);
  const [editorInstance, setEditorInstance] = useState<EditorJS>();
  useEffect(() => {
    if (!hasRendered && !!editorInstance?.blocks?.render && !!generatedAR) {
      editorInstance.blocks
        .render(JSON.parse(generatedAR.content))
        .then(() => setHasRendered(() => true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorInstance?.blocks, generatedAR]);

  const getOrgSignatoryInfo = api.shared.orgSignatoryInfo.get.useQuery({
    include: { organization: true },
  });
  const orgSignatoryInfo = getOrgSignatoryInfo.data;

  const getReportSignatoryQuery = api.shared.reportSignatory.get.useQuery();
  const signatories = parseSignatoryObject(getReportSignatoryQuery?.data ?? []);

  const updateARGeneratedForm = useForm<UpdateARGeneratedInputs>({
    resolver: zodResolver(schemas.shared.generatedAR.update),
    // This is an 'edit/update' form & I need to get the initial data from the backend, so I use 'values' here
    values: {
      id: generatedId as string,
      template: generatedAR?.template,
      // If the 'content' is from the database, it needs to be parsed first because it is stringified in the backend
      content: generatedAR?.content ? JSON.parse(generatedAR.content) : content,
    },
  });

  const updateARGenerated = api.shared.generatedAR.update.useMutation({
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ Activity Proposal has been updated.' });
      await utils.shared.generatedAR.invalidate();
    },
    onError: () => {
      toast({ variant: 'destructive', description: '❌ Internal Server Error' });
    },
  });

  const deleteARGenerated = api.shared.generatedAR.delete.useMutation({
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ Activity Proposal has been deleted.' });
      await utils.shared.generatedAR.invalidate();
    },
    onError: () => {
      toast({ variant: 'destructive', description: '❌ Internal Server Error' });
    },
  });

  const onSubmitUpdateARGenerated: SubmitHandler<UpdateARGeneratedInputs> = (values) => {
    if (updateARGenerated.isLoading) {
      return;
    }
    updateARGenerated.mutate(values);
  };

  return (
    <>
      <Head>
        <title>{`Activity Proposal ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>
      <form
        className="mx-auto my-0 flex max-w-[210mm] flex-col gap-8"
        onSubmit={updateARGeneratedForm.handleSubmit(onSubmitUpdateARGenerated, (err) => {
          console.error(err);
        })}
      >
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
            alt="CvSU Logo"
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
        <div className="text-center font-bold">ACTIVITY PROPOSAL</div>
        <div className="rounded border p-2 print:border-none">
          {/* `holder` prop must be a unique ID for each EditorBlock instance */}
          {/* This is how you register Editor.js to react-hook-form */}
          <EditorBlock
            data={updateARGeneratedForm.watch('content')}
            onChange={(value) => updateARGeneratedForm.setValue('content', value)}
            setEditorInstance={setEditorInstance}
            holder="activity-proposal"
          />
        </div>
        <div className="mt-4 flex flex-col items-center gap-8">
          <div>Prepared By:</div>
          <div className="flex flex-col items-center">
            <div className="font-bold">
              {orgSignatoryInfo?.assistantSecretary === ''
                ? '[NAME]'
                : orgSignatoryInfo?.assistantSecretary}
            </div>
            <div>{orgSignatoryInfo?.organization.acronym} Assistant Secretary</div>
          </div>
          <div>Checked By:</div>
          <div className="flex flex-col items-center">
            <div className="font-bold">
              {orgSignatoryInfo?.president === '' ? '[NAME]' : orgSignatoryInfo?.president}
            </div>
            <div>{orgSignatoryInfo?.organization.acronym} President</div>
          </div>
          <div>Noted By:</div>
          <div className="flex items-center gap-28">
            <div className="flex flex-col items-center">
              <div className="font-bold">
                {orgSignatoryInfo?.adviser1 === '' ? '[NAME]' : orgSignatoryInfo?.adviser1}
              </div>
              <div>{orgSignatoryInfo?.organization.acronym} Adviser</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-bold">
                {orgSignatoryInfo?.adviser2 === '' ? '[NAME]' : orgSignatoryInfo?.adviser2}
              </div>
              <div>{orgSignatoryInfo?.organization.acronym} Adviser</div>
            </div>
          </div>
          <div>Recommending Approval:</div>
          <div className="flex items-center gap-28">
            <div className="mt-4 flex flex-col items-center">
              <div className="font-bold">{signatories['SDS Coordinator']}</div>
              <div>SDS Coordinator</div>
            </div>
            <div className="mt-4 flex flex-col items-center">
              <div className="font-bold">{signatories['OSAS Head']}</div>
              <div>OSAS Head</div>
            </div>
          </div>
          <div>Recommending Approval:</div>
          <div className="mt-4 flex flex-col items-center">
            <div className="font-bold">{signatories['Campus Administrator']}</div>
            <div>Campus Administrator</div>
          </div>
        </div>
        <div id="hide-element" className="mb-4 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push(`${paths.ORGANIZATION}${paths.GENERATED_AR}`)}
            className="mt-4 rounded-sm border border-gray bg-gray px-3 active:scale-95"
          >
            Back
          </button>
          <button
            type="button"
            className="mt-4 rounded-sm border border-red bg-red px-3 text-white active:scale-95"
            onClick={() => {
              deleteARGenerated.mutate({ id: generatedId as string });
              void router.push(
                `${paths.ORGANIZATION}${paths.GENERATED_AR}
              `
              );
            }}
          >
            Delete
          </button>
          <button
            type="submit"
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
      </form>
    </>
  );
}
