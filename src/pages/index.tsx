import Head from 'next/head';

import NavBar from '../components/navigation-bar';

export default function Home() {
  const data = [
    { id: 1, name: 'Item 1', imageLink: '' },
    { id: 2, name: 'Item 2', imageLink: '' },
    { id: 3, name: 'Item 3', imageLink: '' },
    { id: 4, name: 'Item 3', imageLink: '' },
    { id: 5, name: 'Item 3', imageLink: '' },
    { id: 6, name: 'Item 3', imageLink: '' },
    { id: 7, name: 'Item 3', imageLink: '' },
    { id: 8, name: 'Item 3', imageLink: '' },
  ];

  return (
    <>
      <Head>
        <title>SD Services MIS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* NAVIGATION BAR */}
      <NavBar />

      <main className="flex">
        <div
          id="side-bar"
          className="sticky top-20 my-4 ml-3 h-[87vh] w-16 bg-[#2A9134] p-2 md:w-20 md:p-3 "
        >
          <div
            id="child"
            className=" mb-2 h-12 w-12 rounded-md bg-[#D9D9D9] md:mb-3  md:h-14 md:w-14"
          ></div>
          <div
            id="child"
            className=" mb-2 h-12 w-12 rounded-md bg-[#D9D9D9] md:mb-3  md:h-14 md:w-14"
          ></div>
          <div
            id="child"
            className=" mb-2 h-12 w-12 rounded-md bg-[#D9D9D9] md:mb-3  md:h-14 md:w-14"
          ></div>
          <div
            id="child"
            className=" mb-2 h-12 w-12 rounded-md bg-[#D9D9D9] md:mb-3  md:h-14 md:w-14"
          ></div>
        </div>
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
              {data.map((item) => (
                <div
                  key={item.id}
                  className="mb-2 me-1 h-20 w-20 rounded-full bg-[#2A9134] md:h-24 md:w-24 lg:h-28 lg:w-28"
                ></div>
              ))}
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
            {data.map((item) => (
              <div
                key={item.id}
                className="mb-2 me-1 h-20 w-20 rounded-full bg-[#2A9134] md:h-24 md:w-24 lg:h-28 lg:w-28"
              ></div>
            ))}
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
            {data.map((item) => (
              <div
                key={item.id}
                className="mb-2 me-1 h-20 w-20 rounded-full bg-[#2A9134] md:h-24 md:w-24 lg:h-28 lg:w-28"
              ></div>
            ))}
          </div>
        </div>
      </main>
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
