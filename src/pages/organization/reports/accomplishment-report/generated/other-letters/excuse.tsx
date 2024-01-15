import EditorJS, { type OutputData } from '@editorjs/editorjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { GeneratedReportStatus } from '@prisma/client';
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

type UpdateARGeneratedInputs = z.infer<typeof schemas.shared.ARGenerated.update>;

export default function ExcuseLetterPage() {
  const router = useRouter();
  const utils = api.useContext();
  const { toast } = useToast();

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

  const { ARGeneratedId } = router.query;

  const getARGenerated = api.shared.ARGenerated.get.useQuery({
    where: { id: ARGeneratedId as string },
  });
  const ARGenerated = getARGenerated.data?.[0];

  // These are for Editor.js 'content' from database. You also need to pass 'setEditorInstance' as prop to your EditorBlock component. Check at the very top for the EditorJS import
  const [hasRendered, setHasRendered] = useState(false);
  const [editorInstance, setEditorInstance] = useState<EditorJS>();
  useEffect(() => {
    if (!hasRendered && !!editorInstance?.blocks?.render && !!ARGenerated) {
      // If you have more than one editorInstance, then run the render for it too
      editorInstance.blocks
        .render(JSON.parse(ARGenerated.content).letter)
        .then(() => setHasRendered(() => true));
    }
    // If you have more than one editorInstance, add their '.blocks' here too
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorInstance?.blocks, ARGenerated]);

  const getOrgSignatoryInfo = api.shared.orgSignatoryInfo.get.useQuery({
    include: { organization: true },
  });
  const orgSignatoryInfo = getOrgSignatoryInfo.data;

  // This is for AR auto creation when there's an active semester
  api.shared.AR.getOrCreate.useQuery();

  const updateARGeneratedForm = useForm<UpdateARGeneratedInputs>({
    resolver: zodResolver(schemas.shared.ARGenerated.update),
    // I use 'values' here because in the future(?), the Editor.js template (content) might come from database
    values: {
      id: ARGeneratedId as string,
      templateType: ARGenerated?.templateType,
      contentType: ARGenerated?.contentType,
      contentNumber: ARGenerated?.contentNumber,
      // If the 'content' is from the database, it needs to be parsed first because it is stringified in the backend
      content: ARGenerated?.content
        ? JSON.parse(ARGenerated.content)
        : { letter: content, approvalOf: '', positionApprovalOf: '' },
    },
  });

  const updateARGenerated = api.shared.ARGenerated.update.useMutation({
    onSuccess: async ({ id }) => {
      toast({ variant: 'c-primary', description: '✔️ Excuse Letter has been updated.' });
      await utils.admin.ARGenerated.invalidate();
    },
    onError: () => {
      toast({ variant: 'destructive', description: '❌ Internal Server Error' });
    },
  });

  const turnInARGenerated = api.shared.ARGenerated.turnIn.useMutation({
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ Excuse Letter has been turned in.' });
      await utils.admin.ARGenerated.invalidate();
    },
    onError: () => {
      toast({ variant: 'destructive', description: '❌ Internal Server Error' });
    },
  });

  const cancelARGenerated = api.shared.ARGenerated.cancel.useMutation({
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ Excuse Letter has been cancelled.' });
      await utils.admin.ARGenerated.invalidate();
    },
    onError: () => {
      toast({ variant: 'destructive', description: '❌ Internal Server Error' });
    },
  });

  const deleteARGenerated = api.shared.ARGenerated.delete.useMutation({
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ Excuse Letter has been deleted.' });
      await utils.admin.ARGenerated.invalidate();
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
        <title>{`Excuse Letter ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>
      <form
        className="mx-auto my-0 flex max-w-[210mm] flex-col gap-8"
        onSubmit={updateARGeneratedForm.handleSubmit(onSubmitUpdateARGenerated, (err) => {
          console.error(err);
        })}
      >
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
        <div className="rounded border p-2 print:border-none">
          {/* `holder` prop must be a unique ID for each EditorBlock instance */}
          {/* This is how you register Editor.js to react-hook-form */}
          <EditorBlock
            data={updateARGeneratedForm.watch('content.letter')}
            onChange={(value) => updateARGeneratedForm.setValue('content.letter', value)}
            setEditorInstance={setEditorInstance}
            holder="activity-proposal-message"
          />
        </div>
        <div className="items-left mt-4 flex flex-col gap-8">
          <div>Thank you for your unending support.</div>
          <div>Respectfully yours,</div>
          <div className="items-left flex gap-28">
            <div className="flex flex-col gap-8">
              <div>Prepared by:</div>
              <div className="items-left flex flex-col">
                <div className="font-bold">
                  {orgSignatoryInfo?.adviser1 === '' ? '[NAME]' : orgSignatoryInfo?.adviser1}
                </div>
                <div>{orgSignatoryInfo?.organization.acronym} Adviser</div>
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <div>Recommending Approval:</div>
              <div className="items-left flex flex-col">
                <div className="font-bold">
                  {orgSignatoryInfo?.adviser2 === '' ? '[NAME]' : orgSignatoryInfo?.adviser2}
                </div>
                <div>{orgSignatoryInfo?.organization.acronym} Adviser</div>
              </div>
            </div>
          </div>
          <div>Recommending Approval:</div>
          <div className="items-left mt-4 flex flex-col">
            <div>
              <input
                type="text"
                placeholder="e.g: Juan Dela Cruz"
                id="approval-of"
                className="rounded-sm border border-input px-1 print:hidden"
                {...updateARGeneratedForm.register('content.approvalOf')}
              />
              <div className="hidden print:block">
                {updateARGeneratedForm.watch('content.approvalOf')}
              </div>
            </div>

            <div>
              <input
                type="text"
                placeholder="e.g.: Chairperson, Department of Physical Education"
                id="position-approval-of"
                className="rounded-sm border border-input px-1 print:hidden"
                {...updateARGeneratedForm.register('content.positionApprovalOf')}
              />
              <div className="hidden print:block">
                {updateARGeneratedForm.watch('content.positionApprovalOf')}
              </div>
            </div>
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
          {getARGenerated.data?.[0]?.status !== GeneratedReportStatus.READY_FOR_SIGNING && (
            <button
              type="button"
              className="mt-4 rounded-sm border border-red bg-red px-3 text-white active:scale-95"
              onClick={() => {
                deleteARGenerated.mutate({ id: ARGeneratedId as string });
                void router.push(
                  `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.ACCOMPLISHMENT_REPORT}${paths.GENERATED_FILES}`
                );
              }}
            >
              Delete
            </button>
          )}
          {getARGenerated.data?.[0]?.status === GeneratedReportStatus.TURNED_IN ? (
            <button
              type="button"
              className="mt-4 rounded-sm border border-red bg-red px-3 text-white active:scale-95"
              onClick={async () => cancelARGenerated.mutate({ id: ARGeneratedId as string })}
            >
              Cancel Submit
            </button>
          ) : getARGenerated.data?.[0]?.status === GeneratedReportStatus.DRAFT ||
            getARGenerated.data?.[0]?.status === GeneratedReportStatus.FOR_REVISION ? (
            <>
              {getARGenerated.data?.[0]?.status === GeneratedReportStatus.FOR_REVISION && (
                <p className="mt-4 px-3 text-destructive">{getARGenerated.data?.[0]?.status}</p>
              )}
              <button
                type="button"
                className="mt-4 rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                onClick={async () => {
                  await updateARGeneratedForm.handleSubmit(onSubmitUpdateARGenerated)();
                  turnInARGenerated.mutate({ id: ARGeneratedId as string });
                }}
              >
                Save & Turn in
              </button>
            </>
          ) : (
            <p className="mt-4 px-3 text-c-primary">{getARGenerated.data?.[0]?.status}</p>
          )}
          {getARGenerated.data?.[0]?.status !== GeneratedReportStatus.READY_FOR_SIGNING && (
            <button
              type="submit"
              className="mt-4 rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
            >
              Save
            </button>
          )}
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
