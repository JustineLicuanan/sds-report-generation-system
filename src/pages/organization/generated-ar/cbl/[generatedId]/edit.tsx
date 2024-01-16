import { zodResolver } from '@hookform/resolvers/zod';
import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useFieldArray, useForm, type SubmitHandler } from 'react-hook-form';
import { type z } from 'zod';
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

export default function CBLPage() {
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
      // If the 'content' is from the database, it needs to be parsed first because it is stringified in the backend
      content: generatedAR?.content
        ? JSON.parse(generatedAR.content)
        : { articles: [{ articleNumber: '', description: '' }] },
    },
  });

  const articlesFieldArray = useFieldArray({
    name: 'content.articles',
    control: updateARGeneratedForm.control,
  });

  const updateARGenerated = api.shared.generatedAR.update.useMutation({
    onSuccess: async () => {
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
        <title>{`CBL ${meta.SEPARATOR} ${meta.NAME}`}</title>
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
          <div className="text-2xl font-bold">Generate Constitutional and By-Laws</div>
          {articlesFieldArray.fields.map((field, idx) => (
            <div key={field.id} className="my-1 flex flex-col justify-end gap-2">
              <label htmlFor="article-no">Article No:</label>
              <input
                type="text"
                id="article-no"
                placeholder="eg. IV"
                className="rounded-sm border border-input bg-transparent px-1"
                {...updateARGeneratedForm.register(`content.articles.${idx}.articleNumber`)}
              />
              <label htmlFor="content-article">Content:</label>
              <textarea
                id="content-article"
                placeholder="Content of article"
                cols={30}
                rows={3}
                className="rounded-sm border border-input px-1"
                {...updateARGeneratedForm.register(`content.articles.${idx}.description`)}
              ></textarea>
            </div>
          ))}
          <div>
            <label htmlFor="signed-date">Date Signed:</label>
            <input
              type="date"
              id="signed-date"
              className="rounded-sm border border-input bg-transparent px-1"
              {...updateARGeneratedForm.register('content.date')}
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => articlesFieldArray.remove(articlesFieldArray.fields.length - 1)}
              className="rounded-sm border border-red bg-red px-3 text-white active:scale-95"
            >
              Remove content
            </button>
            <button
              type="button"
              onClick={() => articlesFieldArray.append({ articleNumber: '', description: '' })}
              className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
            >
              Add content
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
                  )}/${generatedAR?.id}${paths.PRINT}`
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
