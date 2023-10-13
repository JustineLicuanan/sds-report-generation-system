import Head from 'next/head';
import Link from 'next/link';
import NavBar from '../components/navigation-bar';

export default function Home() {
  return (
    <>
      {/* HEADER */}
      <Head>
        <title>SD Services MIS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* NAVIGATION BAR */}
      <NavBar />

      {/* MAIN CONTENT */}
      <main className="flex h-[90vh]  flex-col items-center px-2 md:flex-row md:items-center md:justify-around">
        <img
          src="login.svg"
          alt="Undraw Illustration Image"
          className="mb-4 mt-3 h-3/5 md:mb-0 md:h-3/5 "
        ></img>

        {/* GOOGLE FORM */}
        <div id="google-form" className="flex max-w-[426px] flex-col items-center px-3">
          <div className="pb-7 text-center text-2xl font-medium tracking-tight md:pb-14 md:text-3xl lg:text-4xl">
            Sign in on your account!
          </div>
          <Link
            href="#"
            id="raise"
            className="inline-block w-fit rounded-2xl px-7 py-3 shadow-md hover:translate-y-[-0.25em] active:translate-y-0 lg:px-11 lg:py-6"
          >
            <div className=" flex items-center">
              <img
                src="google_icon.png"
                alt="Google Icon"
                className="me-4 h-4 rounded md:h-5 lg:me-7 lg:h-7"
              />
              <span className="text-xl lg:text-3xl">Sign in with Google</span>
            </div>
          </Link>
        </div>
      </main>
    </>
  );
}
