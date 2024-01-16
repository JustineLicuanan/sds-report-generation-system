import { Printer } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import { CldImage } from 'next-cloudinary';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { meta } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.organization(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function SummaryOfConductedEvents() {
  const router = useRouter();
  const generatedId = router.query.generatedId;

  const getARGenerated = api.shared.generatedAR.get.useQuery({
    where: { id: generatedId as string },
  });
  const generatedAR = getARGenerated.data?.[0];
  const content = generatedAR?.content && JSON.parse(generatedAR.content);

  return (
    <>
      <Head>
        <title>{`Summary of Conducted Events ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>
      <div className="mx-auto my-0 flex max-w-[210mm] flex-col gap-4 ">
        {content?.documents.map((docs: any, idx: any) => (
          <div key={idx} className="flex flex-col gap-2">
            {docs.documentPhoto ? (
              <CldImage
                width="96"
                height="96"
                src={docs.documentPhoto}
                alt="Document Photo Image"
                className="h-60 w-full  object-contain"
              />
            ) : (
              <div className="h-60 w-full border-2 text-center text-3xl">
                Document Photo is empty
              </div>
            )}
            <div className="text-justify">
              {docs.shortDescription ? docs.shortDescription : 'Short description is empty'}
            </div>
            <div className="">{docs.date ? docs.date : 'Date is empty'}</div>
            <div className="">{docs.activity ? docs.activity : 'Activity is empty'}</div>
            <div className="">{docs.location ? docs.location : 'Location is empty'}</div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => window.print()}
          className="fixed bottom-8 right-8 rounded-full bg-yellow p-4 text-6xl active:scale-95 print:hidden"
        >
          <Printer />
        </button>
      </div>
    </>
  );
}
