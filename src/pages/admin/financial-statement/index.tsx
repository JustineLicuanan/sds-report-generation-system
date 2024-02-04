import { SemReportStatus } from '@prisma/client';
import { Download, Eye, FileCheck2, FileX2 } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminNavbar from '~/components/admin-navigation-bar';
import AdminSidebar from '~/components/admin-side-bar-menu';
import { useToast } from '~/components/ui/use-toast';
import { meta } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.admin(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function AdminFinancialStatementPage() {
  const router = useRouter();
  const utils = api.useContext();
  const { toast } = useToast();

  const getFSs = api.admin.FS.get.useQuery({ current: true, include: { organization: true } });
  const FSs = getFSs?.data;

  const turnedInFSs = getFSs.data?.filter((FS) => FS.status === SemReportStatus.TURNED_IN);
  const completedFSs = getFSs.data?.filter((FS) => FS.status === SemReportStatus.COMPLETED);

  const updateFSStatus = api.admin.FS.updateStatus.useMutation(); // TODO: Lagyan onSuccess

  const statusTextColor = FSs?.map((FS, idx) => {
    return FS?.status === SemReportStatus.DRAFT || FS?.status === SemReportStatus.TURNED_IN
      ? 'text-c-secondary'
      : FS?.status === SemReportStatus.COMPLETED
      ? 'text-c-primary'
      : FS?.status === SemReportStatus.FOR_REVISION
      ? 'text-destructive'
      : '';
  });

  return (
    <>
      <Head>
        <title>{`Financial Statement ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <AdminNavbar />

      <main className="flex">
        {/* SIDE BAR*/}
        <AdminSidebar />
        <div id="main-content" className="mx-4 my-4  w-full  gap-8">
          <div className="flex flex-col gap-2">
            <div className="text-4xl font-bold">Financial Statements</div>
          </div>
          <div className="mt-8">
            {(turnedInFSs ?? []).length > 0 ? (
              turnedInFSs?.map((FS, FSIdx) => (
                <div
                  key={FSIdx}
                  className="flex w-full justify-between rounded-sm border border-input px-4 py-4"
                >
                  <div className="text-xl font-bold">{FS?.organization.name}</div>
                  <div className="item-center flex gap-8">
                    <div className="item-center flex gap-16">
                      <div className={`${statusTextColor} text-lg font-bold`}>
                        {FS.status.replace(/_/g, ' ')}
                      </div>
                      <div className="item-center flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            updateFSStatus.mutate({
                              id: FS.id,
                              status: SemReportStatus.FOR_REVISION,
                            });
                            toast({
                              variant: 'c-primary',
                              description: '✔️ Status has been updated.',
                            });
                          }}
                          className="rounded-sm bg-red p-1 text-white active:scale-95"
                        >
                          <FileX2 />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            updateFSStatus.mutate({ id: FS.id, status: SemReportStatus.COMPLETED });
                            toast({
                              variant: 'c-primary',
                              description: '✔️ Status has been updated.',
                            });
                          }}
                          className="rounded-sm bg-green p-1 text-white active:scale-95"
                        >
                          <FileCheck2 />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => window.open(`${FS.compiled}`, '_blank')}
                        className="rounded-sm bg-yellow p-1 active:scale-95"
                      >
                        <Eye />
                      </button>
                      <button
                        type="button"
                        onClick={() => window.open(`${FS.compiled}`, '_blank')}
                        className="rounded-sm bg-gray p-1 active:scale-95"
                      >
                        <Download />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center text-2xl font-bold">
                There are no currently <span className="font-bold text-green">turned in</span>
              </div>
            )}
          </div>

          <div className="mt-8 ">
            {completedFSs?.map((FS, FSIdx) => (
              <div
                key={FSIdx}
                className="flex w-full justify-between rounded-sm border border-input px-4 py-4"
              >
                <div className="text-xl font-bold">{FS?.organization.name}</div>
                <div className="item-center flex gap-8">
                  <div className="item-center flex gap-16">
                    <div className={`${statusTextColor} text-lg font-bold`}>
                      {FS.status.replace(/_/g, ' ')}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => window.open(`${FS.compiled}`, '_blank')}
                      className="rounded-sm bg-yellow p-1 active:scale-95"
                    >
                      <Eye />
                    </button>
                    <button
                      type="button"
                      onClick={() => window.open(`${FS.compiled}`, '_blank')}
                      className="rounded-sm bg-gray p-1 active:scale-95"
                    >
                      <Download />
                    </button>
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
