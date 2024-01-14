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

type CreateFSInflowRowInputs = z.infer<typeof schemas.shared.FSInflowRow.createCollection>;

export default function CreateCollectionRowPage() {
  const router = useRouter();
  const utils = api.useContext();
  const { toast } = useToast();

  const createFSInflowRowForm = useForm<CreateFSInflowRowInputs>({
    resolver: zodResolver(schemas.shared.FSInflowRow.createCollection),
    // These values are for the initial data of input fields, mostly used for 'edit/update' forms like this one
  });

  const createFSInflowRow = api.shared.FSInflowRow.createCollection.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ FS Inflow Row has been created' });
      await utils.admin.orgSignatoryInfo.invalidate();
    },
    // This is the callback function after failed backend execution. This is mostly used for 'unique' data conflict errors like unique email, etc.
    onError: () => {
      toast({
        variant: 'destructive',
        title: '❌ Internal Server Error',
        description: 'Creating of FS Inflow Row failed.',
      });
    },
  });

  // This is the function that will run after clicking submit. Of course, it will NOT run if there are input validation errors like 'required', etc.
  const onSubmitCreateFSInflowRow: SubmitHandler<CreateFSInflowRowInputs> = (values) => {
    if (createFSInflowRow.isLoading) {
      return;
    }
    createFSInflowRow.mutate(values);
  };
  return (
    <>
      <Head>
        <title>{`Create Collection Row ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />

      <main className="flex">
        {/* SIDE BAR*/}
        <OrganizationSideBarMenu />

        <form
          id="main-content"
          className="mx-4 my-4  w-full"
          onSubmit={createFSInflowRowForm.handleSubmit(onSubmitCreateFSInflowRow, (err) => {
            console.error(err);
          })}
        >
          <div className="text-2xl font-bold">Generate Create Collection Row</div>
          <div className="my-4 flex flex-col justify-end gap-2">
            <div className="flex items-center gap-2">
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                id="date"
                placeholder=""
                className="rounded-sm border border-input bg-transparent px-1"
                {...createFSInflowRowForm.register('date')}
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                placeholder=""
                className="rounded-sm border border-input bg-transparent px-1"
                {...createFSInflowRowForm.register('name')}
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="or-no">OR Number:</label>
              <input
                type="text"
                id="or-no"
                placeholder=""
                className="rounded-sm border border-input bg-transparent px-1"
                {...createFSInflowRowForm.register('ORNumber')}
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="amount">Amount:</label>
              <input
                type="text"
                id="amount"
                placeholder=""
                className="rounded-sm border border-input bg-transparent px-1"
                {...createFSInflowRowForm.register('amount')}
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="receipt">Receipt:</label>
              <input type="file" id="receipt" {...createFSInflowRowForm.register('receipt')} />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() =>
                router.push(
                  `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.FINANCIAL_STATEMENT}/september${paths.MODIFY_FINANCIAL_STATEMENT}`
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
      </main>
    </>
  );
}
