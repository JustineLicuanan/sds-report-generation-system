import { UserRole } from '@prisma/client';
import { type GetServerSideProps } from 'next';
import { paths } from '~/meta';
import { getServerAuthSession } from '~/server/auth';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);

  if (authSession?.user?.role === UserRole.STUDENT_LEADER) {
    return { redirect: { destination: paths.ORGANIZATION, permanent: false } };
  }

  if (authSession?.user?.role === UserRole.ADMIN) {
    return { redirect: { destination: paths.ADMIN, permanent: false } };
  }

  return { redirect: { destination: paths.SIGN_IN, permanent: false } };
}) satisfies GetServerSideProps;

export default function HomePage() {
  return;
}
