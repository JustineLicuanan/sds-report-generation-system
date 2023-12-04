import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { LogAction, LogType, Session, UserRole } from '@prisma/client';
import { type GetServerSidePropsContext } from 'next';
import { getServerSession, type DefaultSession, type NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

import { env } from '~/env.mjs';
import { paths } from '~/meta';
import { db } from '~/server/db';

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
      organizationId?: string;
      organizationName?: string;
      organizationIsArchived?: boolean;
    };
  }

  interface User {
    // ...other properties
    role: UserRole;
    organizationId?: string;
    organizationName?: string;
    organizationIsArchived?: boolean;
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
        organizationId: user.organizationId,
        organizationName: user.organizationName,
        organizationIsArchived: user.organizationIsArchived,
      },
    }),
    async signIn({ user }) {
      const userExists = !!(await db.user.count({
        where: {
          AND: { email: user.email ?? '' },
          OR: [{ role: UserRole.ADMIN }, { organizationIsArchived: false }],
        },
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
  pages: { signIn: paths.SIGN_IN, signOut: paths.SIGN_OUT },
  events: {
    async signIn({ user }) {
      await db.log.create({
        data: {
          type: LogType.AUTH,
          name: user.name!,
          email: user.email,
          action: LogAction.SIGN_IN,
          createdById: user.id,
        },
      });
    },
    async signOut({ session }) {
      const user = await db.user.findUnique({
        where: { id: (session as unknown as Session).userId },
      });

      await db.log.create({
        data: {
          type: LogType.AUTH,
          name: user?.name!,
          email: user?.email,
          action: LogAction.SIGN_OUT,
          createdById: user?.id!,
        },
      });
    },
  },
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
