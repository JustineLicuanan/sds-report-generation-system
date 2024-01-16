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

export default function ResolutionPage() {
  const router = useRouter();
  const utils = api.useContext();
  const { toast } = useToast();

  const createARGeneratedForm = useForm<CreateARGeneratedInputs>({
    resolver: zodResolver(schemas.shared.generatedAR.create),
    // Use defaultValues if the values are NOT from the database
    defaultValues: {
      template: GeneratedARTemplate.RESOLUTION,
      // This 'content' is JSON, you can structure it however you like
      content: { resolution: [{ whereas: '', description: '' }] },
    },
  });

  const resolutionFieldArray = useFieldArray({
    name: 'content.resolution',
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
          onSubmit={createARGeneratedForm.handleSubmit(onSubmitCreateARGenerated, (err) => {
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
                {...createARGeneratedForm.register(`content.appointees`)}
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
                {...createARGeneratedForm.register(`content.resolutionNumber`)}
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
                  {...createARGeneratedForm.register(`content.resolution.${idx}.whereas`)}
                />
                <textarea
                  id=""
                  placeholder="Content"
                  cols={30}
                  rows={3}
                  className="rounded-sm border border-input px-1"
                  {...createARGeneratedForm.register(`content.resolution.${idx}.description`)}
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
                {...createARGeneratedForm.register(`content.signedDate`)}
              />
            </div>
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
