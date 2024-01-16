import { zodResolver } from '@hookform/resolvers/zod';
import { type GetServerSideProps } from 'next';
import { CldImage } from 'next-cloudinary';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
import { buttonVariants } from '~/components/ui/button';
import { useToast } from '~/components/ui/use-toast';
import { OnSuccessUpload, ResourceType, UploadButton } from '~/components/upload-button';
import { meta, paths } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';
import { enumToSlug } from '~/utils/enum-to-slug';
import { schemas } from '~/zod-schemas';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.organization(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

type UpdateARGeneratedInputs = z.infer<typeof schemas.shared.generatedAR.update>;

export default function CommunityExtensionServicesPage() {
  const router = useRouter();
  const utils = api.useContext();
  const { toast } = useToast();

  const generatedId = router.query.generatedId;

  const getARGenerated = api.shared.generatedAR.get.useQuery({
    where: { id: generatedId as string },
  });
  const generatedAR = getARGenerated.data?.[0];

  const updateARGeneratedForm = useForm<UpdateARGeneratedInputs>({
    resolver: zodResolver(schemas.shared.generatedAR.update),
    // Use defaultValues if the values are NOT from the database
    values: {
      id: generatedAR?.id as string,
      template: generatedAR?.template,
      // This 'content' is JSON, you can structure it however you like
      content: generatedAR?.content
        ? JSON.parse(generatedAR.content)
        : {
            documents: [
              { documentPhoto: '', activity: '', location: '', date: '', shortDescription: '' },
            ],
          },
    },
  });

  const documentsFieldArray = useFieldArray({
    name: 'content.documents',
    control: updateARGeneratedForm.control,
  });

  const updateARGenerated = api.shared.generatedAR.update.useMutation({
    onSuccess: async ({ id }) => {
      toast({ variant: 'c-primary', description: '✔️ An AR page has been updated.' });
      await utils.shared.generatedAR.invalidate();
    },
    onError: () => {
      toast({ variant: 'destructive', description: '❌ Internal Server Error' });
    },
  });

  const deleteARGenerated = api.shared.generatedAR.delete.useMutation({
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ An AR page has been deleted.' });
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

  const [fileName, setFileName] = useState('');
  const onSuccessUpload: OnSuccessUpload = (result) => {
    updateARGeneratedForm.setValue('content.documentPhoto', result.info?.secure_url);
    updateARGeneratedForm.setValue('content.documentPhoto', result.info?.public_id);
    setFileName(result.info?.original_filename ?? '');
  };
  return (
    <>
      <Head>
        <title>{`Community Extension Services ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />

      <main className="flex">
        {/* SIDE BAR*/}
        <OrganizationSideBarMenu />

        <form
          id="main-content"
          className="mx-4 my-4  w-full"
          onSubmit={updateARGeneratedForm.handleSubmit(onSubmitUpdateARGenerated, (err) => {
            console.error(err);
          })}
        >
          <div className="text-2xl font-bold">Generate Community Extension Services</div>
          {documentsFieldArray.fields.map((field, idx) => (
            <div key={field.id} className="my-4 flex flex-col justify-end gap-2">
              <div className="flex items-center gap-2">
                <label htmlFor="document-photo">Document Photo:</label>
                <UploadButton
                  className={buttonVariants({ variant: 'c-secondary' })}
                  folder="document-photos"
                  resourceType={ResourceType.IMAGE}
                  onSuccess={onSuccessUpload}
                >
                  Upload
                </UploadButton>
                <div className="">{fileName}</div>
              </div>
              {updateARGeneratedForm.watch('content.documentPhoto') && (
                <div>
                  <div>Document Photo Preview:</div>
                  <CldImage
                    width="96"
                    height="96"
                    src={updateARGeneratedForm.watch('content.documentPhoto')!}
                    alt="Document Photo Image"
                    className="h-52 w-52 border border-input"
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <label htmlFor="activity">Activity:</label>
                <input
                  type="text"
                  id="activity"
                  placeholder=""
                  className="rounded-sm border border-input bg-transparent px-1"
                  {...updateARGeneratedForm.register(`content.documents.${idx}.activity`)}
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="location">Location:</label>
                <input
                  type="text"
                  id="location"
                  placeholder=""
                  className="rounded-sm border border-input bg-transparent px-1"
                  {...updateARGeneratedForm.register(`content.documents.${idx}.location`)}
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="date">Date:</label>
                <input
                  type="date"
                  id="date"
                  placeholder=""
                  className="rounded-sm border border-input bg-transparent px-1"
                  {...updateARGeneratedForm.register(`content.documents.${idx}.date`)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="short-desc">Short description:</label>
                <textarea
                  id="short-desc"
                  placeholder="Short description"
                  cols={30}
                  rows={3}
                  className="rounded-sm border border-input px-1"
                  {...updateARGeneratedForm.register(`content.documents.${idx}.shortDescription`)}
                ></textarea>
              </div>
            </div>
          ))}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => documentsFieldArray.remove(documentsFieldArray.fields.length - 1)}
              className="rounded-sm border border-red bg-red px-3 text-white active:scale-95"
              disabled={documentsFieldArray.fields.length === 1}
            >
              Remove Document
            </button>
            <button
              type="button"
              onClick={() => {
                documentsFieldArray.append({
                  documentPhoto: '',
                  activity: '',
                  location: '',
                  date: '',
                  shortDescription: '',
                });
              }}
              className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
            >
              Add document
            </button>
          </div>
          <div className="flex justify-end gap-4">
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
              onClick={() =>
                router.push(
                  `${paths.ORGANIZATION}${paths.GENERATED_AR}/${enumToSlug(
                    generatedAR?.template ?? ''
                  )}/${generatedAR?.id}${paths.EDIT}`
                )
              }
              className="mt-4 rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
            >
              Preview
            </button>
          </div>
        </form>
      </main>
    </>
  );
}