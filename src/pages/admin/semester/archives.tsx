import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminNavbar from '~/components/admin-navigation-bar';
import AdminSidebar from '~/components/admin-side-bar-menu';
import { useToast } from '~/components/ui/use-toast';
import { meta, paths } from '~/meta';
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

export default function AdminArchivedSemesterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const getReportSemesterQuery = api.admin.reportSemester.get.useQuery({
    include: { accomplishmentReports: true },
  });
  const reportSemester = getReportSemesterQuery?.data;
  console.log(reportSemester);
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
            <div className="text-4xl font-bold">List of Previous Semesters</div>
          </div>
          <div className="mt-8">
            {(reportSemester ?? []).length ? (
              reportSemester?.map((reportSem, reportSemIdx) => (
                <div
                  key={reportSemIdx}
                  className="flex w-full justify-between rounded-sm border border-input px-4 py-4 capitalize"
                >
                  {reportSem.term.toLowerCase()} Semester (A.Y {reportSem.yearStart} -{' '}
                  {reportSem.yearEnd})
                  <div className="item-center flex gap-2">
                    <button
                      type="button"
                      onClick={() => router.push(`${paths.ADMIN}${paths.SEMESTER}/${reportSem.id}`)}
                      className="rounded-sm bg-yellow px-2 py-1 active:scale-95"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center text-2xl font-bold">
                There are no archived semester for Accomplishment Report
              </div>
            )}
          </div>

          {/* <div className="mt-8">
            {reportSemester?.map((reportSem, reportSemIdx) => (
              <div
                key={reportSemIdx}
                className="flex w-full justify-between rounded-sm border border-input px-4 py-4"
              >
                {reportSem.financialStatements}
              </div>
            ))}
          </div> */}
        </div>
      </main>
    </>
  );
}
