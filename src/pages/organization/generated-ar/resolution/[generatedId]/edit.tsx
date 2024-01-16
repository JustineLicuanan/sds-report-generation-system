import { zodResolver } from '@hookform/resolvers/zod';
import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
import { useToast } from '~/components/ui/use-toast';
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

export default function ResolutionPage() {
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
        : { resolution: [{ whereas: '', description: '' }] },
    },
  });

  const resolutionFieldArray = useFieldArray({
    name: 'content.resolution',
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
  return (
    <>
      <Head>
        <title>{`Resolution ${meta.SEPARATOR} ${meta.NAME}`}</title>
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
          <div className="text-2xl font-bold">Generate Resolution</div>
          <div className="mt-8 flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <label htmlFor="select-appointee">Select Appointees:</label>
              <select
                id="select-appointee"
                className="rounded-sm border border-input bg-transparent p-1"
                {...updateARGeneratedForm.register(`content.appointees`)}
              >
                <option value="advisers">Advisers</option>
                <option value="committees">Committees</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="resu-no">Resolution No:</label>
              <input
                type="text"
                id="resu-no"
                placeholder="XXX"
                className="rounded-sm border border-input bg-transparent px-1"
                {...updateARGeneratedForm.register(`content.resolutionNumber`)}
              />
            </div>

            <div className="mt-4 font-bold">Content</div>
            {resolutionFieldArray.fields.map((field, idx) => (
              <div key={field.id} className="my-1 flex flex-col justify-end gap-2">
                <input
                  type="text"
                  id="resu-no"
                  placeholder="WHEREAS"
                  className="rounded-sm border border-input bg-transparent px-1"
                  {...updateARGeneratedForm.register(`content.resolution.${idx}.whereas`)}
                />
                <textarea
                  id=""
                  placeholder="Content"
                  cols={30}
                  rows={3}
                  className="rounded-sm border border-input px-1"
                  {...updateARGeneratedForm.register(`content.resolution.${idx}.description`)}
                ></textarea>
              </div>
            ))}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => resolutionFieldArray.remove(resolutionFieldArray.fields.length - 1)}
                className="rounded-sm border border-red bg-red px-3 text-white active:scale-95"
              >
                Remove content
              </button>
              <button
                type="button"
                onClick={() => {
                  resolutionFieldArray.append({
                    whereas: '',
                    description: '',
                  });
                }}
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Add content
              </button>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <label htmlFor="signed-date">Signed Date:</label>
              <input
                type="date"
                id="signed-date"
                className="rounded-sm border border-input bg-transparent px-1"
                {...updateARGeneratedForm.register(`content.signedDate`)}
              />
            </div>
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
