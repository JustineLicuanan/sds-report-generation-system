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

type CreateFSOutflowRowInputs = z.infer<typeof schemas.shared.FSOutflowRow.create>;

export default function CreateCollectionRowPage() {
  const router = useRouter();
  const { monthlyID, FSOutflowID } = router.query;
  const utils = api.useContext();
  const { toast } = useToast();

  const createFSOutflowRowForm = useForm<CreateFSOutflowRowInputs>({
    resolver: zodResolver(schemas.shared.FSOutflowRow.create),
    // These values are for the initial data of input fields, mostly used for 'edit/update' forms like this one
    values: {
      outflowId: FSOutflowID as string,
      date: new Date().toISOString().split('T')[0] ?? '',
      particulars: '',
      quantity: 0,
      unit: '',
      price: '',
      receipt: '',
    },
  });

  const createFSOutflowRow = api.shared.FSOutflowRow.create.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ FS Outflow Row has been created' });
      await utils.shared.orgSignatoryInfo.invalidate();
      router.push({
        pathname: `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.FINANCIAL_STATEMENT}/${monthlyID}${paths.MODIFY_FINANCIAL_STATEMENT}/${paths.INFLOWS}/${FSOutflowID}${paths.ADD_INFLOW}`,
        query: { monthlyID: monthlyID, FSOutflowID: FSOutflowID },
      });
    },
    // This is the callback function after failed backend execution. This is mostly used for 'unique' data conflict errors like unique email, etc.
    onError: () => {
      toast({
        variant: 'destructive',
        title: '❌ Internal Server Error',
        description: 'Creating of FS Outflow Row failed.',
      });
    },
  });

  // This is the function that will run after clicking submit. Of course, it will NOT run if there are input validation errors like 'required', etc.
  const onSubmitCreateFSOutflowRow: SubmitHandler<CreateFSOutflowRowInputs> = (values) => {
    if (createFSOutflowRow.isLoading) {
      return;
    }
    createFSOutflowRow.mutate(values);
  };

  const [fileName, setFileName] = useState('');
  const onSuccessUpload: OnSuccessUpload = (result) => {
    createFSOutflowRowForm.setValue('receipt', result.info?.secure_url);
    createFSOutflowRowForm.setValue('receiptId', result.info?.public_id);
    setFileName(result.info?.original_filename ?? '');
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
          onSubmit={createFSOutflowRowForm.handleSubmit(onSubmitCreateFSOutflowRow, (err) => {
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
                {...createFSOutflowRowForm.register('date')}
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                placeholder=""
                className="rounded-sm border border-input bg-transparent px-1"
                {...createFSOutflowRowForm.register('quantity')}
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="particulars">Particular:</label>
              <input
                type="text"
                id="particulars"
                placeholder=""
                className="rounded-sm border border-input bg-transparent px-1"
                {...createFSOutflowRowForm.register('particulars')}
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="unit">Unit:</label>
              <input
                type="text"
                id="unit"
                placeholder=""
                className="rounded-sm border border-input bg-transparent px-1"
                {...createFSOutflowRowForm.register('unit')}
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="price">Price:</label>
              <input
                type="text"
                id="price"
                placeholder=""
                className="rounded-sm border border-input bg-transparent px-1"
                {...createFSOutflowRowForm.register('price')}
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="amount">Amount:</label>
              <input
                type="number"
                id="amount"
                placeholder=""
                className="rounded-sm border border-input bg-transparent px-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="receipt">Receipt:</label>
              {/* <input type="file" id="receipt" {...createFSOutflowRowForm.register('receipt')} /> */}
              <UploadButton
                className={buttonVariants({ variant: 'c-secondary' })}
                folder="receipts"
                resourceType={ResourceType.IMAGE}
                onSuccess={onSuccessUpload}
                disabled={createFSOutflowRow.isLoading || createFSOutflowRow.isSuccess}
              >
                Upload
              </UploadButton>
              <div className="">{fileName}</div>
            </div>
            
            {createFSOutflowRowForm.watch('receiptId') && (
              <div>
                <div>Receipt Preview:</div>
                <CldImage
                  width="96"
                  height="96"
                  src={createFSOutflowRowForm.watch('receiptId')!}
                  alt="FS Outflow Receipt Image"
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
                  `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.FINANCIAL_STATEMENT}/${monthlyID}${paths.MODIFY_FINANCIAL_STATEMENT}${paths.INFLOWS}${FSOutflowID}${paths.ADD_INFLOW}`
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
