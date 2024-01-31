import { zodResolver } from '@hookform/resolvers/zod';
import { InflowIgpRowFS } from '@prisma/client';
import { Check, Eye, Save, Trash2, X } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import PreviewImage from '~/components/preview-image';
import { useToast } from '~/components/ui/use-toast';
import { OnSuccessUpload, ResourceType, UploadButton } from '~/components/upload-button';
import { api } from '~/utils/api';
import { schemas } from '~/zod-schemas';

type UpdateInflowIgpRowFSInputs = z.infer<typeof schemas.shared.inflowIgpRowFS.update>;

export default function InflowIgpRow({ inflowIgpRow }: { inflowIgpRow: InflowIgpRowFS }) {
  const utils = api.useContext();
  const { toast } = useToast();

  const updateInflowIgpRowFSForm = useForm<UpdateInflowIgpRowFSInputs>({
    resolver: zodResolver(schemas.shared.inflowIgpRowFS.update),
    // These values are for the initial data of input fields, mostly used for 'edit/update' forms like this one
    values: {
      id: inflowIgpRow.id,
      date: inflowIgpRow.date.toISOString().split('T')[0] ?? '',
      particulars: inflowIgpRow.particulars ?? 'Item',
      price: Number(inflowIgpRow.price) ?? 0,
      quantity: inflowIgpRow.quantity ?? 0,
      ORNumber: inflowIgpRow.ORNumber ?? '00',
      unit: inflowIgpRow.unit ?? 'pc/s',
      receipt: inflowIgpRow.receipt,
      receiptId: inflowIgpRow.receipt,
    },
  });

  const updateInflowIgpRowFS = api.shared.inflowIgpRowFS.update.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async ({ id }) => {
      toast({ variant: 'c-primary', description: '✔️ FS InflowIgp updated successfully.' });
      await utils.shared.inflowIgpRowFS.invalidate();
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

  const deleteInflowIgpRowFS = api.shared.inflowIgpRowFS.delete.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ FS InflowIgp Row has been deleted' });
      await utils.shared.inflowIgpRowFS.invalidate();
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

  const onSubmitUpdateInflowIgpIgpFS: SubmitHandler<UpdateInflowIgpRowFSInputs> = (values) => {
    if (updateInflowIgpRowFS.isLoading) {
      return;
    }
    updateInflowIgpRowFS.mutate(values);
  };

  const onSuccessUpload: OnSuccessUpload = (result) => {
    updateInflowIgpRowFSForm.setValue('receipt', result.info?.secure_url);
    updateInflowIgpRowFSForm.setValue('receiptId', result.info?.public_id);
  };

  return (
    <>
      <form
        className="flex"
        onSubmit={updateInflowIgpRowFSForm.handleSubmit(onSubmitUpdateInflowIgpIgpFS, (error) =>
          console.log(error)
        )}
      >
        <input
          type="text"
          id=""
          className="w-[10%] border p-1 text-center focus:z-10 focus:font-bold"
          {...updateInflowIgpRowFSForm.register(`date`)}
        />
        <input
          type="text"
          id=""
          className="w-[10%] border p-1 text-center focus:z-10 focus:font-bold"
          {...updateInflowIgpRowFSForm.register(`quantity`)}
        />
        <input
          type="text"
          id=""
          className="w-[15%] border p-1 text-center focus:z-10 focus:font-bold"
          {...updateInflowIgpRowFSForm.register(`particulars`)}
        />
        <input
          type="text"
          id=""
          className="w-[10%] border p-1 text-center focus:z-10 focus:font-bold"
          {...updateInflowIgpRowFSForm.register(`ORNumber`)}
        />
        <input
          type="text"
          id=""
          className="w-[10%] border p-1 text-center focus:z-10 focus:font-bold"
          {...updateInflowIgpRowFSForm.register(`unit`)}
        />
        <input
          type="text"
          id=""
          className="w-[10%] border p-1 text-center focus:z-10 focus:font-bold"
          {...updateInflowIgpRowFSForm.register(`price`)}
        />
        <input
          type="text"
          id=""
          className="w-[10%] border bg-gray p-1 text-center focus:z-10 focus:font-bold"
          value={inflowIgpRow.quantity * Number(inflowIgpRow.price)}
          disabled
        />
        <div className="flex w-[15%] items-center justify-between border px-4">
          <div className="flex gap-4">
            <UploadButton
              className="rounded-sm border border-yellow bg-yellow px-1 active:scale-95"
              folder="inflowIgp-receipts"
              resourceType={ResourceType.IMAGE}
              onSuccess={onSuccessUpload}
            >
              Upload
            </UploadButton>
            {updateInflowIgpRowFSForm.watch('receiptId') ? (
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
            <PreviewImage updateForm={updateInflowIgpRowFSForm}>
              <button
                type="button"
                className={`${
                  inflowIgpRow.receiptId || updateInflowIgpRowFSForm.watch('receiptId')
                    ? 'active:scale-95'
                    : 'cursor-not-allowed opacity-50'
                } my-1 rounded-sm border border-gray bg-gray p-1 `}
                disabled={!updateInflowIgpRowFSForm.watch('receiptId')}
              >
                <Eye />
              </button>
            </PreviewImage>
          </div>
        </div>
        <div className="flex w-[10%] justify-center gap-2 border">
          <button
            type="button"
            onClick={() => deleteInflowIgpRowFS.mutate({ id: inflowIgpRow.id })}
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
