import { GeneratedARTemplate } from '@prisma/client';
import { ChevronDown, ChevronUp, Eye, X } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { CustomDialog } from '~/components/custom-dialog';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
import { meta, paths } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { authRedirects } from '~/utils/auth-redirects';
import { enumToSlug } from '~/utils/enum-to-slug';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.organization(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function AccomplishmentReportTemplatePage() {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);

  const files = Object.values(GeneratedARTemplate)
    .filter(
      (template) => !['EXCUSE_LETTER', 'INVITATION_LETTER', 'REQUEST_LETTER'].includes(template)
    )
    .map((template) => ({
      filePath: `/${enumToSlug(template)}`,
      title: template.replace(/_/g, ' '),
    }));

  return (
    <>
      <Head>
        <title>{`Accomplishment Report ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />

      <main className="flex">
        {/* SIDE BAR*/}
        <OrganizationSideBarMenu />
        <div id="main-content" className="mx-4 my-4  w-full  gap-8">
          <div className="flex flex-col gap-2">
            <div className="text-4xl font-bold">Generate Accomplishment Report</div>
          </div>
          <div className="border-sm mx-auto my-0 mt-8 flex max-w-screen-lg items-center justify-between p-4 shadow-[0_1px_4px_0px_rgba(0,0,0,0.50)]">
            <div className="font-bold">Generate your compiled AR</div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() =>
                  router.push(`${paths.ORGANIZATION}${paths.GENERATED_AR}${paths.PRINT}`)
                }
                className="rounded-sm bg-yellow p-1 active:scale-95"
              >
                Compile
              </button>
              <button type="button" className="rounded-sm bg-yellow p-1 active:scale-95">
                Download
              </button>
            </div>
          </div>

          <div className="mx-auto my-0 mt-8 max-w-screen-lg">
            {files
              .filter(
                (file) => !(file.title === 'ACTIVITY PROPOSAL' || file.title === 'RESOLUTION')
              )
              .map((file, index) => (
                <div
                  key={index}
                  className="relative my-1 flex items-center justify-between rounded-sm px-8 py-2 shadow-[0_1px_4px_0px_rgba(0,0,0,0.50)]"
                >
                  <div className="text-lg font-bold">{file.title}</div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      className="rounded-sm bg-red p-1 text-white opacity-50 active:scale-95"
                    >
                      <X />
                    </button>
                    <button type="button" className="rounded-sm bg-yellow p-1 active:scale-95">
                      Upload
                    </button>
                    <button
                      type="button"
                      className="rounded-sm bg-green p-1 text-white opacity-50 active:scale-95"
                    >
                      <Eye />
                    </button>
                  </div>
                  <div className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red"></div>
                </div>
              ))}
            {files
              .filter((file) => file.title === 'ACTIVITY PROPOSAL' || file.title === 'RESOLUTION')
              .map((file, index) => (
                <div className="relative my-1 ">
                  <div className="flex items-center justify-between rounded-sm px-8 py-2 shadow-[0_1px_4px_0px_rgba(0,0,0,0.50)]">
                    <div className="text-lg font-bold">{file.title}</div>
                    <div className="flex gap-4">
                      <CustomDialog
                        description="Are you sure you want to delete?"
                        handleContinue={() => setIsActive(!isActive)}
                      >
                        <button
                          type="button"
                          className="rounded-sm bg-red p-1 text-white opacity-50 active:scale-95"
                        >
                          <X />
                        </button>
                      </CustomDialog>
                      <button type="button" className="rounded-sm bg-yellow p-1 active:scale-95">
                        Upload
                      </button>
                      <button
                        type="button"
                        className="rounded-sm bg-green p-1 text-white opacity-50 active:scale-95"
                        onClick={() => setIsActive(!isActive)}
                      >
                        <Eye />
                      </button>
                    </div>
                  </div>
                  {isActive && (
                    <div className="flex flex-col gap-2 px-4 py-2 shadow-[0_4px_10px_0px_rgba(0,0,0,0.20)]">
                      <div className="flex items-center justify-between gap-4 rounded-sm border border-input px-2 py-1">
                        <div className="font-bold">Resolution Title</div>
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            className="flex h-4 w-8 items-center justify-center rounded-sm bg-gray active:scale-95"
                          >
                            <ChevronUp />
                          </button>
                          <button
                            type="button"
                            className="flex h-4 w-8 items-center justify-center rounded-sm bg-gray active:scale-95"
                          >
                            <ChevronDown />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4 rounded-sm border border-input px-2 py-1">
                        <div className="font-bold">Resolution Title</div>
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            className="flex h-4 w-8 items-center justify-center rounded-sm bg-gray active:scale-95"
                          >
                            <ChevronUp />
                          </button>
                          <button
                            type="button"
                            className="flex h-4 w-8 items-center justify-center rounded-sm bg-gray active:scale-95"
                          >
                            <ChevronDown />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red"></div>
                </div>
              ))}
          </div>
        </div>
      </main>
    </>
  );
}
