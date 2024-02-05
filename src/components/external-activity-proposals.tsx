import { Download, Eye } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button, buttonVariants } from '~/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { cn } from '~/lib/utils';
import { api } from '~/utils/api';
import { externalAPI, getSDSSchedulerDocument } from '~/utils/external-api';

export function ExternalActivityProposals() {
  const contentType = 'EXTERNAL_APPROVED_ACTIVITY_PROPOSALS';
  const [isOpen, setIsOpen] = useState(false);

  const getOrganization = api.shared.organization.get.useQuery();
  const organization = getOrganization.data;

  const getSemester = api.shared.reportSemester.get.useQuery();
  const semester = getSemester.data;

  const getExternalActivityProposals = externalAPI.shared.activityProposal.get.useQuery();
  const uploads = getExternalActivityProposals.data;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div
        id={contentType}
        className="flex flex-wrap items-center justify-between gap-2 rounded-sm px-4 py-2 shadow-[0_1px_4px_0px_rgba(0,0,0,0.50)]"
      >
        <p className="font-semibold">
          {(uploads ?? []).length > 0 ? '✔️' : '❌'} {contentType.replace(/_/g, ' ')}
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
        {(uploads ?? []).length > 0 ? (
          uploads?.map((upload, idx) => (
            <div
              key={upload.Proposal_ID}
              className="flex flex-wrap items-center justify-between gap-2 rounded-sm border border-input px-4 py-2 md:flex-nowrap"
            >
              <div className="flex w-full items-center gap-1">
                <p>
                  {idx + 1}. {upload.Event_Title}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <TooltipProvider delayDuration={0} disableHoverableContent>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {upload.Details ? (
                        <Link
                          href={getSDSSchedulerDocument(upload.Details)}
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
                      {upload.Details ? (
                        <a
                          href={getSDSSchedulerDocument(upload.Details)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={buttonVariants({ variant: 'outline', size: 'icon' })}
                          download={`${organization?.acronym}_AR_${contentType}_${
                            idx + 1
                          }_${semester?.term}_${semester?.yearStart}-${semester?.yearEnd}`}
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
          ))
        ) : (
          <p className="px-4 py-2 text-center text-muted-foreground">No uploads</p>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
