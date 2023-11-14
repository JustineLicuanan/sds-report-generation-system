// import { UserRole } from '@prisma/client';
import { type GetServerSidePropsResult } from 'next';
import { type Session } from 'next-auth';

// import { paths } from '~/meta';

export const authRedirects = {
  admin: (_authSession) => {
    // if (!authSession?.user) {
    //   return { redirect: { destination: paths.SIGN_IN, permanent: false } };
    // }

    // if (authSession?.user.role !== UserRole.ADMIN) {
    //   return { notFound: true };
    // }

    return { props: {} };
  },

  organization: (_authSession) => {
    // if (!authSession?.user) {
    //   return { redirect: { destination: paths.SIGN_IN, permanent: false } };
    // }

    // if (authSession?.user.role !== UserRole.STUDENT_LEADER) {
    //   return { notFound: true };
    // }

    return { props: {} };
  },
} satisfies Record<string, (authSession: Session | null) => GetServerSidePropsResult<object>>;
