import { zodResolver } from '@hookform/resolvers/zod';
import { OutflowRowFS } from '@prisma/client';
import { Check, Eye, Save, Trash2, X } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { CustomDialog } from '~/components/custom-dialog';
import PreviewImage from '~/components/preview-image';
import { useToast } from '~/components/ui/use-toast';
import { OnSuccessUpload, ResourceType, UploadButton } from '~/components/upload-button';
import { api } from '~/utils/api';
import { schemas } from '~/zod-schemas';

type UpdateOutflowRowFSInputs = z.infer<typeof schemas.shared.outflowRowFS.update>;

export default function OutflowRow({ outflowRow }: { outflowRow: OutflowRowFS }) {
  const utils = api.useContext();
  const { toast } = useToast();

  const updateOutflowRowFSForm = useForm<UpdateOutflowRowFSInputs>({
    resolver: zodResolver(schemas.shared.outflowRowFS.update),
    // These values are for the initial data of input fields, mostly used for 'edit/update' forms like this one
    values: {
      id: outflowRow.id,
      date: outflowRow.date.toISOString().split('T')[0] ?? '',
      particulars: outflowRow.particulars ?? 'Item',
      price: Number(outflowRow.price) ?? 0,
      quantity: outflowRow.quantity ?? 0,
      unit: outflowRow.unit ?? 'pc/s',
      receipt: outflowRow.receipt,
      receiptId: outflowRow.receipt,
    },
  });

  const updateOutflowRowFS = api.shared.outflowRowFS.update.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async ({ id }) => {
      toast({ variant: 'c-primary', description: '✔️ FS Outflow updated successfully.' });
      await utils.shared.outflowRowFS.invalidate();
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

  const deleteOutflowRowFS = api.shared.outflowRowFS.delete.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ FS Outflow Row has been deleted' });
      await utils.shared.outflowRowFS.invalidate();
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

  const onSubmitUpdateOutflowIgpFS: SubmitHandler<UpdateOutflowRowFSInputs> = (values) => {
    if (updateOutflowRowFS.isLoading) {
      return;
    }
    updateOutflowRowFS.mutate(values);
  };

  const onSuccessUpload: OnSuccessUpload = (result) => {
    updateOutflowRowFSForm.setValue('receipt', result.info?.secure_url);
    updateOutflowRowFSForm.setValue('receiptId', result.info?.public_id);
  };

  return (
    <>
      <form
        className="flex"
        onSubmit={updateOutflowRowFSForm.handleSubmit(onSubmitUpdateOutflowIgpFS, (error) =>
          console.log(error)
        )}
      >
        <input
          type="text"
          id=""
          className="w-[15%] border p-1 text-center focus:z-10 focus:font-bold"
          {...updateOutflowRowFSForm.register(`date`)}
        />
        <input
          type="text"
          id=""
          className="w-[10%] border p-1 text-center focus:z-10 focus:font-bold"
          {...updateOutflowRowFSForm.register(`quantity`)}
        />
        <input
          type="text"
          id=""
          className="w-[15%] border p-1 text-center focus:z-10 focus:font-bold"
          {...updateOutflowRowFSForm.register(`particulars`)}
        />
        <input
          type="text"
          id=""
          className="w-[10%] border p-1 text-center focus:z-10 focus:font-bold"
          {...updateOutflowRowFSForm.register(`unit`)}
        />
        <input
          type="text"
          id=""
          className="w-[10%] border p-1 text-center focus:z-10 focus:font-bold"
          {...updateOutflowRowFSForm.register(`price`)}
        />
        <input
          type="text"
          id=""
          className="w-[10%] border bg-gray p-1 text-center focus:z-10 focus:font-bold"
          value={outflowRow.quantity * Number(outflowRow.price)}
          disabled
        />
        <div className="flex w-[15%] items-center justify-between border px-4">
          <div className="flex gap-4">
            <UploadButton
              className="rounded-sm border border-yellow bg-yellow px-1 active:scale-95"
              folder="outflow-receipts"
              resourceType={ResourceType.IMAGE}
              onSuccess={onSuccessUpload}
            >
              Upload
            </UploadButton>
            {updateOutflowRowFSForm.watch('receiptId') ? (
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
            <PreviewImage updateForm={updateOutflowRowFSForm}>
              <button
                type="button"
                className={`${
                  outflowRow.receiptId || updateOutflowRowFSForm.watch('receiptId')
                    ? 'active:scale-95'
                    : 'cursor-not-allowed opacity-50'
                } my-1 rounded-sm border border-gray bg-gray p-1 `}
                disabled={!updateOutflowRowFSForm.watch('receiptId')}
              >
                <Eye />
              </button>
            </PreviewImage>
          </div>
        </div>
        <div className="flex w-[15%] justify-center gap-2 border">
          <CustomDialog
            handleContinue={() => deleteOutflowRowFS.mutate({ id: outflowRow.id })}
            description="This action cannot be undone. This will permanently delete the row from our servers."
          >
            <button
              type="button"
              className="my-1 rounded-sm border border-red bg-red p-1 text-white active:scale-95"
            >
              <Trash2 />
            </button>
          </CustomDialog>

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
