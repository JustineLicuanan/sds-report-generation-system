import { SemReportStatus } from '@prisma/client';
import { Download, Eye } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminNavbar from '~/components/admin-navigation-bar';
import AdminSidebar from '~/components/admin-side-bar-menu';
import { Separator } from '~/components/ui/separator';
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
  const reportSemesterId = router.query.reportSemesterId as string;
  const utils = api.useContext();
  const { toast } = useToast();

  const getARs = api.admin.AR.get.useQuery({ current: true, include: { organization: true } });
  const ARs = getARs?.data;
  console.log(ARs);

  const turnedInARs = getARs.data?.filter((AR) => AR.status === SemReportStatus.TURNED_IN);
  const completedARs = getARs.data?.filter((AR) => AR.status === SemReportStatus.COMPLETED);

  const updateARStatus = api.admin.AR.updateStatus.useMutation(); // TODO: Lagyan onSuccess

  const statusTextColorAR = ARs?.map((AR, idx) => {
    return AR?.status === SemReportStatus.DRAFT || AR?.status === SemReportStatus.TURNED_IN
      ? 'text-c-secondary'
      : AR?.status === SemReportStatus.COMPLETED
      ? 'text-c-primary'
      : AR?.status === SemReportStatus.FOR_REVISION
      ? 'text-destructive'
      : '';
  });

  const getFSs = api.admin.FS.get.useQuery({
    where: { reportSemesterId },
    include: { organization: true },
  });
  const FSs = getFSs?.data;

  const turnedInFSs = getFSs.data?.filter((FS) => FS.status === SemReportStatus.TURNED_IN);
  const completedFSs = getFSs.data?.filter((FS) => FS.status === SemReportStatus.COMPLETED);

  const updateFSStatus = api.admin.FS.updateStatus.useMutation(); // TODO: Lagyan onSuccess

  const statusTextColorFS = FSs?.map((FS, idx) => {
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
          <div className="">
            <div className="text-2xl font-bold">Accomplishment Reports</div>
            {(completedARs ?? []).length > 0 ? (
              completedARs?.map((AR, ARIdx) => (
                <div
                  key={ARIdx}
                  className="my-2 flex w-full justify-between  rounded-sm border border-input px-4 py-4"
                >
                  <div className="text-xl font-bold">{AR?.organization.name}</div>
                  <div className="item-center flex gap-8">
                    <div className="item-center flex gap-16">
                      <div className={`${statusTextColorAR} text-lg font-bold`}>
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
              ))
            ) : (
              <div className="w-full text-center text-lg font-medium">
                There are currently no <span className="font-bold text-green">completed</span>{' '}
                accomplishment reports for this semester.
              </div>
            )}
          </div>

          <Separator className="my-4" />

          <div className="">
            <div className="text-2xl font-bold">Financial Statements</div>
            {(completedFSs ?? []).length ? (
              completedFSs?.map((FS, FSIdx) => (
                <div
                  key={FSIdx}
                  className=" my-2 flex w-full justify-between rounded-sm border border-input px-4 py-4"
                >
                  <div className="text-xl font-bold">{FS?.organization.name}</div>
                  <div className="item-center flex gap-8">
                    <div className="item-center flex gap-16">
                      <div className={`${statusTextColorFS} text-lg font-bold`}>
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
              ))
            ) : (
              <div className="w-full text-center text-lg font-medium">
                There are currently no <span className="font-bold text-green">completed</span>{' '}
                financial statements for this semester.
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
