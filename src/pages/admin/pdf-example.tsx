import { Viewer, Worker } from '@react-pdf-viewer/core';

import '@react-pdf-viewer/core/lib/styles/index.css';

export default function PDFExample() {
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <div className='h-[200px] w-1/2'>
        <Viewer fileUrl="/asd.pdf" />
      </div>
    </Worker>
  );
}
