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
  const { ARGeneratedId } = router.query;

  const getARGenerated = api.shared.ARGenerated.get.useQuery({
    where: { id: ARGeneratedId as string },
  });
  const ARGenerated = getARGenerated.data?.[0];
  const contentString = ARGenerated?.content;
  const contentObject = contentString ? JSON.parse(contentString) : null;

  // This is for AR auto creation when there's an active semester
  api.shared.AR.getOrCreate.useQuery();

  return (
    <>
      <Head>
        <title>{`Summary of Conducted Events ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>
      <div className="mx-auto my-0 flex max-w-[210mm] flex-col ">
        {contentObject?.documents.map((docs, idx) => (
          <div key={idx}>
            <CldImage
              width="96"
              height="96"
              src={`/${docs.documentPhoto}`}
              alt="Document Photo Image"
              className="h-60 w-full border-2"
            />
            <div className="text-justify">{docs.shortDescription}</div>
            <div className="">{docs.activity}</div>
            <div className="">{docs.location}</div>
          </div>
        ))}
      </div>
    </>
  );
}
