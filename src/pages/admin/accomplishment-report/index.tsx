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

export default function AdminAccomplishmentReportPage() {
  const router = useRouter();
  const { toast } = useToast();

  const getARs = api.admin.AR.get.useQuery({ current: true, include: { organization: true } });
  const ARs = getARs?.data;
  console.log(ARs);

  const turnedInARs = getARs.data?.filter((AR) => AR.status === SemReportStatus.TURNED_IN);
  const completedARs = getARs.data?.filter((AR) => AR.status === SemReportStatus.COMPLETED);

  const updateARStatus = api.admin.AR.updateStatus.useMutation(); // TODO: Lagyan onSuccess

  const statusTextColor = ARs?.map((AR, idx) => {
    return AR?.status === SemReportStatus.DRAFT || AR?.status === SemReportStatus.TURNED_IN
      ? 'text-c-secondary'
      : AR?.status === SemReportStatus.COMPLETED
      ? 'text-c-primary'
      : AR?.status === SemReportStatus.FOR_REVISION
      ? 'text-destructive'
      : '';
  });

  return (
    <>
      <Head>
        <title>{`Accomplishment Report ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <AdminNavbar />

      <main className="flex">
        {/* SIDE BAR*/}
        <AdminSidebar />
        <div id="main-content" className="mx-4 my-4  w-full  gap-8">
          <div className="flex flex-col gap-2">
            <div className="text-4xl font-bold">Accomplishment Reports</div>
          </div>
          <div className="mt-8">
            {(turnedInARs ?? []).length > 0 ? (
              turnedInARs?.map((AR, ARIdx) => (
                <div
                  key={ARIdx}
                  className="flex w-full justify-between rounded-sm border border-input px-4 py-4"
                >
                  <div className="text-xl font-bold">{AR?.organization.name}</div>
                  <div className="item-center flex gap-8">
                    <div className="item-center flex gap-16">
                      <div className={`${statusTextColor} text-lg font-bold`}>
                        {AR.status.replace(/_/g, ' ')}
                      </div>
                      <div className="item-center flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            updateARStatus.mutate({
                              id: AR.id,
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
                            updateARStatus.mutate({ id: AR.id, status: SemReportStatus.COMPLETED });
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
                        onClick={() => window.open(`${AR.compiled}`, '_blank')}
                        className="rounded-sm bg-yellow p-1 active:scale-95"
                      >
                        <Eye />
                      </button>
                      <button
                        type="button"
                        onClick={() => window.open(`${AR.compiled}`, '_blank')}
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
            {completedARs?.map((AR, ARIdx) => (
              <div
                key={ARIdx}
                className="flex w-full justify-between rounded-sm border border-input px-4 py-4"
              >
                <div className="text-xl font-bold">{AR?.organization.name}</div>
                <div className="item-center flex gap-8">
                  <div className="item-center flex gap-16">
                    <div className={`${statusTextColor} text-lg font-bold`}>
                      {AR.status.replace(/_/g, ' ')}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => window.open(`${AR.compiled}`, '_blank')}
                      className="rounded-sm bg-yellow p-1 active:scale-95"
                    >
                      <Eye />
                    </button>
                    <button
                      type="button"
                      onClick={() => window.open(`${AR.compiled}`, '_blank')}
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
