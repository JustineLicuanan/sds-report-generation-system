import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NotificationAlert from '~/components/notification-alert';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
import PdfViewer from '~/components/pdf-viewer';
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

export default function UserOrgReportPage() {
  const router = useRouter();
  const { contentType } = router.query;
  return (
    <>
      <Head>
        <title>{`My Report ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />
      <main className="flex">
        {/* SIDE BAR */}
        <OrganizationSideBarMenu />

        {/* MAIN CONTENT */}
        <div className="mx-3 my-4 flex  w-full flex-col md:flex-row">
          <div className="ms-1 min-h-[87vh] w-full  px-5 py-5 shadow-[0_1px_10px_0px_rgba(0,0,0,0.25)]   md:ms-5 md:w-3/4  md:px-9 md:shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)]">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold tracking-tight md:text-2xl lg:text-3xl">
                {contentType}
              </h1>
              <div className="text-lg font-medium">[DATE]</div>
            </div>
            <div className="mt-8 flex h-[70vh] w-full items-center justify-center border-[5px] border-green text-4xl">
              <PdfViewer pdf="asd.pdf" />
            </div>
          </div>
          {/* COMMENTS */}
          <form
            className="relative mb-10  ms-1 min-h-[87vh]  w-full  py-5 shadow-[0_1px_10px_0px_rgba(0,0,0,0.25)] md:mb-0 md:ms-3  md:w-1/4  md:shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)]"
            // onSubmit={createCommentForm.handleSubmit(onSubmitComment, (error) =>
            //   console.log(error)
            // )}
          >
            <h2 className=" mb-2 text-center text-2xl font-medium">Comments</h2>
            <div className="h-[40vh] overflow-y-auto scroll-smooth">
              {/* {reportData?.comments.length ? (
                reportData?.comments.map((data) => (
                  <div
                    key={data.id}
                    id={data.id}
                    className={`${
                      session?.user.id === data.createdById ? 'text-right' : ''
                    } flex flex-col px-5`}
                  >
                    <div className="my-1 text-center text-xs font-light">
                      {data.createdAt.toLocaleString('en-US', { timeZone: 'Asia/Manila' })}
                    </div>
                    <div className="font-bold">
                      {data.organizationName} {data.createdByName}
                    </div>
                    <div
                      className={`${session?.user.id === data.createdById ? 'self-end' : ''} w-3/4`}
                    >
                      {data.content}
                    </div>
                  </div>
                ))
              ) : ( */}
              <div className="flex flex-col items-center px-5">
                <div className="font-bold">There is no current comment.</div>
              </div>
              {/* )} */}
            </div>
            {/* ADD A COMMENT */}
            <div className="mx-3 mt-6">
              <div className="h-[1px] bg-gray"></div>
              <textarea
                id="comment"
                rows={2}
                placeholder="Add a comment"
                className="mt-2 w-full border-[1px] border-green px-3 py-1 text-lg outline-none"
              ></textarea>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`mt-2 rounded-md bg-yellow  px-4 py-2 text-lg font-medium`}
                >
                  Comment
                </button>
              </div>
              <div className="mt-2 h-[1px] bg-gray"></div>
              <div className="mt-8 text-center text-lg font-bold text-red">For Revision</div>
            </div>
          </form>
        </div>
      </main>
      <NotificationAlert />
    </>
  );
}
