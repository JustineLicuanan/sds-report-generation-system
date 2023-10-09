import Head from 'next/head';
import CreateOrganization from '~/components/create-organization';
import NavBar from '../components/navigation-bar';
import OrganizationAvatar from '../components/organization-avatar';
import SideBarMenu from '../components/side-bar-menu';

export default function Home() {
  return (
    <>
      <Head>
        <title>SD Services MIS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* NAVIGATION BAR */}
      <NavBar showNotificationButton={true} />

      <main className="flex">
        {/* SIDE BAR MENU */}

        <SideBarMenu />
        <div id="main-content" className="mx-5 w-full md:mx-10 md:w-8/12">
          <div className="my-4 h-2 rounded-md bg-[#2A9134]"> </div>

          {/* Student Govern Body */}
          <div id="student-govern-body">
            <h1 className="mb-1 mt-[-10px] text-lg font-bold md:text-xl lg:text-2xl">
              Student Governing Body
            </h1>
            <div
              id="student-govern"
              className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7"
            >
              <OrganizationAvatar />
            </div>
          </div>

          <div className="my-4 h-2 rounded-md bg-[#2A9134]"> </div>
          {/* Academic Organization */}
          <h1 className="mb-1 mt-[-10px] text-lg font-bold md:text-xl lg:text-2xl">
            Academic Organizations
          </h1>
          <div
            id="acad-orgs"
            className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7"
          >
            <OrganizationAvatar />
          </div>

          <div className="my-4 h-2 rounded-md bg-[#2A9134]"> </div>
          {/* Academic Organization */}
          <h1 className="mb-1 mt-[-10px] text-lg font-bold md:text-xl lg:text-2xl">
            Non-Academic Organizations
          </h1>
          <div
            id="non-acad-orgs"
            className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7"
          >
            <OrganizationAvatar />
          </div>
        </div>
      </main>
      <CreateOrganization />
    </>
  );
}

// function AuthShowcase() {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? 'Sign out' : 'Sign in'}
//       </button>
//     </div>
//   );
// }
