import { zodResolver } from '@hookform/resolvers/zod';
import { ARUpload, ARUploadContentType, SemReportStatus } from '@prisma/client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ARMultipleUploadsItem } from '~/components/ar-multiple-uploads-item';
import { Button, buttonVariants } from '~/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { Input } from '~/components/ui/input';
import { Separator } from '~/components/ui/separator';
import { useToast } from '~/components/ui/use-toast';
import { OnSuccessUpload, ResourceType, UploadButton } from '~/components/upload-button';
import { cn } from '~/lib/utils';
import { api } from '~/utils/api';
import { schemas } from '~/zod-schemas';

type Props = { contentType: ARUploadContentType; uploads: ARUpload[] };
type AddUploadInputs = z.infer<typeof schemas.shared.ARUpload.create>;

export function ARMultipleUploads({ contentType, uploads }: Props) {
  const utils = api.useContext();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);

  const getOrganization = api.shared.organization.get.useQuery();
  const organization = getOrganization.data;

  const getSemester = api.shared.reportSemester.get.useQuery();
  const semester = getSemester.data;

  const getAR = api.shared.AR.getOrCreate.useQuery();
  const AR = getAR.data;

  const addUploadForm = useForm<AddUploadInputs>({
    resolver: zodResolver(schemas.shared.ARUpload.create),
    defaultValues: { contentType },
  });

  const createARUpload = api.shared.ARUpload.create.useMutation({
    onSuccess: async () => {
      toast({
        variant: 'c-primary',
        description: `✔️ ${contentType.replace(/_/g, ' ')} uploaded successfully.`,
      });
      addUploadForm.reset(undefined, { keepDefaultValues: true });
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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-sm px-4 py-2 shadow-[0_1px_4px_0px_rgba(0,0,0,0.50)]">
        <p className="font-semibold">
          {uploads.length > 0 ? '✔️' : '❌'} {contentType.replace(/_/g, ' ')}
        </p>

        <CollapsibleTrigger asChild>
          <Button>{isOpen ? 'Hide' : 'Show'} Uploads</Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent
        className={cn(
          'flex flex-col justify-center gap-2 px-4 py-2 shadow-[0_4px_10px_0px_rgba(0,0,0,0.20)]',
          !isOpen && 'hidden'
        )}
      >
        <form
          className="flex flex-col justify-center gap-2"
          onSubmit={addUploadForm.handleSubmit(
            (values) => {
              if (createARUpload.isLoading) return;

              createARUpload.mutate({ ...values, contentNumber: uploads.length + 1 });
            },
            (err) => console.error(err)
          )}
        >
          <div className="flex items-center gap-2">
            <Input
              placeholder="Title"
              {...addUploadForm.register('title')}
              disabled={
                AR?.status === SemReportStatus.TURNED_IN || AR?.status === SemReportStatus.COMPLETED
              }
            />

            <UploadButton
              className={buttonVariants({ variant: 'c-secondary' })}
              folder="ar-uploads"
              resourceType={ResourceType.PDF}
              onSuccess={
                ((result) => {
                  addUploadForm.setValue('file', result.info?.secure_url ?? '');
                  addUploadForm.setValue('fileId', result.info?.public_id ?? '');
                }) satisfies OnSuccessUpload
              }
              disabled={
                AR?.status === SemReportStatus.TURNED_IN || AR?.status === SemReportStatus.COMPLETED
              }
            >
              {addUploadForm.watch('file') ? '✔️' : '❌'} Upload a File
            </UploadButton>
          </div>

          <Button
            type="submit"
            variant="c-primary"
            disabled={
              AR?.status === SemReportStatus.TURNED_IN || AR?.status === SemReportStatus.COMPLETED
            }
          >
            Add a new {contentType.replace(/_/g, ' ').toLowerCase()}
          </Button>
        </form>

        <Separator />

        {uploads.length > 0 ? (
          uploads.map((upload) => (
            <ARMultipleUploadsItem
              key={upload.id}
              contentType={contentType}
              upload={upload}
              isMoveDownDisabled={upload.contentNumber === uploads.length}
            />
          ))
        ) : (
          <p className="px-4 py-2 text-center text-muted-foreground">No uploads</p>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
