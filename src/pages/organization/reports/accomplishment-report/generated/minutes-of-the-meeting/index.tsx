import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
import { meta, paths } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { authRedirects } from '~/utils/auth-redirects';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.organization(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function MinutesOfTheMeetingPage() {
  const [attendees, setAttendees] = useState([
    {
      name: '',
      position: '',
    },
  ]);

  const [agenda, setAgenda] = useState([
    {
      agenda: '',
    },
  ]);

  const [commencement, setCommencement] = useState([
    {
      commencement: '',
    },
  ]);
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{`Minutes of the Meeting ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />

      <main className="flex">
        {/* SIDE BAR*/}
        <OrganizationSideBarMenu />

        <div id="main-content" className="mx-4 my-4  w-full">
          <div className="text-2xl font-bold">Generate Minutes of the Meeting</div>
          <div className="mt-8 flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <label htmlFor="date">Date: </label>
              <input
                type="date"
                name=""
                id="date"
                className="rounded-sm border border-input bg-transparent px-1"
              />
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="location">Location: </label>
              <input
                type="text"
                name=""
                id="location"
                className="rounded-sm border border-input bg-transparent px-1"
              />
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="time-started">Time Started: </label>
              <input
                type="time"
                name=""
                id="time-started"
                className="rounded-sm border border-input bg-transparent px-1"
              />
            </div>
            <div className="mt-4 font-bold">ATTENDEES</div>
            {attendees.map((map, index) => (
              <div key={index} className="my-1 flex gap-2">
                <input
                  type="text"
                  name=""
                  id="resu-no"
                  placeholder="Name"
                  className="w-1/2 rounded-sm border border-input bg-transparent px-1"
                />
                <input
                  type="text"
                  name=""
                  id="resu-no"
                  placeholder="Position"
                  className="w-1/2 rounded-sm border border-input bg-transparent px-1"
                />
              </div>
            ))}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  const newDataArray = [...attendees];
                  newDataArray.pop(); // Remove the last item
                  setAttendees(newDataArray);
                }}
                className="rounded-sm border border-red bg-red px-3 text-white active:scale-95"
              >
                Remove attendees
              </button>
              <button
                type="button"
                onClick={() => {
                  attendees.push({
                    name: '',
                    position: '',
                  });
                  setAttendees([...attendees]);
                }}
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Add attendees
              </button>
            </div>

            <div className="mt-4 font-bold">AGENDA</div>
            {agenda.map((map, index) => (
              <div key={index} className="my-1 flex gap-2">
                <textarea
                  name=""
                  id="agenda"
                  placeholder="Add agenda content"
                  cols={30}
                  rows={2}
                  className="w-full rounded-sm border border-input bg-transparent px-1"
                ></textarea>{' '}
              </div>
            ))}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  const newDataArray = [...agenda];
                  newDataArray.pop(); // Remove the last item
                  setAgenda(newDataArray);
                }}
                className="rounded-sm border border-red bg-red px-3 text-white active:scale-95"
              >
                Remove content
              </button>
              <button
                type="button"
                onClick={() => {
                  agenda.push({
                    agenda: '',
                  });
                  setAgenda([...agenda]);
                }}
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Add content
              </button>
            </div>

            <div className="mt-4 font-bold">COMMENCEMENT</div>
            {commencement.map((map, index) => (
              <div key={index} className="my-1 flex gap-2">
                <textarea
                  name=""
                  id="commencement"
                  placeholder="Add commencement content"
                  cols={30}
                  rows={2}
                  className="w-full rounded-sm border border-input bg-transparent px-1"
                ></textarea>{' '}
              </div>
            ))}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  const newDataArray = [...commencement];
                  newDataArray.pop(); // Remove the last item
                  setCommencement(newDataArray);
                }}
                className="rounded-sm border border-red bg-red px-3 text-white active:scale-95"
              >
                Remove content
              </button>
              <button
                type="button"
                onClick={() => {
                  commencement.push({
                    commencement: '',
                  });
                  setCommencement([...commencement]);
                }}
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Add content
              </button>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <label htmlFor="signed-date">Time Adjourned:</label>
              <input
                type="time"
                name=""
                id="signed-date"
                className="rounded-sm border border-input bg-transparent px-1"
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() =>
                router.push(
                  `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.ACCOMPLISHMENT_REPORT}${paths.GENERATED_FILES}`
                )
              }
              className="mt-4 rounded-sm border border-gray bg-gray px-3 active:scale-95"
            >
              Back
            </button>
            <button
              type="button"
              className="mt-4 rounded-sm border border-red bg-red px-3 text-white active:scale-95"
            >
              Delete
            </button>
            <button
              type="button"
              className="mt-4 rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() =>
                router.push(
                  `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.ACCOMPLISHMENT_REPORT}${paths.GENERATED_FILES}${paths.MINUTES_OF_THE_MEETING}${paths.PRINT}`
                )
              }
              className="mt-4 rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
            >
              Preview
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
