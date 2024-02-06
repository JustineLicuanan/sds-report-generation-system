import { CldImage } from 'next-cloudinary';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from '~/components/ui/dialog';
import { schemas } from '~/zod-schemas';

type UpdateOutflowRowFSInputs = z.infer<typeof schemas.shared.outflowRowFS.update>;
type UpdateInflowIgpRowFSInputs = z.infer<typeof schemas.shared.inflowIgpRowFS.update>;
type UpdateInflowCollectionRowFSInputs = z.infer<
  typeof schemas.shared.inflowCollectionRowFS.update
>;

type Props = {
  // handleContinue: () => void;
  updateForm: UseFormReturn<
    UpdateOutflowRowFSInputs | UpdateInflowIgpRowFSInputs | UpdateInflowCollectionRowFSInputs
  >;
  children: React.ReactNode;
  receiptId?: string | null;
  // title?: string;
  // description: string;
};

export default function PreviewImage({ children, updateForm }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogDescription>
            <div className="flex justify-center">
              {updateForm.watch('receiptId') && (
                <CldImage
                  width="192"
                  height="192"
                  src={updateForm.watch('receiptId') ?? ''}
                  alt="Receipt"
                />
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
