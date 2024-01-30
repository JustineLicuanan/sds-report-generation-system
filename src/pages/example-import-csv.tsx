import { useState } from 'react';

import { CSVUploadButton, ImportFlowsInputs } from '~/components/csv-upload-button';
import { useToast } from '~/components/ui/use-toast';
import { api } from '~/utils/api';

export default function ExampleImportCSV() {
  const utils = api.useContext();
  const { toast } = useToast();

  const [flowImportData, setFlowImportData] = useState<ImportFlowsInputs>(() => ({
    monthlyId: 'clrzj9iur000l8he0fsbith0r', // Use the router.query.monthlyId as string here
    inflowCollections: [],
    inflowIGPs: [],
    outflows: [],
  }));

  const importFlows = api.shared.monthlyFS.importFlows.useMutation({
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ Month Notes has been imported.' });
      await utils.shared.monthlyFS.invalidate();
      await utils.shared.inflowCollectionFS.invalidate();
      await utils.shared.inflowIgpFS.invalidate();
      await utils.shared.outflowFS.invalidate();
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: '❌ Internal Server Error',
        description: 'Importing of month notes failed.',
      });
    },
  });

  return (
    <>
      <CSVUploadButton className="m-4 p-4" setFlowImportData={setFlowImportData} />

      <button
        className="rounded bg-c-primary px-4 py-2 text-c-primary-foreground hover:bg-c-primary/90"
        onClick={() => importFlows.mutate(flowImportData)}
      >
        Import
      </button>
    </>
  );
}
