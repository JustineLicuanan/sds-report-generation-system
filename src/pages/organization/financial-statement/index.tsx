import { zodResolver } from '@hookform/resolvers/zod';
import { SemReportStatus } from '@prisma/client';
import { Download, Eye, Trash2 } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CustomDialog } from '~/components/custom-dialog';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
import { Button, buttonVariants } from '~/components/ui/button';
import { useToast } from '~/components/ui/use-toast';
import { OnSuccessUpload, ResourceType, UploadButton } from '~/components/upload-button';
import { cn } from '~/lib/utils';
import { meta, paths } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';
import { getMonthName } from '~/utils/get-month-name';
import { schemas } from '~/zod-schemas';

type UpdateFSInputs = z.infer<typeof schemas.shared.FS.update>;

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.organization(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function FinancialStatementPage() {
  const router = useRouter();
  const utils = api.useContext();
  const { toast } = useToast();

  const getOrganization = api.shared.organization.get.useQuery();
  const organization = getOrganization.data;

  const getSemester = api.shared.reportSemester.get.useQuery();
  const semester = getSemester.data;

  const getFinancialStatementQuery = api.shared.FS.getOrCreate.useQuery();
  const FS = getFinancialStatementQuery?.data;

  const getFSMonthQuery = api.shared.monthlyFS.get.useQuery();
  const FSMonth = getFSMonthQuery?.data;

  const statusTextColor =
    FS?.status === SemReportStatus.DRAFT || FS?.status === SemReportStatus.TURNED_IN
      ? 'text-c-secondary'
      : FS?.status === SemReportStatus.COMPLETED
      ? 'text-c-primary'
      : FS?.status === SemReportStatus.FOR_REVISION
      ? 'text-destructive'
      : '';

  const updateFSForm = useForm<UpdateFSInputs>({
    resolver: zodResolver(schemas.shared.FS.update),
    // These values are for the initial data of input fields, mostly used for 'edit/update' forms like this one
    values: { actualCash: FS?.actualCash.toString() },
  });

  const updateFS = api.shared.FS.update.useMutation({
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ FS updated successfully.' });
      await utils.shared.FS.invalidate();
    },
  });

  const turnInFS = api.shared.FS.turnIn.useMutation({
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ FS has been turned in.' });
      await utils.shared.FS.invalidate();
    },
  });

  const cancelFS = api.shared.FS.cancel.useMutation({
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ FS has been cancelled.' });
      await utils.shared.FS.invalidate();
    },
  });

  // const deleteMonthlyFS = api.shared.monthlyFS.delete.useMutation({
  //   onSuccess: async () => {
  //     toast({ variant: 'c-primary', description: '✔️ Month deleted successfully.' });
  //     await utils.shared.monthlyFS.invalidate();
  //   },
  // });

  return (
    <>
      <Head>
        <title>{`Financial Statement ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />

      <main className="flex">
        {/* SIDE BAR*/}
        <OrganizationSideBarMenu />
        <div id="main-content" className="mx-4 my-4  w-full  gap-8">
          <div className="mb-4 text-center text-4xl font-bold">
            Financial Statement &ndash;{' '}
            <span className={statusTextColor}>{FS?.status.replace(/_/g, ' ')}</span>
          </div>

          <div className="grid grid-cols-4 grid-rows-2 gap-4">
            <div className="col-span-2 row-span-1 flex flex-col items-center justify-center gap-2 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
              <div className="text-lg font-bold">Submit a Financial Statement</div>
              <div className="text-center font-medium">
                Submit a concise financial statement that provides a brief overview of the
                organization&apos;s financial status and transactions.
              </div>
              <div className="flex gap-2">
                <CustomDialog
                  handleContinue={() => updateFS.mutate({ compiled: null, compiledId: null })}
                  emoji="🚨"
                  description="This action cannot be undone. This will permanently delete your generated financial statement from our servers."
                >
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-auto"
                    disabled={
                      FS?.status === SemReportStatus.TURNED_IN ||
                      FS?.status === SemReportStatus.COMPLETED ||
                      !FS?.compiled
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CustomDialog>

                <UploadButton
                  className={cn(buttonVariants({ variant: 'c-secondary', size: 'sm' }), 'h-auto')}
                  folder="financial-statements"
                  resourceType={ResourceType.PDF}
                  onSuccess={
                    ((result) => {
                      updateFS.mutate({
                        compiled: result.info?.secure_url,
                        compiledId: result.info?.public_id,
                      });
                    }) satisfies OnSuccessUpload
                  }
                  disabled={
                    FS?.status === SemReportStatus.TURNED_IN ||
                    FS?.status === SemReportStatus.COMPLETED
                  }
                >
                  Upload
                </UploadButton>

                {FS?.status !== SemReportStatus.TURNED_IN ? (
                  <Button
                    type="button"
                    variant="c-primary"
                    size="sm"
                    className="h-auto"
                    onClick={() => turnInFS.mutate()}
                    disabled={!FS?.compiled || FS?.status === SemReportStatus.COMPLETED}
                  >
                    Turn in
                  </Button>
                ) : (
                  <CustomDialog
                    handleContinue={() => cancelFS.mutate()}
                    description="This action will cancel your financial statement submission."
                  >
                    <Button type="button" variant="destructive" size="sm" className="h-auto">
                      Cancel
                    </Button>
                  </CustomDialog>
                )}

                {FS?.compiled ? (
                  <Link
                    href={FS.compiled}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'h-auto')}
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                ) : (
                  <Button variant="outline" size="icon" className="h-auto" disabled>
                    <Eye className="h-4 w-4" />
                  </Button>
                )}

                {FS?.compiled ? (
                  <a
                    href={FS.compiled}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'h-auto')}
                    download={`${organization?.acronym}_FS_${semester?.term}_${semester?.yearStart}-${semester?.yearEnd}`}
                  >
                    <Download className="h-4 w-4" />
                  </a>
                ) : (
                  <Button variant="outline" size="icon" className="h-auto" disabled>
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="col-span-2 row-span-1 flex flex-col gap-2 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
              <div className="text-center text-lg font-bold">Organization and School Positions</div>
              <div className="flex flex-col items-center gap-2">
                <div className="font-medium">
                  Regularly update and organize your financial records for efficient analysis.
                </div>
                <button
                  type="button"
                  onClick={() => router.push(`${paths.ORGANIZATION}${paths.MY_ORGANIZATION}`)}
                  className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                >
                  Go to my organization
                </button>
              </div>
            </div>

            <div className="col-span-2 row-span-1 flex flex-col items-center justify-center gap-2 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
              <div className="text-lg font-bold">Generate Financial Statement</div>
              <div className="text-center font-medium">
                Generate Financial Statement for this semester
              </div>
              <div className="flex gap-2">
                <Link
                  href={`${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}${paths.PRINT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                >
                  Generate
                </Link>
              </div>
            </div>

            <div className="col-span-2 row-span-1 flex flex-col items-center justify-center  gap-2 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
              <div className="text-lg font-bold">Actual Cash</div>
              <div className="text-center font-medium">Input the Actual Cash in this semester.</div>
              <form
                className="flex gap-4"
                onSubmit={updateFSForm.handleSubmit(
                  (values) => {
                    if (updateFS.isLoading) return;

                    updateFS.mutate(values);
                  },
                  (err) => console.error(err)
                )}
              >
                <input
                  type="number"
                  id="actual-cash"
                  className="rounded-sm border border-input"
                  {...updateFSForm.register('actualCash')}
                />
                <button
                  type="submit"
                  className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                >
                  Set
                </button>
              </form>
              <p className="h-4 text-sm font-medium text-destructive">
                {updateFSForm.formState.errors.actualCash?.message}
              </p>
            </div>
          </div>
          <div className="mx-auto mt-4 min-h-[40vh] rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="mb-4 text-center text-2xl font-bold">
              {semester?.term} SEMESTER {semester?.yearStart} - {semester?.yearEnd}
            </div>
            <button
              type="button"
              className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              onClick={() =>
                router.push(
                  `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}${paths.ADD_NEW_MONTH}`
                )
              }
            >
              Add new month
            </button>
            {FSMonth?.map((month) => (
              <div
                key={month.id}
                className="border-sm my-2 flex items-center justify-between gap-2 border border-input"
              >
                <div className="flex w-full items-center justify-between gap-2 p-2">
                  <div className="text-lg font-bold">Month of {getMonthName(month.month)}</div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
                      onClick={() => {
                        router.push(
                          `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}${paths.MONTHLY}/${month.id}`
                        );
                      }}
                    >
                      Modify
                    </button>

                    {/* <CustomDialog
                      handleContinue={() => deleteMonthlyFS.mutate({ id: month.id })}
                      description="This action cannot be undone. This will permanently delete the monthly statement from our servers."
                    >
                      <button
                        type="button"
                        className="rounded-sm border border-destructive bg-destructive px-3 text-destructive-foreground active:scale-95"
                      >
                        Delete
                      </button>
                    </CustomDialog> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
