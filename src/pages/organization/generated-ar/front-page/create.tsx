import { Printer } from 'lucide-react';
import Head from 'next/head';
import FrontPageAR from '~/components/ar-print/front-page';
import SignatoriesAR from '~/components/ar-print/signatories';
import { meta } from '~/meta';

export default function ARPrint() {
  return (
    <>
      <Head>
        <title>{`Accomplishment Report ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>
      <FrontPageAR />
      <SignatoriesAR />
      <button
        type="button"
        onClick={() => window.print()}
        className="fixed bottom-8 right-8 rounded-full bg-yellow p-4 text-6xl active:scale-95 print:hidden"
      >
        <Printer />
      </button>
    </>
  );
}
