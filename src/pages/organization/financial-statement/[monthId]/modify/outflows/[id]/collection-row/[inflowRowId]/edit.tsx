import { zodResolver } from '@hookform/resolvers/zod';
import { type GetServerSideProps } from 'next';
import { CldImage } from 'next-cloudinary';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
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
import { schemas } from '~/zod-schemas';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.organization(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

type EditFSInflowRowInputs = z.infer<typeof schemas.shared.inflowCollectionRowFS.update>;

export default function EditCollectionRowPage() {
  const router = useRouter();
  const monthId = router.query.monthId;
  const inflowId = router.query.inflowId;
  const inflowRowId = router.query.inflowRowId;
  const utils = api.useContext();
  const { toast } = useToast();

  const getFSInflowRowQuery = api.shared.inflowCollectionRowFS.get.useQuery({
    where: { id: inflowRowId as string },
  });
  const FSInflowRow = getFSInflowRowQuery.data?.[0];

  const createFSInflowRowForm = useForm<EditFSInflowRowInputs>({
    resolver: zodResolver(schemas.shared.inflowCollectionRowFS.update),
    // These values are for the initial data of input fields, mostly used for 'edit/update' forms like this one
    values: {
      id: FSInflowRow?.id ?? '',
      date: FSInflowRow?.date.toISOString().split('T')[0],
      name: FSInflowRow?.name,
      ORNumber: FSInflowRow?.ORNumber,
      amount: FSInflowRow?.amount?.toString(),
      receipt: FSInflowRow?.receipt,
      receiptId: FSInflowRow?.receiptId,
    },
  });

  const createFSInflowRow = api.shared.inflowCollectionRowFS.update.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ FS Inflow Row has been created' });
      await utils.shared.orgSignatoryInfo.invalidate();
      await router.push(
        `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}/${monthId}${paths.MODIFY_FINANCIAL_STATEMENT}${paths.INFLOWS}/${inflowId}${paths.ADD_INFLOW}`
      );
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
  const onSubmitEditFSInflowRow: SubmitHandler<EditFSInflowRowInputs> = (values) => {
    if (createFSInflowRow.isLoading) {
      return;
    }
    createFSInflowRow.mutate(values);
  };

  const [fileName, setFileName] = useState('');
  const onSuccessUpload: OnSuccessUpload = (result) => {
    createFSInflowRowForm.setValue('receipt', result.info?.secure_url);
    createFSInflowRowForm.setValue('receiptId', result.info?.public_id);
    setFileName(result.info?.original_filename ?? '');
  };

  return (
    <>
      <Head>
        <title>{`Edit Collection Row ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />

      <main className="flex">
        {/* SIDE BAR*/}
        <OrganizationSideBarMenu />

        <form
          id="main-content"
          className="mx-4 my-4  w-full"
          onSubmit={createFSInflowRowForm.handleSubmit(onSubmitEditFSInflowRow, (err) => {
            console.error(err);
          })}
        >
          <div className="text-2xl font-bold">Generate Edit Collection Row</div>
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
              {/* <input type="file" id="receipt" {...createFSInflowRowForm.register('receipt')} /> */}
              <UploadButton
                className={buttonVariants({ variant: 'c-secondary' })}
                folder="receipts"
                resourceType={ResourceType.IMAGE}
                onSuccess={onSuccessUpload}
                disabled={createFSInflowRow.isLoading || createFSInflowRow.isSuccess}
              >
                Upload
              </UploadButton>
              <div className="">{fileName}</div>
            </div>
            {createFSInflowRowForm.watch('receiptId') && (
              <div>
                <div>Receipt Preview:</div>
                <CldImage
                  width="96"
                  height="96"
                  src={createFSInflowRowForm.watch('receiptId')!}
                  alt="FS Inflow Receipt Image"
                  className="h-52 w-52 border border-input"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() =>
                router.push(
                  `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}/${monthId}${paths.MODIFY_FINANCIAL_STATEMENT}${paths.INFLOWS}/${inflowId}${paths.ADD_INFLOW}`
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
