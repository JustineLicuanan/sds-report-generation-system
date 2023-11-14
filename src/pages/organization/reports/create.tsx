import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import NavBar from '~/components/navigation-bar';
import SideBarMenu from '~/components/side-bar-menu';
import { meta } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { authRedirects } from '~/utils/auth-redirects';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.organization(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function CreateReportPage() {
  return (
    <>
      <Head>
        <title>{`Create Report ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <NavBar showNotificationButton={true} />
      <main className="flex">
        {/* SIDE BAR */}
        <SideBarMenu />

        {/* MAIN CONTENT */}

        <div className="mx-3 mt-4 h-[87vh] w-full ">
          <div className="mx-auto my-0 flex h-[87vh] max-w-5xl flex-col rounded-3xl px-5 py-5 shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)] md:px-9">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
              Create New Report
            </h1>
            <label htmlFor="organization-name" className="mt-3 text-lg font-medium">
              Organization Name
            </label>
            <input
              type="text"
              name="organization-name"
              id="organization-name"
              className=" mt-1 h-8 w-2/5 border-[1px] border-green px-2  py-1 outline-none"
            />
            <label htmlFor="date" className="mt-1 text-lg font-medium">
              Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              className=" mt-1 h-9 w-1/5 border-[1px] border-green px-2 text-lg outline-none"
            />
            <label
              htmlFor="upload-pdf"
              className="mt-2  flex h-[50vh] w-full cursor-pointer items-center justify-center border-[5px] border-green py-3 text-4xl font-medium hover:border-green/50"
            >
              Click me to upload your file!
            </label>
            <input type="file" name="upload-pdf" id="upload-pdf" accept="pdf" className="hidden" />
            <textarea
              name="report-message"
              id="report-message"
              className=" mt-2 w-full border-[1px] border-green px-2 text-lg outline-none"
              rows={2}
              placeholder="Message"
            ></textarea>
            <div className="flex justify-end">
              <button
                type="button"
                className="mt-2 rounded-md bg-yellow px-4 py-1 text-lg font-medium"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
