import { zodResolver } from '@hookform/resolvers/zod';
import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
import { useToast } from '~/components/ui/use-toast';
import { meta, paths } from '~/meta';
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

type UpdateOrgSignatoryInfoInputs = z.infer<typeof schemas.shared.orgSignatoryInfo.update>;

export default function SetupPositionsPage() {
  const router = useRouter();
  const utils = api.useContext();
  const { toast } = useToast();

  const getOrgSignatoryInfo = api.shared.orgSignatoryInfo.get.useQuery();
  const orgSignatoryInfo = getOrgSignatoryInfo.data;

  const updateOrgSignatoryInfoForm = useForm<UpdateOrgSignatoryInfoInputs>({
    resolver: zodResolver(schemas.shared.orgSignatoryInfo.update),
    // These values are for the initial data of input fields, mostly used for 'edit/update' forms like this one
    values: {
      president: orgSignatoryInfo?.president,
      vicePresident: orgSignatoryInfo?.vicePresident,
      treasurer: orgSignatoryInfo?.treasurer,
      auditor: orgSignatoryInfo?.auditor,
      generalSecretary: orgSignatoryInfo?.generalSecretary,
      assistantSecretary: orgSignatoryInfo?.assistantSecretary,
      finance: orgSignatoryInfo?.finance,
      recruitmentCoordinator: orgSignatoryInfo?.recruitmentCoordinator,
      trainingDirector: orgSignatoryInfo?.trainingDirector,
      adviser1: orgSignatoryInfo?.adviser1,
      adviser2: orgSignatoryInfo?.adviser2,
      deptChairperson: orgSignatoryInfo?.deptChairperson,
    },
  });

  const updateOrgSignatoryInfo = api.shared.orgSignatoryInfo.update.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async ({ id }) => {
      toast({ variant: 'c-primary', description: '✔️ Signatory Information has been updated.' });
      await utils.shared.orgSignatoryInfo.invalidate();
    },
    // This is the callback function after failed backend execution. This is mostly used for 'unique' data conflict errors like unique email, etc.
    onError: () => {
      toast({
        variant: 'destructive',
        title: '❌ Internal Server Error',
        description: 'Updating of signatory information failed.',
      });
    },
  });

  // This is the function that will run after clicking submit. Of course, it will NOT run if there are input validation errors like 'required', etc.
  const onSubmitUpdateOrgSignatoryInfo: SubmitHandler<UpdateOrgSignatoryInfoInputs> = (values) => {
    if (updateOrgSignatoryInfo.isLoading) {
      return;
    }
    updateOrgSignatoryInfo.mutate(values);
  };

  return (
    <>
      <Head>
        <title>{`Setup Signatory Information ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />

      <main className="flex">
        {/* SIDE BAR*/}
        <OrganizationSideBarMenu />

        <form
          id="main-content"
          className="container w-full max-w-screen-lg p-4"
          // This is used to link the <form> to react-hook-form. The submit button must be inside the <form> tag. Don't forget to change one of the button's type to "submit"
          onSubmit={updateOrgSignatoryInfoForm.handleSubmit(
            onSubmitUpdateOrgSignatoryInfo,
            (err) => {
              console.error(err);
            }
          )}
        >
          <div className="text-2xl font-bold">⚙️ Setup Signatory Information</div>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col">
                <div className="flex items-center gap-4">
                  <label htmlFor="president">President: </label>

                  <input
                    type="text"
                    id="president"
                    className="rounded-sm border border-input bg-transparent px-1"
                    // This is used to register the input field
                    {...updateOrgSignatoryInfoForm.register('president')}
                  />
                </div>

                {/* This is the conditional validation error message */}
                <p className="h-4 text-sm font-medium text-destructive">
                  {updateOrgSignatoryInfoForm.formState.errors.president?.message}
                </p>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-4">
                  <label htmlFor="vice-president">Vice President: </label>

                  <input
                    type="text"
                    id="vice-president"
                    className="rounded-sm border border-input bg-transparent px-1"
                    // This is used to register the input field
                    {...updateOrgSignatoryInfoForm.register('vicePresident')}
                  />
                </div>

                {/* This is the conditional validation error message */}
                <p className="h-4 text-sm font-medium text-destructive">
                  {updateOrgSignatoryInfoForm.formState.errors.vicePresident?.message}
                </p>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-4">
                  <label htmlFor="treasurer">Treasurer: </label>

                  <input
                    type="text"
                    id="treasurer"
                    className="rounded-sm border border-input bg-transparent px-1"
                    // This is used to register the input field
                    {...updateOrgSignatoryInfoForm.register('treasurer')}
                  />
                </div>

                {/* This is the conditional validation error message */}
                <p className="h-4 text-sm font-medium text-destructive">
                  {updateOrgSignatoryInfoForm.formState.errors.treasurer?.message}
                </p>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-4">
                  <label htmlFor="auditor">Auditor: </label>

                  <input
                    type="text"
                    id="auditor"
                    className="rounded-sm border border-input bg-transparent px-1"
                    // This is used to register the input field
                    {...updateOrgSignatoryInfoForm.register('auditor')}
                  />
                </div>

                {/* This is the conditional validation error message */}
                <p className="h-4 text-sm font-medium text-destructive">
                  {updateOrgSignatoryInfoForm.formState.errors.auditor?.message}
                </p>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-4">
                  <label htmlFor="general-secretary">General Secretary: </label>

                  <input
                    type="text"
                    id="general-secretary"
                    className="rounded-sm border border-input bg-transparent px-1"
                    // This is used to register the input field
                    {...updateOrgSignatoryInfoForm.register('generalSecretary')}
                  />
                </div>

                {/* This is the conditional validation error message */}
                <p className="h-4 text-sm font-medium text-destructive">
                  {updateOrgSignatoryInfoForm.formState.errors.generalSecretary?.message}
                </p>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-4">
                  <label htmlFor="assistant-secretary">Assistant Secretary: </label>

                  <input
                    type="text"
                    id="assistant-secretary"
                    className="rounded-sm border border-input bg-transparent px-1"
                    // This is used to register the input field
                    {...updateOrgSignatoryInfoForm.register('assistantSecretary')}
                  />
                </div>

                {/* This is the conditional validation error message */}
                <p className="h-4 text-sm font-medium text-destructive">
                  {updateOrgSignatoryInfoForm.formState.errors.assistantSecretary?.message}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-col">
                <div className="flex items-center gap-4">
                  <label htmlFor="finance">Finance: </label>

                  <input
                    type="text"
                    id="finance"
                    className="rounded-sm border border-input bg-transparent px-1"
                    // This is used to register the input field
                    {...updateOrgSignatoryInfoForm.register('finance')}
                  />
                </div>

                {/* This is the conditional validation error message */}
                <p className="h-4 text-sm font-medium text-destructive">
                  {updateOrgSignatoryInfoForm.formState.errors.finance?.message}
                </p>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-4">
                  <label htmlFor="recruitment-coordinator">Recruitment Coordinator: </label>

                  <input
                    type="text"
                    id="recruitment-coordinator"
                    className="rounded-sm border border-input bg-transparent px-1"
                    // This is used to register the input field
                    {...updateOrgSignatoryInfoForm.register('recruitmentCoordinator')}
                  />
                </div>

                {/* This is the conditional validation error message */}
                <p className="h-4 text-sm font-medium text-destructive">
                  {updateOrgSignatoryInfoForm.formState.errors.recruitmentCoordinator?.message}
                </p>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-4">
                  <label htmlFor="training-director">Training Director: </label>

                  <input
                    type="text"
                    id="training-director"
                    className="rounded-sm border border-input bg-transparent px-1"
                    // This is used to register the input field
                    {...updateOrgSignatoryInfoForm.register('trainingDirector')}
                  />
                </div>

                {/* This is the conditional validation error message */}
                <p className="h-4 text-sm font-medium text-destructive">
                  {updateOrgSignatoryInfoForm.formState.errors.trainingDirector?.message}
                </p>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-4">
                  <label htmlFor="adviser-1">Adviser 1: </label>

                  <input
                    type="text"
                    id="adviser-1"
                    className="rounded-sm border border-input bg-transparent px-1"
                    // This is used to register the input field
                    {...updateOrgSignatoryInfoForm.register('adviser1')}
                  />
                </div>

                {/* This is the conditional validation error message */}
                <p className="h-4 text-sm font-medium text-destructive">
                  {updateOrgSignatoryInfoForm.formState.errors.adviser1?.message}
                </p>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-4">
                  <label htmlFor="adviser-2">Adviser 2: </label>

                  <input
                    type="text"
                    id="adviser-2"
                    className="rounded-sm border border-input bg-transparent px-1"
                    // This is used to register the input field
                    {...updateOrgSignatoryInfoForm.register('adviser2')}
                  />
                </div>

                {/* This is the conditional validation error message */}
                <p className="h-4 text-sm font-medium text-destructive">
                  {updateOrgSignatoryInfoForm.formState.errors.adviser2?.message}
                </p>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-4">
                  <label htmlFor="dept-chairperson">Department Chairperson: </label>

                  <input
                    type="text"
                    id="dept-chairperson"
                    className="rounded-sm border border-input bg-transparent px-1"
                    // This is used to register the input field
                    {...updateOrgSignatoryInfoForm.register('deptChairperson')}
                  />
                </div>

                {/* This is the conditional validation error message */}
                <p className="h-4 text-sm font-medium text-destructive">
                  {updateOrgSignatoryInfoForm.formState.errors.deptChairperson?.message}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push(`${paths.ORGANIZATION}${paths.MY_ORGANIZATION}`)}
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
