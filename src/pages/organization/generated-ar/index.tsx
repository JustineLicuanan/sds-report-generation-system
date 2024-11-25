import { GeneratedARTemplate } from '@prisma/client';
import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { CustomDialog } from '~/components/custom-dialog';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
import { useToast } from '~/components/ui/use-toast';
import { meta, paths } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';
import { enumToSlug } from '~/utils/enum-to-slug';
import { OrderBy } from '~/zod-schemas/utils';

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
  const utils = api.useContext();
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const files = Object.values(GeneratedARTemplate)
    .filter(
      (template) =>
        !['CALENDAR_OF_ACTIVITIES', 'INVITATION_LETTER', 'REQUEST_LETTER'].includes(template)
    )
    .map((template) => ({
      filePath: `/${enumToSlug(template)}`,
      title: template.replace(/_/g, ' '),
    }));

  const [templateName, setTemplateName] = useState('');

  const getGeneratedARQuery = api.shared.generatedAR.get.useQuery({
    orderBy: { createdAt: OrderBy.DESC },
  });
  const generatedAR = getGeneratedARQuery?.data;

  const deleteGeneratedAR = api.shared.generatedAR.delete.useMutation({
    onSuccess: async () => {
      toast({
        variant: 'c-primary',
        description: `✔️ Generated content has been deleted.`,
      });
      await utils.shared.generatedAR.invalidate();
    },

    onError: () => {
      toast({
        variant: 'destructive',
        title: '❌ Internal Server Error',
        description: `Deletion of generated content failed.`,
      });
    },
  });

  const totalPages = Math.ceil(files.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleGeneratedAR = generatedAR?.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <Head>
        <title>{`Report Templates ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />

      <main className="flex">
        {/* SIDE BAR*/}
        <OrganizationSideBarMenu />
        <div id="main-content" className="mx-4 my-4  w-full  gap-8">
          <div className="flex flex-col gap-2">
            <div className="text-4xl font-bold">Accomplishment Report Templates</div>
          </div>
          <div className="my-2 mt-8 flex  items-center justify-around gap-4">
            <div className="flex  items-center gap-4">
              <select
                className='className="border-sm relative flex items-center justify-between  gap-4 border border-input bg-transparent px-4 py-2'
                onChange={(e) => setTemplateName(e.target.value)}
                value={templateName}
              >
                <option value="" className="">
                  Select a template
                </option>
                {files.map((file, index) => (
                  <option key={index} value={file.title} className="">
                    {file.title === 'cbl' ? 'Constitutional and By-Laws' : file.title}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `${paths.ORGANIZATION}${paths.GENERATED_AR}/${enumToSlug(
                      templateName.replace(/ /g, '_')
                    )}${paths.CREATE}`
                  )
                }
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Generate
              </button>
            </div>

            <div className="flex  items-center gap-4">
              <div className="">Signatory Information:</div>
              <Link
                href={`${paths.ORGANIZATION}${paths.MY_ORGANIZATION}${paths.POSITIONS}`}
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Setup
              </Link>
            </div>
          </div>
          <div className="mt-8">
            {visibleGeneratedAR?.map((generated, index) => (
              <div
                key={index}
                className="border-sm relative my-2 flex items-center justify-between gap-4 border border-input px-4 py-2"
              >
                <div className="w-1/2 text-center">
                  <div className="text-2xl font-bold capitalize">
                    {generated.template === 'CBL'
                      ? 'Constitutional and By-Laws'
                      : generated.template.replace(/_/g, ' ').toLowerCase()}
                  </div>
                  <div className="font-medium">
                    Generated on {generated.createdAt.toISOString().split('T')[0]}
                  </div>
                </div>

                <div className="flex w-1/2 flex-col gap-2">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`${paths.ORGANIZATION}${paths.GENERATED_AR}/${enumToSlug(
                        generated.template
                      )}/${generated.id}${paths.EDIT}`}
                      className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                    >
                      View
                    </Link>

                    <CustomDialog
                      handleContinue={() => deleteGeneratedAR.mutate({ id: generated.id })}
                      description="This action cannot be undone. This will permanently delete your generated content from our servers."
                    >
                      <button
                        type="button"
                        className="rounded-sm bg-destructive px-3 text-destructive-foreground active:scale-95"
                      >
                        Delete
                      </button>
                    </CustomDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="my-4 flex justify-center gap-2">
            {visibleGeneratedAR?.length === 0 ? (
              <div className="flex flex-col items-center justify-center">
                <div className="text-2xl">There are no templated reports.</div>
                <Image
                  src="/no_ar_templates.svg"
                  alt="No AR Templates"
                  height={100}
                  width={100}
                  className="h-48 w-48"
                />
              </div>
            ) : (visibleGeneratedAR?.length ?? 0) >= 8 ? (
              Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`${
                    currentPage === index + 1 ? 'bg-yellow' : ''
                  } border border-input px-2 py-1`}
                >
                  {index + 1}
                </button>
              ))
            ) : (
              ''
            )}
          </div>
        </div>
      </main>
    </>
  );
}
