import Head from 'next/head';
import NavBar from '~/components/navigation-bar';
import SideBarMenu from '~/components/side-bar-menu';
import { meta } from '~/meta';

export default function AdminDashboardPage() {
  return (
    <>
      <Head>
        <title>{`Dashboard ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <NavBar showNotificationButton={true} />

      <main className="flex">
        {/* SIDE BAR MENU */}

        <SideBarMenu />
        <div id="main-content" className="mx-5 w-full md:mx-10 md:w-8/12"></div>
      </main>
    </>
  );
}
