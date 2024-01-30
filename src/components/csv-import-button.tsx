import { useEffect, useRef } from 'react';
import { usePapaParse } from 'react-papaparse';
import { z } from 'zod';

import { Input } from '~/components/ui/input';
import { schemas } from '~/zod-schemas';
import { InflowCategory } from '~/zod-schemas/monthly-fs';

export type ImportFlowsInputs = z.infer<typeof schemas.shared.monthlyFS.importFlows>;

type Props = {
  setFlowImportData: React.Dispatch<React.SetStateAction<ImportFlowsInputs>>;
  className?: string;
};

export function CSVImportButton({ setFlowImportData, className }: Props) {
  const reader = useRef<FileReader>();
  const { readString } = usePapaParse();

  useEffect(() => {
    if (!reader.current) {
      reader.current = new FileReader();
      reader.current.onload = async (e) => {
        const CSVs = (e.target?.result as string)?.split('\r\n,,,,,,,\r\n,,,,,,,\r\n');
        const importFlowsInputs = {} as ImportFlowsInputs;

        for (const csv of CSVs) {
          await new Promise((resolve) => {
            readString(csv, {
              worker: true,
              header: true,
              complete: (results) => {
                if (
                  (results.data as { category: InflowCategory }[])[0]?.category ===
                  InflowCategory.COLLECTION
                ) {
                  importFlowsInputs.inflowCollections =
                    results.data as ImportFlowsInputs['inflowCollections'];
                } else if (
                  (results.data as { category: InflowCategory }[])[0]?.category ===
                  InflowCategory.IGP
                ) {
                  importFlowsInputs.inflowIGPs = results.data as ImportFlowsInputs['inflowIGPs'];
                } else {
                  importFlowsInputs.outflows = results.data as ImportFlowsInputs['outflows'];
                }

                resolve(undefined);
              },
            });
          });
        }

        setFlowImportData((prevState) => ({ ...prevState, ...importFlowsInputs }));
      };
    }
  }, []);

  return (
    <Input
      type="file"
      accept="text/csv, .csv, application/vnd.ms-excel"
      className={className}
      onChange={(e) => e.target.files?.[0] && reader.current?.readAsText(e.target.files[0])}
    />
  );
}
