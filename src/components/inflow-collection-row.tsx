import { zodResolver } from '@hookform/resolvers/zod';
import { InflowCollectionRowFS } from '@prisma/client';
import { Check, Eye, Save, Trash2, X } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import PreviewImage from '~/components/preview-image';
import { useToast } from '~/components/ui/use-toast';
import { OnSuccessUpload, ResourceType, UploadButton } from '~/components/upload-button';
import { api } from '~/utils/api';
import { schemas } from '~/zod-schemas';

type UpdateInflowCollectionRowFSInputs = z.infer<
  typeof schemas.shared.inflowCollectionRowFS.update
>;

export default function InflowCollectionRow({
  inflowCollectionRow,
}: {
  inflowCollectionRow: InflowCollectionRowFS;
}) {
  const utils = api.useContext();
  const { toast } = useToast();

  const updateInflowCollectionRowFSForm = useForm<UpdateInflowCollectionRowFSInputs>({
    resolver: zodResolver(schemas.shared.inflowCollectionRowFS.update),
    // These values are for the initial data of input fields, mostly used for 'edit/update' forms like this one
    values: {
      id: inflowCollectionRow.id,
      date: inflowCollectionRow.date.toISOString().split('T')[0] ?? '',
      name: inflowCollectionRow.name ?? 'Item',
      amount: Number(inflowCollectionRow.amount) ?? '0',
      ORNumber: inflowCollectionRow.ORNumber ?? '00',
      receipt: inflowCollectionRow.receipt,
      receiptId: inflowCollectionRow.receipt,
    },
  });

  const updateInflowCollectionRowFS = api.shared.inflowCollectionRowFS.update.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async ({ id }) => {
      toast({ variant: 'c-primary', description: '✔️ FS InflowCollection updated successfully.' });
      await utils.shared.inflowCollectionRowFS.invalidate();
    },
    // This is the callback function after failed backend execution. This is mostly used for 'unique' data conflict errors like unique email, etc.
    onError: () => {
      toast({
        variant: 'destructive',
        title: '❌ Internal Server Error',
        description: 'Creating of FS Inflow Collection failed.',
      });
    },
  });

  const deleteInflowCollectionRowFS = api.shared.inflowCollectionRowFS.delete.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ FS InflowCollection Row has been deleted' });
      await utils.shared.inflowCollectionRowFS.invalidate();
    },
    // This is the callback function after failed backend execution. This is mostly used for 'unique' data conflict errors like unique email, etc.
    onError: () => {
      toast({
        variant: 'destructive',
        title: '❌ Internal Server Error',
        description: 'Deleting of FS Inflow Row failed.',
      });
    },
  });

  const onSubmitUpdateInflowCollectionCollectionFS: SubmitHandler<
    UpdateInflowCollectionRowFSInputs
  > = (values) => {
    if (updateInflowCollectionRowFS.isLoading) {
      return;
    }
    updateInflowCollectionRowFS.mutate(values);
  };

  const onSuccessUpload: OnSuccessUpload = (result) => {
    updateInflowCollectionRowFSForm.setValue('receipt', result.info?.secure_url);
    updateInflowCollectionRowFSForm.setValue('receiptId', result.info?.public_id);
  };

  return (
    <>
      <form
        className="flex"
        onSubmit={updateInflowCollectionRowFSForm.handleSubmit(
          onSubmitUpdateInflowCollectionCollectionFS,
          (error) => console.log(error)
        )}
      >
        <input
          type="text"
          id=""
          className="w-[20%] border p-1 text-center focus:z-10 focus:font-bold"
          {...updateInflowCollectionRowFSForm.register(`date`)}
        />
        <input
          type="text"
          id=""
          className="w-[30%] border p-1 text-center focus:z-10 focus:font-bold"
          {...updateInflowCollectionRowFSForm.register(`name`)}
        />
        <input
          type="text"
          id=""
          className="w-[10%] border p-1 text-center focus:z-10 focus:font-bold"
          {...updateInflowCollectionRowFSForm.register(`ORNumber`)}
        />
        <input
          type="text"
          id=""
          className="w-[10%] border p-1 text-center focus:z-10 focus:font-bold"
          {...updateInflowCollectionRowFSForm.register(`amount`)}
        />
        <div className="flex w-[20%] items-center justify-between border px-4">
          <div className="flex gap-4">
            <UploadButton
              className="rounded-sm border border-yellow bg-yellow px-1 active:scale-95"
              folder="inflowCollection-receipts"
              resourceType={ResourceType.IMAGE}
              onSuccess={onSuccessUpload}
            >
              Upload
            </UploadButton>
            {updateInflowCollectionRowFSForm.watch('receiptId') ? (
              <div className="text-green">
                <Check />
              </div>
            ) : (
              <div className="text-red">
                <X />
              </div>
            )}
          </div>
          <div className="flex items-center">
            <PreviewImage updateForm={updateInflowCollectionRowFSForm}>
              <button
                type="button"
                className={`${
                  inflowCollectionRow.receiptId ||
                  updateInflowCollectionRowFSForm.watch('receiptId')
                    ? 'active:scale-95'
                    : 'cursor-not-allowed opacity-50'
                } my-1 rounded-sm border border-gray bg-gray p-1 `}
                disabled={!updateInflowCollectionRowFSForm.watch('receiptId')}
              >
                <Eye />
              </button>
            </PreviewImage>
          </div>
        </div>
        <div className="flex w-[10%] justify-center gap-2 border">
          <button
            type="button"
            onClick={() => deleteInflowCollectionRowFS.mutate({ id: inflowCollectionRow.id })}
            className="my-1 rounded-sm border border-red bg-red p-1 text-white active:scale-95"
          >
            <Trash2 />
          </button>
          <button
            type="submit"
            className="my-1 rounded-sm border border-gray bg-gray p-1 active:scale-95"
          >
            <Save />
          </button>
        </div>
      </form>
    </>
  );
}
