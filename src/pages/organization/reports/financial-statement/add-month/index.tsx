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
import { getYearArray } from '~/utils/get-year-array';
import { schemas } from '~/zod-schemas';
import { Month } from '~/zod-schemas/fs-monthly';
export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.organization(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

type CreateMonthInputs = z.infer<typeof schemas.shared.FSMonthly.create>;

export default function CBLPage() {
  const router = useRouter();
  const utils = api.useContext();
  const { toast } = useToast();

  const createMonthForm = useForm<CreateMonthInputs>({
    resolver: zodResolver(schemas.shared.FSMonthly.create),
  });

  const createMonth = api.shared.FSMonthly.create.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async ({ id }) => {
      toast({ variant: 'c-primary', description: '✔️ Month has been created.' });
      await utils.shared.FSMonthly.invalidate();
      await router.push(
        `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.FINANCIAL_STATEMENT}`
      );
    },
    // This is the callback function after failed backend execution. This is mostly used for 'unique' data conflict errors like unique email, etc.
    onError: () => {
      toast({
        variant: 'destructive',
        title: '❌ Internal Server Error',
        description: 'Creating a month failed.',
      });
    },
  });

  // This is the function that will run after clicking submit. Of course, it will NOT run if there are input validation errors like 'required', etc.
  const onSubmitCreateMonth: SubmitHandler<CreateMonthInputs> = (values) => {
    if (createMonth.isLoading) {
      return;
    }
    createMonth.mutate(values);
  };
  return (
    <>
      <Head>
        <title>{`Add new month ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />

      <main className="flex">
        {/* SIDE BAR*/}
        <OrganizationSideBarMenu />

        <form
          id="main-content"
          className="mx-4 my-4  flex w-full flex-col gap-2"
          onSubmit={createMonthForm.handleSubmit(onSubmitCreateMonth, (err) => {
            console.error(err);
          })}
        >
          <div className="text-2xl font-bold">Add new month</div>
          <label htmlFor="month">Month:</label>
          <select
            id="month"
            className="rounded-sm border border-input p-2"
            {...createMonthForm.register('month')}
          >
            {Object.entries(Month).map((month) => (
              <option value={month[1]}>{month[0]}</option>
            ))}
          </select>
          <label htmlFor="year">Year:</label>
          <select
            id="year"
            defaultValue={new Date().getFullYear()}
            className="rounded-sm border border-input p-2"
            {...createMonthForm.register('year')}
          >
            {Object.entries(getYearArray()).map((year) => (
              <option value={year[1]}>{year[1]}</option>
            ))}
          </select>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push(`${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}`)}
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
