import { OrganizationCategory } from '@prisma/client';
import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import AdminNavBar from '~/components/admin-navigation-bar';
import AdminSideBarMenu from '~/components/admin-side-bar-menu';
import OrganizationAvatar from '~/components/organization-avatar';
import { meta, paths } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.admin(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function AdminPage() {
  const getOrgQuery = api.admin.org.get.useQuery();

  const [categoryShown, setCategoryShown] = useState('all');
  return (
    <>
      <Head>
        <title>{`Organizations ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <AdminNavBar />

      <main className="flex">
        {/* SIDE BAR MENU */}

        <AdminSideBarMenu />
        <div id="main-content" className="mx-5 my-4 w-full">
          <div className=" flex justify-between gap-4 rounded-sm p-4 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="flex w-2/4 flex-col items-center justify-center gap-2">
              <div className="text-center text-3xl font-bold">Organizations</div>
              <div className="text-medium w-2/3 text-justify text-sm">
                Student organizations at CVSU-Imus Campus are dynamic communities that provide
                students with opportunities for personal and professional growth.{' '}
                <Link
                  href={`${paths.ADMIN}${paths.ORGANIZATIONS}${paths.ORGANIZATION_CREATE}`}
                  className="text-blue-700 hover:text-blue-500 hover:underline"
                >
                  Create new organization
                </Link>
              </div>
            </div>
            <div className="flex w-2/4 justify-evenly gap-2">
              <div className="self-center rounded-sm border border-input px-4 py-2">
                <div className="text-center text-lg font-bold">Student Governing Body</div>
                <div className="text-center text-4xl font-bold text-yellow underline">
                  {
                    getOrgQuery.data?.filter(
                      (item) => item.category === OrganizationCategory.STUDENT_GOVERNING_BODY
                    ).length
                  }
                </div>
              </div>
              <div className="self-center rounded-sm border border-input px-4 py-2">
                <div className="text-center text-lg font-bold">Academic Organization</div>
                <div className="text-center text-4xl font-bold text-yellow underline">
                  {
                    getOrgQuery.data?.filter(
                      (item) => item.category === OrganizationCategory.ACADEMIC_ORGANIZATION
                    ).length
                  }
                </div>
              </div>
              <div className="self-center rounded-sm border border-input px-4 py-2">
                <div className="text-center text-lg font-bold">Non-Academic Organization</div>
                <div className="text-center text-4xl font-bold text-yellow underline">
                  {
                    getOrgQuery.data?.filter(
                      (item) => item.category === OrganizationCategory.NON_ACADEMIC_ORGANIZATION
                    ).length
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-4 rounded-sm p-4 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold">Organizations</div>
              <div className="text-2xl font-medium">
                {categoryShown !== 'all' ? `(${categoryShown.replace(/_/g, ' ')})` : ''}
              </div>
            </div>
            <div className="absolute right-[1rem] top-[1rem]">
              <select
                name="organization"
                id="organization"
                onChange={(e) => setCategoryShown(e.target.value)}
                className="p-2"
                value={categoryShown}
              >
                <option value="all">All</option>
                {Object.values(OrganizationCategory).map((org) => (
                  <option key={org} value={org}>
                    {org.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
            {categoryShown ? (
              <div className="mt-4 grid grid-cols-4 gap-4">
                <OrganizationAvatar
                  organization={
                    categoryShown !== 'all'
                      ? getOrgQuery.data?.filter((item) => item.category === categoryShown) ?? []
                      : getOrgQuery?.data ?? []
                  }
                />{' '}
              </div>
            ) : (
              <div className="mb-4 mt-8 text-center text-xl font-bold">
                No organization on this category,{' '}
                <Link
                  href={`${paths.ADMIN}${paths.ORGANIZATIONS}${paths.ORGANIZATION_CREATE}`}
                  className="text-blue-700 hover:text-blue-500 hover:underline"
                >
                  create one
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
