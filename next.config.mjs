/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/env.mjs');

const paths = { ORGANIZATION: '/organization', SIGN_IN: '/auth/sign-in' };

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },

  redirects: () => [
    { source: '/org', destination: paths.ORGANIZATION, permanent: true },
    { source: '/login', destination: paths.SIGN_IN, permanent: true },
    { source: '/signin', destination: paths.SIGN_IN, permanent: true },
    { source: '/sign-in', destination: paths.SIGN_IN, permanent: true },
    { source: '/auth', destination: paths.SIGN_IN, permanent: true },
    { source: '/auth/login', destination: paths.SIGN_IN, permanent: true },
    { source: '/auth/signin', destination: paths.SIGN_IN, permanent: true },
  ],
};

export default config;
