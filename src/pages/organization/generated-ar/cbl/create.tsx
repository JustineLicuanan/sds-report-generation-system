import { zodResolver } from '@hookform/resolvers/zod';
import { GeneratedARTemplate } from '@prisma/client';
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

type CreateARGeneratedInputs = z.infer<typeof schemas.shared.generatedAR.create>;

export default function CBLPage() {
  const router = useRouter();
  const utils = api.useContext();
  const { toast } = useToast();

  const createARGeneratedForm = useForm<CreateARGeneratedInputs>({
    resolver: zodResolver(schemas.shared.generatedAR.create),
    // Use defaultValues if the values are NOT from the database
    defaultValues: {
      template: GeneratedARTemplate.CBL,
      // This 'content' is JSON, you can structure it however you like
      content: { articles: [{ articleNumber: '', description: '' }] },
    },
  });

  const articlesFieldArray = useFieldArray({
    name: 'content.articles',
    control: createARGeneratedForm.control,
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
          onSubmit={createARGeneratedForm.handleSubmit(onSubmitCreateARGenerated, (err) => {
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
                {...createARGeneratedForm.register(`content.articles.${idx}.articleNumber`)}
              />
              <label htmlFor="content-article">Content:</label>
              <textarea
                id="content-article"
                placeholder="Content of article"
                cols={30}
                rows={3}
                className="rounded-sm border border-input px-1"
                {...createARGeneratedForm.register(`content.articles.${idx}.description`)}
              ></textarea>
            </div>
          ))}
          <div>
            <label htmlFor="signed-date">Date Signed:</label>
            <input
              type="date"
              id="signed-date"
              className="rounded-sm border border-input bg-transparent px-1"
              {...createARGeneratedForm.register('content.date')}
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => articlesFieldArray.remove(articlesFieldArray.fields.length - 1)}
              className="rounded-sm border border-red bg-red px-3 text-white active:scale-95"
              disabled={articlesFieldArray.fields.length === 1}
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
      </main>
    </>
  );
}
