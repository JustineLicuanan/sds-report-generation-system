import { PDFDocument } from 'pdf-lib';

import { uploadHandler } from '~/utils/upload-handler';

type Props = { pdfLinks: string[]; folder: 'accomplishment-reports' | 'financial-statements' };

export async function mergePDF({ pdfLinks, folder }: Props) {
  const doc = await PDFDocument.create();

  for (const link of pdfLinks) {
    const pdfBytes = await fetch(link).then((res) => res.arrayBuffer());
    const loadedPDF = await PDFDocument.load(pdfBytes);
    const contentPages = await doc.copyPages(loadedPDF, loadedPDF.getPageIndices());

    for (const page of contentPages) {
      doc.addPage(page);
    }
  }

  const pdfBytes = await doc.saveAsBase64({ dataUri: true });

  try {
    const response = await uploadHandler({ file: pdfBytes, folder });
    return response;
  } catch (err) {
    throw err;
  }
}
