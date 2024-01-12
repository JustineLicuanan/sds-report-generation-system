import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminNavbar from '~/components/admin-navigation-bar';
import AdminSidebar from '~/components/admin-side-bar-menu';
import { meta, paths } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { authRedirects } from '~/utils/auth-redirects';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.admin(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function CreateSemPage() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{`Create Semester ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <AdminNavbar />

      <main className="flex">
        {/* SIDE BAR*/}
        <AdminSidebar />

        <div id="main-content" className="mx-4 my-4  w-full">
          <div className="text-2xl font-bold">Create New Semester</div>
          <div className="mt-8 flex flex-col gap-4">
            <div className="flex gap-4">
              <label htmlFor="year-start">Year start:</label>
              <input
                type="number"
                name=""
                id="year-start"
                className="rounded-sm border border-input bg-transparent px-1"
              />
            </div>
            <div className="flex gap-4">
              <label htmlFor="year-end">Year end:</label>
              <input
                type="number"
                name=""
                id="year-end"
                className="rounded-sm border border-input bg-transparent px-1"
              />
            </div>
            <div className="flex gap-4">
              <label htmlFor="term">Term</label>
              <input
                type="text"
                name=""
                id="term"
                className="rounded-sm border border-input bg-transparent px-1"
              />
            </div>
            <div className="flex gap-4">
              <label htmlFor="dueDateAR">Accomplishment Report Due Date:</label>
              <input
                type="datetime-local"
                name=""
                id="dueDateAR"
                className="rounded-sm border border-input bg-transparent px-1"
              />
            </div>
            <div className="flex gap-4">
              <label htmlFor="dueDateFS">Financial Statement Due Date:</label>
              <input
                type="datetime-local"
                name=""
                id="dueDateFS"
                className="rounded-sm border border-input bg-transparent px-1"
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push(`${paths.ADMIN}`)}
              className="mt-4 rounded-sm border border-gray bg-gray px-3 active:scale-95"
            >
              Back
            </button>
            <button
              type="button"
              className="mt-4 rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
            >
              Create
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
