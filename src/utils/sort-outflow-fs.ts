import { OutflowFS, OutflowFSCategory, OutflowRowFS } from '@prisma/client';
import { inferRouterOutputs } from '@trpc/server';

import { AppRouter } from '~/server/api/root';

const outflowFSCategoryArrayRecord = (Object.keys(OutflowFSCategory) as OutflowFSCategory[]).reduce(
  (acc, key) => {
    acc[key] = [];
    return acc;
  },
  {} as Record<OutflowFSCategory, OutflowFS[]>
);

export function sortOutflowFS(
  outflows:
    | OutflowFS[]
    | inferRouterOutputs<AppRouter>['shared']['outflowFS']['get']
    | inferRouterOutputs<AppRouter>['admin']['outflowFS']['get']
) {
  return outflows.reduce((acc, outflow) => {
    acc[outflow.category].push(outflow);
    return acc;
  }, outflowFSCategoryArrayRecord);
}

export function sortOutflowRowFS(
  rows:
    | OutflowRowFS[]
    | inferRouterOutputs<AppRouter>['shared']['outflowRowFS']['get']
    | inferRouterOutputs<AppRouter>['admin']['outflowRowFS']['get']
) {
  const sortedRows = rows.reduce(
    (acc, row) => {
      acc[row.category].push(row);
      return acc;
    },
    outflowFSCategoryArrayRecord as unknown as Record<OutflowFSCategory, OutflowRowFS[]>
  );

  return Object.entries(sortedRows).filter((row) => row[1].length > 0) as [
    OutflowFSCategory,
    OutflowRowFS[],
  ][];
}
