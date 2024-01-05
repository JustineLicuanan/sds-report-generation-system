import { BadgeAlert, BadgeCheck } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import { CldImage } from 'next-cloudinary';
import Head from 'next/head';
import { useState } from 'react';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
import { meta } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.organization(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function AccomplishmentReportPage() {
  const getOrgQuery = api.shared.organization.get.useQuery();
  const org = getOrgQuery.data;

  // const router = useRouter();
  const [markDone, setMarkDone] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const divs = [
    // Organization Setup Status
    <div
      key={0}
      className="border-sm relative my-2 flex items-center justify-between gap-4 border border-input px-4 py-2"
    >
      <div className="w-1/2 text-center">
        <div className="text-2xl font-bold">Organization Setup Status</div>
        <div className="font-medium">
          Finalize the setup of your organization&apos;s information, as the details provided will
          be essential for completing the accomplishment report.
        </div>
      </div>
      <div className="flex w-1/2 flex-col gap-2">
        <div className="h-4 w-full rounded-full bg-gray">
          <div className="h-4 w-[50%] rounded-full bg-green"></div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
          >
            Generate
          </button>
          <button
            type="button"
            className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
          >
            Setup
          </button>
        </div>
      </div>
      <div className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-red text-white">
        <BadgeAlert className="h-4 w-4" />
      </div>
    </div>,

    // Calendar Of Activities
    <div
      key={1}
      className="border-sm relative my-2 flex items-center justify-between gap-4 border border-input px-4 py-2"
    >
      <div className="w-1/2 text-center">
        <div className="text-2xl font-bold">Calendar Of Activities</div>
        <div className="font-medium">Submit your organization&apos;s schedule of activities.</div>
      </div>
      <div className="flex w-1/2 flex-col gap-2">
        <div className="h-4 w-full rounded-full bg-gray">
          <div className="h-4 w-[25%] rounded-full bg-green"></div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
          >
            Generate
          </button>
          <button
            type="button"
            className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
          >
            Create
          </button>
          <button
            type="button"
            className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
          >
            Upload
          </button>
        </div>
      </div>
      <div className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-red text-white">
        <BadgeAlert className="h-4 w-4" />
      </div>
    </div>,

    // Approved Activity Proposals
    <div
      key={2}
      className="border-sm relative my-2 flex items-center justify-between gap-4 border border-input px-4 py-2"
    >
      <div className="w-1/2 text-center">
        <div className="text-2xl font-bold">Approved Activity Proposals</div>
        <div className="font-medium">Compilation of approved activities proposals</div>
      </div>
      <div className="flex w-1/2 flex-col gap-2">
        <div className="h-4 w-full rounded-full bg-gray">
          <div className={`${markDone ? 'w-[100%]' : 'w-[0%]'} h-4 rounded-full bg-green`}></div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
          >
            Edit details
          </button>
          <button
            type="button"
            className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
          >
            Generate
          </button>
          <label htmlFor="mark-as-done">Mark as done</label>
          <input
            type="checkbox"
            name=""
            id="mark-as-done"
            onChange={() => setMarkDone(!markDone)}
            value={markDone ? 1 : 0}
          />
        </div>
      </div>
      <div
        className={`${
          markDone ? 'bg-green' : 'bg-red'
        } absolute -right-2 -top-2 h-4 w-4 rounded-full text-white`}
      >
        {markDone ? <BadgeCheck className="h-4 w-4" /> : <BadgeAlert className="h-4 w-4" />}
      </div>
    </div>,

    // Approved Project Proposal
    <div
      key={3}
      className="border-sm relative my-2 flex items-center justify-between gap-4 border border-input px-4 py-2"
    >
      <div className="w-1/2 text-center">
        <div className="text-2xl font-bold">Approved Project Proposal</div>
        <div className="font-medium">Compilation of approved project proposal</div>
      </div>
      <div className="flex w-1/2 flex-col gap-2">
        <div className="h-4 w-full rounded-full bg-gray">
          <div className={`${markDone ? 'w-[100%]' : 'w-[0%]'} h-4 rounded-full bg-green`}></div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
          >
            Edit details
          </button>
          <button
            type="button"
            className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
          >
            Generate
          </button>
          <label htmlFor="mark-as-done">Mark as done</label>
          <input
            type="checkbox"
            name=""
            id="mark-as-done"
            onChange={() => setMarkDone(!markDone)}
            value={markDone ? 1 : 0}
          />
        </div>
      </div>
      <div
        className={`${
          markDone ? 'bg-green' : 'bg-red'
        } absolute -right-2 -top-2 h-4 w-4 rounded-full text-white`}
      >
        {markDone ? <BadgeCheck className="h-4 w-4" /> : <BadgeAlert className="h-4 w-4" />}
      </div>
    </div>,

    // Approved Resolutions
    <div
      key={4}
      className="border-sm relative my-2 flex items-center justify-between gap-4 border border-input px-4 py-2"
    >
      <div className="w-1/2 text-center">
        <div className="text-2xl font-bold">Approved Resolutions</div>
        <div className="font-medium">Compilation of approved resolutions</div>
      </div>
      <div className="flex w-1/2 flex-col gap-2">
        <div className="h-4 w-full rounded-full bg-gray">
          <div className={`${markDone ? 'w-[100%]' : 'w-[0%]'} h-4 rounded-full bg-green`}></div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
          >
            Edit details
          </button>
          <button
            type="button"
            className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
          >
            Generate
          </button>
          <label htmlFor="mark-as-done">Mark as done</label>
          <input
            type="checkbox"
            name=""
            id="mark-as-done"
            onChange={() => setMarkDone(!markDone)}
            value={markDone ? 1 : 0}
          />
        </div>
      </div>
      <div
        className={`${
          markDone ? 'bg-green' : 'bg-red'
        } absolute -right-2 -top-2 h-4 w-4 rounded-full text-white`}
      >
        {markDone ? <BadgeCheck className="h-4 w-4" /> : <BadgeAlert className="h-4 w-4" />}
      </div>
    </div>,

    // Approved Other Letters
    <div
      key={5}
      className="border-sm relative my-2 flex items-center justify-between gap-4 border border-input px-4 py-2"
    >
      <div className="w-1/2 text-center">
        <div className="text-2xl font-bold">Approved Other Letters</div>
        <div className="font-medium">Compilation of approved other letters</div>
      </div>
      <div className="flex w-1/2 flex-col gap-2">
        <div className="h-4 w-full rounded-full bg-gray">
          <div className={`${markDone ? 'w-[100%]' : 'w-[0%]'} h-4 rounded-full bg-green`}></div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
          >
            Edit details
          </button>
          <button
            type="button"
            className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
          >
            Generate
          </button>
          <label htmlFor="mark-as-done">Mark as done</label>
          <input
            type="checkbox"
            name=""
            id="mark-as-done"
            onChange={() => setMarkDone(!markDone)}
            value={markDone ? 1 : 0}
          />
        </div>
      </div>
      <div
        className={`${
          markDone ? 'bg-green' : 'bg-red'
        } absolute -right-2 -top-2 h-4 w-4 rounded-full text-white`}
      >
        {markDone ? <BadgeCheck className="h-4 w-4" /> : <BadgeAlert className="h-4 w-4" />}
      </div>
    </div>,

    // Summary of Conducted Events
    <div
      key={6}
      className="border-sm relative my-2 flex items-center justify-between gap-4 border border-input px-4 py-2"
    >
      <div className="w-1/2 text-center">
        <div className="text-2xl font-bold">Summary of Conducted Events</div>
        <div className="font-medium">Summary of all events conducted throughout the semester.</div>
      </div>
      <div className="flex w-1/2 flex-col gap-2">
        <div className="h-4 w-full rounded-full bg-gray">
          <div className={`h-4 w-[100%] rounded-full bg-green`}></div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
          >
            Generate
          </button>
        </div>
      </div>
      <div
        className={`${
          markDone ? 'bg-green' : 'bg-red'
        } absolute -right-2 -top-2 h-4 w-4 rounded-full text-white`}
      >
        {markDone ? <BadgeCheck className="h-4 w-4" /> : <BadgeAlert className="h-4 w-4" />}
      </div>
    </div>,

    // Community Extension Services
    <div
      key={7}
      className="border-sm relative my-2 flex items-center justify-between gap-4 border border-input px-4 py-2"
    >
      <div className="w-1/2 text-center">
        <div className="text-2xl font-bold">Community Extension Services</div>
        <div className="font-medium">
          A compilation of community extension services showcases diverse initiatives conducted
          throughout the semester.
        </div>
      </div>
      <div className="flex w-1/2 flex-col gap-2">
        <div className="h-4 w-full rounded-full bg-gray">
          <div className={`${markDone ? 'w-[100%]' : 'w-[0%]'} h-4 rounded-full bg-green`}></div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
          >
            Edit details
          </button>
          <button
            type="button"
            className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
          >
            Generate
          </button>
          <label htmlFor="mark-as-done">Mark as done</label>
          <input
            type="checkbox"
            name=""
            id="mark-as-done"
            onChange={() => setMarkDone(!markDone)}
            value={markDone ? 1 : 0}
          />
        </div>
      </div>
      <div
        className={`${
          markDone ? 'bg-green' : 'bg-red'
        } absolute -right-2 -top-2 h-4 w-4 rounded-full text-white`}
      >
        {markDone ? <BadgeCheck className="h-4 w-4" /> : <BadgeAlert className="h-4 w-4" />}
      </div>
    </div>,

    // Minutes of the Meeting
    <div
      key={8}
      className="border-sm relative my-2 flex items-center justify-between gap-4 border border-input px-4 py-2"
    >
      <div className="w-1/2 text-center">
        <div className="text-2xl font-bold">Minutes of the Meeting</div>
        <div className="font-medium">
          The compilation of minutes of the meeting includes comprehensive documentation of
          attendees, agendas, and relevant discussions.
        </div>
      </div>
      <div className="flex w-1/2 flex-col gap-2">
        <div className="h-4 w-full rounded-full bg-gray">
          <div className={`${markDone ? 'w-[100%]' : 'w-[0%]'} h-4 rounded-full bg-green`}></div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
          >
            Edit details
          </button>
          <button
            type="button"
            className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
          >
            Generate
          </button>
          <label htmlFor="mark-as-done">Mark as done</label>
          <input
            type="checkbox"
            name=""
            id="mark-as-done"
            onChange={() => setMarkDone(!markDone)}
            value={markDone ? 1 : 0}
          />
        </div>
      </div>
      <div
        className={`${
          markDone ? 'bg-green' : 'bg-red'
        } absolute -right-2 -top-2 h-4 w-4 rounded-full text-white`}
      >
        {markDone ? <BadgeCheck className="h-4 w-4" /> : <BadgeAlert className="h-4 w-4" />}
      </div>
    </div>,
  ];

  const totalPages = Math.ceil(divs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleDivs = divs.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  return (
    <>
      <Head>
        <title>{`Accomplishment Report ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />

      <main className="flex">
        {/* SIDE BAR*/}
        <OrganizationSideBarMenu />
        <div id="main-content" className="mx-4 my-4  w-full  gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              {org?.imageId ? (
                <CldImage
                  width="100"
                  height="100"
                  src={`/${org?.imageId}`}
                  alt="Organization Logo"
                  className=" me-1 h-20 w-20 rounded-full bg-green md:h-24 md:w-24 lg:h-36 lg:w-36"
                />
              ) : (
                <div className='className=" me-1 h-20 w-20 rounded-full bg-green md:h-24 md:w-24 lg:h-28 lg:w-28'></div>
              )}
              <div className="">
                <div className="text-4xl font-bold">Accomplishment Report</div>
                <div className="text-2xl font-medium">[Semester]</div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Done
              </button>
              <button
                type="button"
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Upload
              </button>
              <button
                type="button"
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Generate
              </button>
            </div>
          </div>

          <div className="mt-8">
            {visibleDivs.map((div, index) => (
              <div key={index}>{div}</div>
            ))}
          </div>

          <div className="my-4 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`${
                  currentPage === index + 1 ? 'bg-yellow' : ''
                } border border-input px-2 py-1`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
