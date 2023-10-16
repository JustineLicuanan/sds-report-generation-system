import Head from 'next/head';
import NavBar from '../components/navigation-bar';
import OrganizationAvatar from '../components/organization-avatar';
import SideBarMenu from '../components/side-bar-menu';

export default function Home() {
  const organization = [
    {
      id: 1,
      name: 'Item 1',
      imageLink: '',
      category: 'Student Governing Body',
      email: '123@gmail.com',
      description: 'Some description',
    },
    {
      id: 2,
      name: 'Item 2',
      imageLink: '',
      category: 'Academic Organizations',
      email: '1234@gmail.com',
      description: ' description',
    },
    {
      id: 3,
      name: 'Item 3',
      imageLink: '',
      category: 'Academic Organizations',
      email: '1235@gmail.com',
      description: ' description',
    },
    {
      id: 4,
      name: 'Item 3',
      imageLink: '',
      category: 'Academic Organizations',
      email: '1236@gmail.com',
      description: ' random description',
    },
    {
      id: 5,
      name: 'Item 3',
      imageLink: '',
      category: 'Non-Academic Organizations',
      email: '1237@gmail.com',
      description: 'Some description',
    },
    {
      id: 6,
      name: 'Item 3',
      imageLink: '',
      category: 'Non-Academic Organizations',
      email: '1238@gmail.com',
      description: 'Some description',
    },
    {
      id: 7,
      name: 'Item 3',
      imageLink: '',
      category: 'Non-Academic Organizations',
      email: '1239@gmail.com',
      description: 'Some description',
    },
    {
      id: 8,
      name: 'Item 3',
      imageLink: '',
      category: 'Non-Academic Organizations',
      email: '1230@gmail.com',
      description: 'Some description',
    },
  ];

  const studentGoverningBody = organization.filter(
    (item) => item.category === 'Student Governing Body'
  );
  const academicOrganizations = organization.filter(
    (item) => item.category === 'Academic Organizations'
  );
  const nonAcademicOrganizations = organization.filter(
    (item) => item.category === 'Non-Academic Organizations'
  );

  return (
    <>
      <Head>
        <title>SD Services MIS</title>
        <link rel="icon" href="/favicon.ico" />
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
              <OrganizationAvatar organization={studentGoverningBody} />
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
            <OrganizationAvatar organization={academicOrganizations} />
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
            <OrganizationAvatar organization={nonAcademicOrganizations} />
          </div>
        </div>
      </main>
      {/* <CreateOrganization /> */}
    </>
  );
}
