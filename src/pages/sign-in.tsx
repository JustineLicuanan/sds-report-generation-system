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
      <NavBar showNotificationButton={false} />

      {/* MAIN CONTENT */}
      <main className="flex h-[90vh]  flex-col items-center px-2 md:flex-row md:items-center md:justify-around">
        <img
          src="login.svg"
          alt="Undraw Illustration Image"
          className="mb-4 mt-3 h-3/5 md:mb-0 md:h-3/5 "
        ></img>

        {/* GOOGLE FORM */}
        <div id="google-form" className="flex w-3/4 flex-col items-center  px-3 md:max-w-[426px]">
          <div className="pb-7 text-center text-2xl font-medium tracking-tight md:pb-14 md:text-3xl lg:text-4xl">
            Sign in on your account!
          </div>

          <div className="flex w-full flex-col ">
            <label htmlFor="email-address" className="text-lg font-medium md:text-xl">
              Email
            </label>
            <input
              type="text"
              name="email-address"
              id="email-address"
              className="mt-1  rounded border-[1px] border-[#2A9134] px-2 py-1  text-lg outline-none lg:text-2xl"
              placeholder="john.doe@gmail.com"
            />
          </div>
          <Link
            href="#"
            id="raise"
            className="mt-3 inline-block w-full rounded px-7 py-3 text-center text-xl shadow-[0_4px_10px_0px_rgba(0,0,0,0.25)] hover:translate-y-[-0.10em] active:translate-y-0 lg:px-11 lg:py-4 lg:text-2xl"
          >
            Sign in with Email
          </Link>
        </div>
      </main>
    </>
  );
}
