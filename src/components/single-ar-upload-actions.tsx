import { ARUpload, ARUploadContentType, SemReportStatus } from '@prisma/client';
import { BadgeAlert, BadgeCheck, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { CustomDialog } from '~/components/custom-dialog';
import { Button, buttonVariants } from '~/components/ui/button';
import { useToast } from '~/components/ui/use-toast';
import { OnSuccessUpload, ResourceType, UploadButton } from '~/components/upload-button';
import { cn } from '~/lib/utils';
import { api } from '~/utils/api';

type Props = { contentType: ARUploadContentType; upload: ARUpload | undefined };

export function SingleARUploadActions({ contentType, upload }: Props) {
  const utils = api.useContext();
  const { toast } = useToast();

  const getAR = api.shared.AR.getOrCreate.useQuery();
  const AR = getAR.data;

  const createARUpload = api.shared.ARUpload.create.useMutation({
    onSuccess: async () => {
      toast({
        variant: 'c-primary',
        description: `✔️ ${contentType.replace(/_/g, ' ')} uploaded successfully.`,
      });
      await utils.shared.ARUpload.invalidate();
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: '❌ Internal Server Error',
        description: `Uploading of ${contentType.replace(/_/g, ' ')} failed.`,
      });
    },
  });

  const updateARUpload = api.shared.ARUpload.update.useMutation({
    onSuccess: async () => {
      toast({
        variant: 'c-primary',
        description: `✔️ ${contentType.replace(/_/g, ' ')} uploaded successfully.`,
      });
      await utils.shared.ARUpload.invalidate();
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: '❌ Internal Server Error',
        description: `Uploading of ${contentType.replace(/_/g, ' ')} failed.`,
      });
    },
  });

  const deleteARUpload = api.shared.ARUpload.delete.useMutation({
    onSuccess: async () => {
      toast({
        variant: 'c-primary',
        description: `✔️ ${contentType.replace(/_/g, ' ')} removed successfully.`,
      });
      await utils.shared.ARUpload.invalidate();
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: '❌ Internal Server Error',
        description: `Removal of ${contentType.replace(/_/g, ' ')} failed.`,
      });
    },
  });

  return (
    <>
      <div className="flex items-center gap-2">
        <CustomDialog
          handleContinue={() => deleteARUpload.mutate({ id: upload?.id ?? '' })}
          description="This action cannot be undone. This will permanently delete your upload from our servers."
        >
          <Button
            variant="destructive"
            size="icon"
            className="h-6"
            disabled={
              AR?.status === SemReportStatus.TURNED_IN ||
              AR?.status === SemReportStatus.COMPLETED ||
              !upload?.file
            }
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CustomDialog>

        <UploadButton
          className={cn(buttonVariants({ variant: 'c-secondary', size: 'sm' }), 'h-6')}
          folder="ar-uploads"
          resourceType={ResourceType.PDF}
          onSuccess={
            ((result) => {
              if (!upload) {
                createARUpload.mutate({
                  contentType,
                  contentNumber: 1,
                  file: result.info?.secure_url ?? '',
                  fileId: result.info?.public_id ?? '',
                });

                return;
              }

              updateARUpload.mutate({
                id: upload.id,
                file: result.info?.secure_url,
                fileId: result.info?.public_id,
              });
            }) satisfies OnSuccessUpload
          }
          disabled={
            AR?.status === SemReportStatus.TURNED_IN || AR?.status === SemReportStatus.COMPLETED
          }
        >
          Upload
        </UploadButton>

        {upload?.file ? (
          <Link
            href={upload.file}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'h-6')}
          >
            <Eye className="h-4 w-4" />
          </Link>
        ) : (
          <Button variant="outline" size="icon" className="h-6" disabled>
            <Eye className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div
        className={cn(
          'absolute right-2 top-2 h-8 w-8 rounded-full',
          upload?.file
            ? 'bg-c-primary text-c-primary-foreground'
            : 'bg-destructive text-destructive-foreground'
        )}
      >
        {upload?.file ? <BadgeCheck className="h-8 w-8" /> : <BadgeAlert className="h-8 w-8" />}
      </div>
    </>
  );
}
