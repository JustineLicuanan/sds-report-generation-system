import { type OutputData } from '@editorjs/editorjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { GeneratedARTemplate } from '@prisma/client';
import { type GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { type z } from 'zod';
import { useToast } from '~/components/ui/use-toast';
import { logo, meta, paths } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';
import { enumToSlug } from '~/utils/enum-to-slug';
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

type CreateARGeneratedInputs = z.infer<typeof schemas.shared.generatedAR.create>;

export default function RequestLetterPage() {
  const router = useRouter();
  const utils = api.useContext();
  const { toast } = useToast();

  const [content] = useState<OutputData>({
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

  const getOrgSignatoryInfo = api.shared.orgSignatoryInfo.get.useQuery({
    include: { organization: true },
  });
  const orgSignatoryInfo = getOrgSignatoryInfo.data;

  const createARGeneratedForm = useForm<CreateARGeneratedInputs>({
    resolver: zodResolver(schemas.shared.generatedAR.create),
    // I use 'values' here because in the future(?), the Editor.js template (content) might come from database
    values: {
      template: GeneratedARTemplate.REQUEST_LETTER,
      // This 'content' is JSON, you can structure it however you like
      content: { letter: content, approvalOf: '', positionApprovalOf: '' },
    },
  });

  const createARGenerated = api.shared.generatedAR.create.useMutation({
    onSuccess: async ({ id, template }) => {
      toast({ variant: 'c-primary', description: '✔️ An AR page has been generated.' });
      await utils.shared.generatedAR.invalidate();
      await router.push(
        `${paths.ORGANIZATION}${paths.GENERATED_AR}/${enumToSlug(template)}/${id}${paths.EDIT}`
      );
    },
    onError: () => {
      toast({ variant: 'destructive', description: '❌ Internal Server Error' });
    },
  });

  const onSubmitCreateARGenerated: SubmitHandler<CreateARGeneratedInputs> = (values) => {
    if (createARGenerated.isLoading) {
      return;
    }
    createARGenerated.mutate(values);
  };
  return (
    <>
      <Head>
        <title>{`Request Letter ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>
      <form
        className="mx-auto my-0 flex max-w-[210mm] flex-col gap-8 "
        onSubmit={createARGeneratedForm.handleSubmit(onSubmitCreateARGenerated, (err) => {
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
          <div className="h-24 w-24 rounded-full border"></div>
        </div>
        <div className="rounded border p-2 print:border-none">
          {/* `holder` prop must be a unique ID for each EditorBlock instance */}
          <EditorBlock
            data={createARGeneratedForm.watch('content.letter')}
            onChange={(value) => createARGeneratedForm.setValue('content.letter', value)}
            holder="other-letters-request"
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
          <div className="items-left mt-4 flex flex-col gap-2 print:gap-0">
            <input
              type="text"
              id=""
              placeholder="Name"
              className="w-1/4 rounded-sm border border-input p-1 print:hidden"
              {...createARGeneratedForm.register('content.approvalOf')}
            />
            <input
              type="text"
              id=""
              placeholder="Position e.g.: Chairperson, Department of Physical Education "
              className="w-1/2 rounded-sm border border-input p-1 print:hidden"
              {...createARGeneratedForm.register('content.positionApprovalOf')}
            />
            <div className="hidden font-bold print:block">
              {...createARGeneratedForm.watch('content.approvalOf')}
            </div>
            <div className="hidden print:block">
              {...createARGeneratedForm.watch('content.positionApprovalOf')}
            </div>
          </div>
          <div>Approved by:</div>
          <div className="items-left mt-4 flex flex-col">
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
            type="submit"
            className="mt-4 rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
}
