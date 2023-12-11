import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
import PdfViewer from '~/components/pdf-viewer';
import { OnSuccessUpload, ResourceType, UploadButton } from '~/components/upload-button';
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

export default function MemberPage() {
  const utils = api.useContext();

  const getOrgQuery = api.shared.organization.get.useQuery();
  const org = getOrgQuery?.data;

  const [file, setFile] = useState({ cbl: '', cblId: '' });
  const [fileName, setFileName] = useState('' as string | undefined);
  const onSuccessUpload: OnSuccessUpload = (result) => {
    setFile(() => ({ cbl: result.info?.secure_url ?? '', cblId: result.info?.public_id ?? '' }));
    // setFileName(result.info?.);
    setFileName(result.info?.original_filename);
  };

  const uploadCBLMutation = api.shared.organization.uploadCbl.useMutation({
    onSuccess: async () => {
      await utils.shared.organization.invalidate();
    },
  });
  return (
    <>
      <Head>
        <title>{`CBL ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />

      <main className="flex">
        {/* SIDE BAR*/}
        <OrganizationSideBarMenu />

        <div className="mx-3 my-4 w-full">
          <div className="mx-auto my-0 min-h-[87vh] max-w-5xl rounded-3xl px-5 py-5 shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)] md:px-9">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">CBL</h1>
            <div className="my-4">
              {org?.cbl ? (
                <div className="mt-1 flex h-[50vh] w-full items-center justify-center border-[5px] border-green text-4xl">
                  <PdfViewer pdf={org.cbl} />
                </div>
              ) : (
                <div className="text-center text-xl font-medium  md:text-2xl lg:text-3xl">
                  You haven't uploaded your CBL yet.
                </div>
              )}
            </div>
            <div className="item-center flex justify-end gap-2">
              <div className="flex items-center gap-2">
                {file.cbl ? <div>{fileName}</div> : <div></div>}
                <UploadButton
                  className="my-3 cursor-pointer rounded-md  bg-yellow px-8 py-2 text-lg font-medium"
                  folder="cbl-docs"
                  resourceType={ResourceType.PDF}
                  onSuccess={onSuccessUpload}
                >
                  Upload
                </UploadButton>
              </div>
              <button
                type="button"
                className="my-3 cursor-pointer rounded-md  bg-yellow px-8 py-2 text-lg font-medium"
                onClick={async () => {
                  await uploadCBLMutation.mutateAsync(file);
                }}
              >
                Apply CBL
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
