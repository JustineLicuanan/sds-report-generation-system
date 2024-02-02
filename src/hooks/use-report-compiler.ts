import { ARUpload } from '@prisma/client';
import { inferRouterOutputs } from '@trpc/server';
import { PDFDocument } from 'pdf-lib';

import { AppRouter } from '~/server/api/root';
import { parseARUploads } from '~/utils/parse-ar-uploads';
import { uploadHandler } from '~/utils/upload-handler';

export function useReportCompiler() {
  const compileAR = async (
    uploads:
      | ARUpload[]
      | inferRouterOutputs<AppRouter>['shared']['ARUpload']['get']
      | inferRouterOutputs<AppRouter>['admin']['ARUpload']['get']
  ) => {
    const sortedUploads = Object.entries(parseARUploads(uploads));
    const doc = await PDFDocument.create();

    for (const sortedUpload of sortedUploads) {
      // TODO: Front pages

      for (const upload of sortedUpload[1]) {
        const pdfBytes = await fetch(upload.file).then((res) => res.arrayBuffer());
        const loadedPDF = await PDFDocument.load(pdfBytes);
        const contentPages = await doc.copyPages(loadedPDF, loadedPDF.getPageIndices());

        for (const page of contentPages) {
          doc.addPage(page);
        }
      }
    }

    const pdfBytes = await doc.saveAsBase64({ dataUri: true });

    try {
      const response = await uploadHandler({ file: pdfBytes, folder: 'accomplishment-reports' });
      return response;
    } catch (err) {
      throw err;
    }
  };

  return { compileAR };
}
