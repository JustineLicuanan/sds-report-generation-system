import { ARUpload, ARUploadContentType, SemReportStatus } from '@prisma/client';
import { ChevronDown, ChevronUp, Download, Eye, FileUp, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { CustomDialog } from '~/components/custom-dialog';
import { Button, buttonVariants } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { useToast } from '~/components/ui/use-toast';
import { OnSuccessUpload, ResourceType, UploadButton } from '~/components/upload-button';
import { api } from '~/utils/api';
import { MoveDirection } from '~/zod-schemas/ar-upload';

type Props = { contentType: ARUploadContentType; upload: ARUpload; isMoveDownDisabled: boolean };

export function ARMultipleUploadsItem({ contentType, upload, isMoveDownDisabled }: Props) {
  const utils = api.useContext();
  const { toast } = useToast();

  const [title, setTitle] = useState(() => upload.title);

  const getOrganization = api.shared.organization.get.useQuery();
  const organization = getOrganization.data;

  const getSemester = api.shared.reportSemester.get.useQuery();
  const semester = getSemester.data;

  const getAR = api.shared.AR.getOrCreate.useQuery();
  const AR = getAR.data;

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

  const moveARUpload = api.shared.ARUpload.move.useMutation({
    onSuccess: async () => {
      toast({
        variant: 'c-primary',
        description: `✔️ ${contentType.replace(/_/g, ' ')} moved successfully.`,
      });
      await utils.shared.ARUpload.invalidate();
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: '❌ Internal Server Error',
        description: `Moving of ${contentType.replace(/_/g, ' ')} failed.`,
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
    <div
      key={upload.id}
      className="flex flex-wrap items-center justify-between gap-2 rounded-sm border border-input px-4 py-2 md:flex-nowrap"
    >
      <div className="flex w-full items-center gap-1">
        <p>{upload.contentNumber}.</p>
        <Input
          placeholder={contentType.replace(/_/g, ' ')}
          value={title}
          onChange={(e) => setTitle(() => e.target.value)}
          disabled={
            AR?.status === SemReportStatus.TURNED_IN || AR?.status === SemReportStatus.COMPLETED
          }
        />
      </div>

      <div className="flex items-center gap-1">
        <TooltipProvider delayDuration={0} disableHoverableContent>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="c-primary"
                size="icon"
                onClick={() => updateARUpload.mutate({ id: upload.id, title })}
                disabled={upload.title === title}
              >
                <Save className="h-4 w-4" />
              </Button>
            </TooltipTrigger>

            <TooltipContent side="top">
              <p>Save</p>
            </TooltipContent>
          </Tooltip>

          <div className="flex flex-col justify-center gap-1">
            <Button
              variant="secondary"
              size="icon"
              className="h-5"
              onClick={() => moveARUpload.mutate({ id: upload.id, direction: MoveDirection.UP })}
              disabled={
                AR?.status === SemReportStatus.TURNED_IN ||
                AR?.status === SemReportStatus.COMPLETED ||
                upload.contentNumber === 1
              }
            >
              <ChevronUp className="h-4 w-4" />
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="h-5"
              onClick={() => moveARUpload.mutate({ id: upload.id, direction: MoveDirection.DOWN })}
              disabled={
                AR?.status === SemReportStatus.TURNED_IN ||
                AR?.status === SemReportStatus.COMPLETED ||
                isMoveDownDisabled
              }
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <UploadButton
                className={buttonVariants({ variant: 'c-secondary', size: 'icon' })}
                folder="ar-uploads"
                resourceType={ResourceType.PDF}
                onSuccess={
                  ((result) => {
                    updateARUpload.mutate({
                      id: upload.id ?? '',
                      file: result.info?.secure_url,
                      fileId: result.info?.public_id,
                    });
                  }) satisfies OnSuccessUpload
                }
                disabled={
                  AR?.status === SemReportStatus.TURNED_IN ||
                  AR?.status === SemReportStatus.COMPLETED
                }
              >
                <FileUp className="h-4 w-4" />
              </UploadButton>
            </TooltipTrigger>

            <TooltipContent side="top">
              <p>Upload</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <CustomDialog
                handleContinue={() => deleteARUpload.mutate({ id: upload.id ?? '' })}
                description="This action cannot be undone. This will permanently delete your upload from our servers."
              >
                <Button
                  variant="destructive"
                  size="icon"
                  disabled={
                    AR?.status === SemReportStatus.TURNED_IN ||
                    AR?.status === SemReportStatus.COMPLETED ||
                    !upload.file
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CustomDialog>
            </TooltipTrigger>

            <TooltipContent side="top">
              <p>Remove</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              {upload.file ? (
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
              {upload.file ? (
                <a
                  href={upload.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: 'outline', size: 'icon' })}
                  download={`${organization?.acronym}_AR_${contentType}_${upload.contentNumber}_${semester?.term}_${semester?.yearStart}-${semester?.yearEnd}`}
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
