import { type OutputData } from '@editorjs/editorjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { ARGeneratedContentType, ARGeneratedTemplateType } from '@prisma/client';
import { type GetServerSideProps } from 'next';
import { CldImage } from 'next-cloudinary';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
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

type CreateARGeneratedInputs = z.infer<typeof schemas.shared.ARGenerated.create>;

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

  const getOrgSignatoryInfo = api.shared.orgSignatoryInfo.get.useQuery({
    include: { organization: true },
  });
  const orgSignatoryInfo = getOrgSignatoryInfo.data;

  // This is for AR auto creation when there's an active semester
  api.shared.AR.getOrCreate.useQuery();

  const createARGeneratedForm = useForm<CreateARGeneratedInputs>({
    resolver: zodResolver(schemas.shared.ARGenerated.create),
    // I use 'values' here because in the future(?), the Editor.js template (content) might come from database
    values: {
      templateType: ARGeneratedTemplateType.FORM,
      contentType: ARGeneratedContentType.OTHER_LETTER,
      contentNumber: 3,
      // This 'content' is JSON, you can structure it however you like
      content: { letter: content, approvalOf: '', positionApprovalOf: '' },
    },
  });

  const createARGenerated = api.shared.ARGenerated.create.useMutation({
    onSuccess: async ({ id }) => {
      toast({ variant: 'c-primary', description: '✔️ Excuse Letter has been generated.' });
      await utils.admin.ARGenerated.invalidate();
      await router.push({
        pathname: `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.ACCOMPLISHMENT_REPORT}${paths.GENERATED_FILES}${paths.OTHER_LETTERS}${paths.EXCUSE_LETTER}`,
        query: { ARGeneratedId: id },
      });
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
        <title>{`Excuse Letter ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>
      <form
        className="mx-auto my-0 flex max-w-[210mm] flex-col gap-8"
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
            data={createARGeneratedForm.watch('content.letter')}
            onChange={(value) => createARGeneratedForm.setValue('content.letter', value)}
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
                {...createARGeneratedForm.register('content.approvalOf')}
              />
              <div className="hidden print:block">
                {createARGeneratedForm.watch('content.approvalOf')}
              </div>
            </div>

            <div>
              <input
                type="text"
                placeholder="e.g.: Chairperson, Department of Physical Education"
                id="position-approval-of"
                className="rounded-sm border border-input px-1 print:hidden"
                {...createARGeneratedForm.register('content.positionApprovalOf')}
              />
              <div className="hidden print:block">
                {createARGeneratedForm.watch('content.positionApprovalOf')}
              </div>
            </div>
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
