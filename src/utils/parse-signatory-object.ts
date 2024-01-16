import { ReportSignatory } from '@prisma/client';

export function parseSignatoryObject(signatories: ReportSignatory[]) {
  return signatories.reduce(
    (acc, key) => {
      acc[key.position] = key.name;
      return acc;
    },
    {} as Record<string, string>
  );
}
