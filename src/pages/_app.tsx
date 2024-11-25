import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';

import { Toaster } from '~/components/ui/toaster';
import { api } from '~/utils/api';

import '~/styles/globals.css';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <link rel="icon" href="/sds_icon.png" />
      </Head>

      <Component {...pageProps} />

      <Toaster />

      <ToastContainer />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
