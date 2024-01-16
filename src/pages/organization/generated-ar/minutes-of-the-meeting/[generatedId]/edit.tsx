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

export default function MinutesOfTheMeetingPage() {
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
            attendees: [{ name: '', position: '' }],
            agenda: [{ agendaContent: '' }],
            commencement: [{ commencementContent: '' }],
          },
    },
  });

  const attendeesFieldArray = useFieldArray({
    name: 'content.attendees',
    control: updateARGeneratedForm.control,
  });

  const agendaFieldArray = useFieldArray({
    name: 'content.agenda',
    control: updateARGeneratedForm.control,
  });

  const commencementFieldArray = useFieldArray({
    name: 'content.commencement',
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
        <title>{`Minutes of the Meeting ${meta.SEPARATOR} ${meta.NAME}`}</title>
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
          <div className="text-2xl font-bold">Generate Minutes of the Meeting</div>
          <div className="mt-8 flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <label htmlFor="date">Date: </label>
              <input
                type="date"
                id="date"
                className="rounded-sm border border-input bg-transparent px-1"
                {...updateARGeneratedForm.register(`content.date`)}
              />
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="location">Location: </label>
              <input
                type="text"
                id="location"
                className="rounded-sm border border-input bg-transparent px-1"
                {...updateARGeneratedForm.register(`content.location`)}
              />
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="time-started">Time Started: </label>
              <input
                type="time"
                id="time-started"
                className="rounded-sm border border-input bg-transparent px-1"
                {...updateARGeneratedForm.register(`content.timeStarted`)}
              />
            </div>
            <div className="mt-4 font-bold">ATTENDEES</div>
            {attendeesFieldArray.fields.map((field, idx) => (
              <div key={field.id} className="my-1 flex gap-2">
                <input
                  type="text"
                  id="name"
                  placeholder="Name"
                  className="w-1/2 rounded-sm border border-input bg-transparent px-1"
                  {...updateARGeneratedForm.register(`content.attendees.${idx}.name`)}
                />
                <input
                  type="text"
                  id="position"
                  placeholder="Position"
                  className="w-1/2 rounded-sm border border-input bg-transparent px-1"
                  {...updateARGeneratedForm.register(`content.attendees.${idx}.position`)}
                />
              </div>
            ))}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => attendeesFieldArray.remove(attendeesFieldArray.fields.length - 1)}
                className="rounded-sm border border-red bg-red px-3 text-white active:scale-95"
                disabled={attendeesFieldArray.fields.length === 1}
              >
                Remove attendees
              </button>
              <button
                type="button"
                onClick={() => {
                  attendeesFieldArray.append({
                    name: '',
                    position: '',
                  });
                }}
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Add attendees
              </button>
            </div>

            <div className="mt-4 font-bold">AGENDA</div>
            {agendaFieldArray.fields.map((field, idx) => (
              <div key={field.id} className="my-1 flex gap-2">
                <textarea
                  id="agenda"
                  placeholder="Add agenda content"
                  cols={30}
                  rows={2}
                  className="w-full rounded-sm border border-input bg-transparent px-1"
                  {...updateARGeneratedForm.register(`content.agenda.${idx}.agendaContent`)}
                ></textarea>
              </div>
            ))}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => agendaFieldArray.remove(agendaFieldArray.fields.length - 1)}
                className="rounded-sm border border-red bg-red px-3 text-white active:scale-95"
                disabled={agendaFieldArray.fields.length === 1}
              >
                Remove content
              </button>
              <button
                type="button"
                onClick={() => {
                  agendaFieldArray.append({
                    agendaContent: '',
                  });
                }}
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Add content
              </button>
            </div>

            <div className="mt-4 font-bold">COMMENCEMENT</div>
            {commencementFieldArray.fields.map((field, idx) => (
              <div key={field.id} className="my-1 flex gap-2">
                <textarea
                  id="commencement"
                  placeholder="Add commencement content"
                  cols={30}
                  rows={2}
                  className="w-full rounded-sm border border-input bg-transparent px-1"
                  {...updateARGeneratedForm.register(
                    `content.commencement.${idx}.commencementContent`
                  )}
                ></textarea>{' '}
              </div>
            ))}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() =>
                  commencementFieldArray.remove(commencementFieldArray.fields.length - 1)
                }
                className="rounded-sm border border-red bg-red px-3 text-white active:scale-95"
                disabled={commencementFieldArray.fields.length === 1}
              >
                Remove content
              </button>
              <button
                type="button"
                onClick={() => {
                  commencementFieldArray.append({
                    commencementContent: '',
                  });
                }}
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Add content
              </button>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <label htmlFor="adjourned-time">Time Adjourned:</label>
              <input
                type="time"
                id="adjourned-date"
                className="rounded-sm border border-input bg-transparent px-1"
                {...updateARGeneratedForm.register(`content.timeAdjourned`)}
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
