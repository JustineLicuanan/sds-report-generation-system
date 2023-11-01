import { UserCategory } from '@prisma/client';
import Head from 'next/head';
import NavBar from '~/components/navigation-bar';
import OrganizationAvatar from '~/components/organization-avatar';
import SideBarMenu from '~/components/side-bar-menu';
import { meta } from '~/meta';
import { api } from '~/utils/api';

export default function AdminPage() {
  const getOrgQuery = api.admin.org.get.useQuery({});

  return (
    <>
      <Head>
        <title>{`Home ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <NavBar showNotificationButton={true} />

      <main className="flex">
        {/* SIDE BAR MENU */}

        <SideBarMenu />
        <div id="main-content" className="mx-5 w-full md:mx-10 md:w-8/12">
          <div className="my-4 h-2 rounded-md bg-[#2A9134]"> </div>

          {/* Student Govern Body */}
          <div id="student-govern-body">
            <h1 className="mb-1 mt-[-10px] text-lg font-bold md:text-xl lg:text-2xl">
              Student Governing Body
            </h1>
            <div
              id="student-govern"
              className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7"
            >
              <OrganizationAvatar
                organization={
                  getOrgQuery.data?.filter(
                    (item) => item.category === UserCategory.STUDENT_GOVERNING_BODY
                  ) ?? []
                }
              />
            </div>
          </div>

          <div className="my-4 h-2 rounded-md bg-[#2A9134]"> </div>
          {/* Academic Organization */}
          <h1 className="mb-1 mt-[-10px] text-lg font-bold md:text-xl lg:text-2xl">
            Academic Organizations
          </h1>
          <div
            id="acad-orgs"
            className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7"
          >
            <OrganizationAvatar
              organization={
                getOrgQuery.data?.filter(
                  (item) => item.category === UserCategory.ACADEMIC_ORGANIZATION
                ) ?? []
              }
            />
          </div>

          <div className="my-4 h-2 rounded-md bg-[#2A9134]"> </div>
          {/* Academic Organization */}
          <h1 className="mb-1 mt-[-10px] text-lg font-bold md:text-xl lg:text-2xl">
            Non-Academic Organizations
          </h1>
          <div
            id="non-acad-orgs"
            className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7"
          >
            <OrganizationAvatar
              organization={
                getOrgQuery.data?.filter(
                  (item) => item.category === UserCategory.NON_ACADEMIC_ORGANIZATION
                ) ?? []
              }
            />
          </div>
        </div>
      </main>
      {/* <CreateOrganization /> */}
    </>
  );
}