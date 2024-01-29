import { type ARUpload, type ARUploadContentType } from '@prisma/client';
import { type inferRouterOutputs } from '@trpc/server';

import { type AppRouter } from '~/server/api/root';

export function parseARUploads(
  uploads:
    | ARUpload[]
    | inferRouterOutputs<AppRouter>['shared']['ARUpload']['get']
    | inferRouterOutputs<AppRouter>['admin']['ARUpload']['get']
) {
  return uploads.reduce(
    (acc, upload) => {
      if (!acc[upload.contentType]) acc[upload.contentType] = [];

      acc[upload.contentType]?.push(upload);
      return acc;
    },
    {} as Partial<Record<ARUploadContentType, ARUpload[]>>
  );
}
