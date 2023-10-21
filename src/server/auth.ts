import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { type GetServerSidePropsContext } from 'next';
import { getServerSession, type DefaultSession, type NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

import { env } from '~/env.mjs';
import { db } from '~/server/db';

export enum UserRole {
  ADMIN = 'ADMIN',
  STUDENT_LEADER = 'STUDENT_LEADER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
}

/**
 * Module augmentation for auth types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: DefaultSession['user'] & {
      id: string;
      // ...other properties
      role: UserRole;
      status: UserStatus;
    };
  }

  interface User {
    // ...other properties
    role: UserRole;
    status: UserStatus;
  }
}

/**
 * Options for auth used to configure adapters, providers, callbacks, etc.
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        role: user.role,
        status: user.status,
      },
    }),
    async signIn({ user }) {
      const userExists = !!(await db.user.count({
        where: { email: user.email ?? '', status: 'ACTIVE' },
      }));

      return userExists;
    },
  },
  adapter: PrismaAdapter(db),
  providers: [
    EmailProvider({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM,
      ...(env.NODE_ENV !== 'production'
        ? {
            sendVerificationRequest({ identifier: email, url, provider: { from } }) {
              console.log(`\n\nFrom: ${from}\nTo: ${email}\nURL: ${url}\n\n\n---`);
            },
          }
        : {}),
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Email provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model.
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req'];
  res: GetServerSidePropsContext['res'];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
