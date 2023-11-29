import { ReportCategory, ReportVisibility } from '@prisma/client';
import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import NavBar from '~/components/navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
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
      <NavBar />
      <main className="flex">
        {/* SIDE BAR */}
        <OrganizationSideBarMenu />

        {/* MAIN CONTENT */}

        <div className="mx-3 mt-4 w-full ">
          <div className="mx-auto my-0 flex min-h-[87vh] max-w-5xl flex-col rounded-3xl px-5 py-5 shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)] md:px-9">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
              Create New Report
            </h1>
            <label htmlFor="organization-name" className="mt-3 text-xl font-bold">
              Subject
            </label>
            <input
              type="text"
              name="organization-name"
              id="organization-name"
              className=" mt-1 h-8 w-2/5 border-[1px] border-green px-2  py-1 outline-none"
            />
            <label htmlFor="category" className="mt-1 text-xl font-bold">
              Category
            </label>
            <select
              id="category"
              className="mt-1 h-9 w-2/5 border-[1px] border-green px-2  py-1 text-lg outline-none"
            >
              <option value="">Select a category</option>
              {Object.values(ReportCategory).map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <label htmlFor="visibility" className="mt-1 text-xl font-bold">
              Visibility
            </label>
            <select
              id="visibility"
              className="mt-1 h-9 w-2/5 border-[1px] border-green px-2  py-1 text-lg outline-none"
            >
              <option value="">Select a visibility</option>
              {Object.values(ReportVisibility).map((visibility, index) => (
                <option key={index} value={visibility}>
                  {visibility}
                </option>
              ))}
            </select>
            <div className="mt-2  flex h-[400px] w-full  items-center justify-center border-[5px] border-green py-3 text-4xl font-medium">
              .PDF
            </div>
            <label
              htmlFor="upload-pdf"
              className="mt-2 cursor-pointer rounded-md bg-yellow px-4 py-2 text-center text-lg font-bold"
            >
              Upload
            </label>
            <input type="file" name="upload-pdf" id="upload-pdf" accept=".pdf" className="hidden" />
            <textarea
              name="report-description"
              id="report-description"
              className=" mt-2 w-full border-[1px] border-green px-2 text-lg outline-none"
              rows={2}
              placeholder="Description"
            ></textarea>
            <div className="mt-3 flex w-fit gap-2">
              <label className="relative mb-5 inline-flex cursor-pointer items-center">
                <input type="checkbox" value="" className="peer sr-only" />
                <div className="peer h-6 w-11 rounded-full  bg-gray after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray after:bg-white after:transition-all after:content-[''] peer-checked:bg-yellow peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-yellow rtl:peer-checked:after:-translate-x-full dark:border-gray dark:bg-gray dark:peer-focus:ring-blue-800"></div>
                <span className="ms-3 text-lg font-bold text-black/80">Has schedule </span>
              </label>
              <div className="group relative">
                <div className="h-7 w-7 rounded-full border bg-gray text-center text-lg font-bold">
                  ?
                </div>
                <div className="absolute left-0 hidden whitespace-nowrap rounded-md bg-gray px-2 py-1 text-sm font-medium group-hover:block">
                  Some description
                </div>
              </div>
            </div>
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
