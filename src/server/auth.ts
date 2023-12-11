import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { LogAction, LogType, UserRole, type Session } from '@prisma/client';
import { type GetServerSidePropsContext } from 'next';
import { getServerSession, type DefaultSession, type NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';

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
    async signIn({ user, account }) {
      const existingUser = await db.user.findFirst({
        where: {
          AND: { email: user.email ?? '', isActive: true },
          OR: [{ role: UserRole.ADMIN }, { organizationIsArchived: false }],
        },
        include: { accounts: true },
      });

      if (!existingUser) return false;

      if (account?.type === 'oauth' && !existingUser.accounts.length) {
        await db.account.create({ data: { ...account, userId: existingUser.id } });
      }

      return true;
    },
  },
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({ clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET }),
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
  pages: { signIn: paths.SIGN_IN, error: paths.SIGN_IN, signOut: paths.SIGN_OUT },
  events: {
    async signIn({ user }) {
      await db.log.create({
        data: {
          type: LogType.AUTH,
          name: !user.organizationIsArchived ? `${user.organizationName} ${user.name}` : user.name!,
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

      if (!user) return;

      await db.log.create({
        data: {
          type: LogType.AUTH,
          name: !user.organizationIsArchived ? `${user.organizationName} ${user.name}` : user.name,
          email: user.email,
          action: LogAction.SIGN_OUT,
          createdById: user.id,
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
