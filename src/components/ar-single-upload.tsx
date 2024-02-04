import { ARUpload, ARUploadContentType, SemReportStatus } from '@prisma/client';
import { Download, Eye, FileUp, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { CustomDialog } from '~/components/custom-dialog';
import { Button, buttonVariants } from '~/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { useToast } from '~/components/ui/use-toast';
import { OnSuccessUpload, ResourceType, UploadButton } from '~/components/upload-button';
import { api } from '~/utils/api';

type Props = { contentType: ARUploadContentType; upload: ARUpload | undefined };

export function ARSingleUpload({ contentType, upload }: Props) {
  const utils = api.useContext();
  const { toast } = useToast();

  const getOrganization = api.shared.organization.get.useQuery();
  const organization = getOrganization.data;

  const getSemester = api.shared.reportSemester.get.useQuery();
  const semester = getSemester.data;

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
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-sm px-4 py-2 shadow-[0_1px_4px_0px_rgba(0,0,0,0.50)]">
      <p className="font-semibold">
        {upload?.file ? '✔️' : '❌'} {contentType.replace(/_/g, ' ')}
      </p>

      <div className="flex items-center gap-1">
        <TooltipProvider delayDuration={0} disableHoverableContent>
          <Tooltip>
            <UploadButton
              className={buttonVariants({ variant: 'c-secondary', size: 'icon' })}
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
                    id: upload?.id ?? '',
                    file: result.info?.secure_url,
                    fileId: result.info?.public_id,
                  });
                }) satisfies OnSuccessUpload
              }
              disabled={
                AR?.status === SemReportStatus.TURNED_IN || AR?.status === SemReportStatus.COMPLETED
              }
            >
              <TooltipTrigger asChild>
                <FileUp className="h-4 w-4" />
              </TooltipTrigger>
            </UploadButton>

            <TooltipContent side="top">
              <p>Upload</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <CustomDialog
              handleContinue={() => deleteARUpload.mutate({ id: upload?.id ?? '' })}
              description="This action cannot be undone. This will permanently delete your upload from our servers."
            >
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  disabled={
                    AR?.status === SemReportStatus.TURNED_IN ||
                    AR?.status === SemReportStatus.COMPLETED ||
                    !upload?.file
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
            </CustomDialog>

            <TooltipContent side="top">
              <p>Remove</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              {upload?.file ? (
                <Link
                  href={upload.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: 'outline', size: 'icon' })}
                >
                  <Eye className="h-4 w-4" />
                </Link>
              ) : (
                <Button variant="outline" size="icon" disabled>
                  <Eye className="h-4 w-4" />
                </Button>
              )}
            </TooltipTrigger>

            <TooltipContent side="top">
              <p>Preview</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              {upload?.file ? (
                <a
                  href={upload.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: 'outline', size: 'icon' })}
                  download={`${organization?.acronym}_AR_${contentType}_${semester?.term}_${semester?.yearStart}-${semester?.yearEnd}`}
                >
                  <Download className="h-4 w-4" />
                </a>
              ) : (
                <Button variant="outline" size="icon" disabled>
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </TooltipTrigger>

            <TooltipContent side="top">
              <p>Download</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
