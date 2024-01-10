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

export default function AddMemberInformationPage() {
  const [data, setData] = useState([
    {
      title: '',
      content: '',
    },
  ]);

  const router = useRouter();
  return (
    <>
      <Head>
        <title>{`Add Member Information ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />

      <main className="flex">
        {/* SIDE BAR*/}
        <OrganizationSideBarMenu />

        <div id="main-content" className="mx-4 my-4  w-full">
          <div className="text-2xl font-bold">Add Member's Curriculum Vitae</div>
          <div className="mt-8 flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <label htmlFor="member-name">Name:</label>
              <input
                type="text"
                name=""
                id="member-name"
                className="rounded-sm border border-input bg-transparent px-1"
              />
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="member-position">Position:</label>
              <input
                type="text"
                name=""
                id="member-position"
                className="rounded-sm border border-input bg-transparent px-1"
              />
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                name=""
                id="address"
                className="w-1/2 rounded-sm border border-input bg-transparent px-1"
              />
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="contact-number">Contact Number:</label>
              <input
                type="number"
                name=""
                id="contact-number"
                className="rounded-sm border border-input bg-transparent px-1"
              />
            </div>

            <div className="flex items-center gap-4">
              <label htmlFor="email-address">Email Address:</label>
              <input
                type="email"
                name=""
                id="email-address"
                className="rounded-sm border border-input bg-transparent px-1"
              />
            </div>

            <div className="flex items-center gap-4">
              <label htmlFor="profile-picture">Your Professional Picture:</label>
              <input
                type="file"
                name=""
                id="profile-picture"
                className="rounded-sm border border-input bg-transparent px-1"
              />
            </div>

            <div className="flex items-center gap-4">
              <label htmlFor="pro-objectives">Professional Objectives:</label>
              <textarea
                name=""
                id="pro-objectives"
                cols={30}
                rows={3}
                className="w-1/2 rounded-sm border border-input bg-transparent px-1"
              ></textarea>
            </div>

            <div className="mt-4 font-bold">Personal Skills</div>
            {data.map((map, index) => (
              <div key={index} className="my-1 flex flex-col justify-end gap-2">
                <input
                  type="text"
                  name=""
                  id="personal-skills"
                  placeholder="Teamplayer"
                  className="rounded-sm border border-input bg-transparent px-1"
                />
              </div>
            ))}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  const newDataArray = [...data];
                  newDataArray.pop(); // Remove the last item
                  setData(newDataArray);
                }}
                className="rounded-sm border border-red bg-red px-3 text-white active:scale-95"
              >
                Remove skill
              </button>
              <button
                type="button"
                onClick={() => {
                  data.push({
                    title: '',
                    content: '',
                  });
                  setData([...data]);
                }}
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Add skill
              </button>
            </div>

            <div className="mt-4 font-bold">Personal Information</div>
            <div className="flex items-center gap-4">
              <label htmlFor="date-of-birth">Date of Birth:</label>
              <input
                type="date"
                name=""
                id="date-of-birth"
                className="rounded-sm border border-input bg-transparent px-1"
              />
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="age">Age:</label>
              <input
                type="number"
                name=""
                id="age"
                className="rounded-sm border border-input bg-transparent px-1"
              />
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="civil-status">Civil Status:</label>
              <select
                name=""
                id="civil-status"
                className="rounded-sm border border-input bg-transparent px-1"
              >
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="widowed">Widowed</option>
                <option value="legally seperated">Legally Separated</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="nationality">Nationality:</label>
              <input
                type="text"
                name=""
                id="nationality"
                className="rounded-sm border border-input bg-transparent px-1"
              />
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="religion">Religion:</label>
              <input
                type="text"
                name=""
                id="religion"
                className="rounded-sm border border-input bg-transparent px-1"
              />
            </div>

            <div className="mt-4 font-bold">Educational Background</div>
            <div className="ms-4 font-bold">Tertiary Education</div>
            <div className="flex items-center gap-4">
              <label htmlFor="tertiary-educ-course">Course:</label>
              <input
                type="text"
                name=""
                id="tertiary-educ-course"
                className="rounded-sm border border-input bg-transparent px-1"
              />
            </div>
            <div className="flex  items-center gap-4">
              <label htmlFor="tertiary-educ-school">School:</label>
              <input
                type="text"
                name=""
                id="tertiary-educ-school"
                className="w-1/2 rounded-sm border border-input bg-gray px-1"
                value="Cavite State University - Imus Campus"
                disabled={true}
              />
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="tertiary-educ-school-address">School Address:</label>
              <input
                type="text"
                name=""
                id="tertiary-educ-school-address"
                className="w-1/2 rounded-sm border border-input bg-gray px-1"
                value="Palico IV, Imus, Cavite"
                disabled={true}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <label htmlFor="tertiary-educ-year-started">Year Started:</label>
                <input
                  type="date"
                  name=""
                  id="tertiary-educ-year-started"
                  className="rounded-sm border border-input bg-transparent px-1"
                />
              </div>
              -
              <div className="flex items-center gap-4">
                <label htmlFor="tertiary-educ-year-ended">Year Ended:</label>
                <input
                  type="text"
                  name=""
                  id="tertiary-educ-year-ended"
                  className="rounded-sm border border-input bg-gray px-1"
                  value="Present"
                  disabled
                />
              </div>
            </div>

            <div className="ms-4 font-bold">Secondary Education - Senior High School</div>
            <div className="flex items-center gap-4">
              <label htmlFor="secondary-shs-educ-course">Course:</label>
              <input
                type="text"
                name=""
                id="secondary-shs-educ-course"
                className="rounded-sm border border-input bg-transparent px-1"
              />
            </div>
            <div className="flex  items-center gap-4">
              <label htmlFor="secondary-shs-educ-school">School:</label>
              <input
                type="text"
                name=""
                id="secondary-shs-educ-school"
                className="w-1/2 rounded-sm border border-input bg-transparent px-1"
              />
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="secondary-shs-educ-school-address">School Address:</label>
              <input
                type="text"
                name=""
                id="secondary-shs-educ-school-address"
                className="w-1/2 rounded-sm border border-input bg-transparent px-1"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <label htmlFor="secondary-shs-educ-year-started">Year Started:</label>
                <input
                  type="date"
                  name=""
                  id="secondary-shs-educ-year-started"
                  className="rounded-sm border border-input bg-transparent px-1"
                />
              </div>
              -
              <div className="flex items-center gap-4">
                <label htmlFor="secondary-shs-educ-year-ended">Year Ended:</label>
                <input
                  type="date"
                  name=""
                  id="secondary-shs-educ-year-ended"
                  className="rounded-sm border border-input bg-transparent px-1"
                />
              </div>
            </div>

            <div className="ms-4 font-bold">Secondary Education - Junior High School</div>
            <div className="flex  items-center gap-4">
              <label htmlFor="secondary-jhs-educ-school">School:</label>
              <input
                type="text"
                name=""
                id="secondary-jhs-educ-school"
                className="w-1/2 rounded-sm border border-input bg-transparent px-1"
              />
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="secondary-jhs-educ-school-address">School Address:</label>
              <input
                type="text"
                name=""
                id="secondary-jhs-educ-school-address"
                className="w-1/2 rounded-sm border border-input bg-transparent px-1"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <label htmlFor="secondary-jhs-educ-year-started">Year Started:</label>
                <input
                  type="date"
                  name=""
                  id="secondary-jhs-educ-year-started"
                  className="rounded-sm border border-input bg-transparent px-1"
                />
              </div>
              -
              <div className="flex items-center gap-4">
                <label htmlFor="secondary-jhs-educ-year-ended">Year Ended:</label>
                <input
                  type="date"
                  name=""
                  id="secondary-jhs-educ-year-ended"
                  className="rounded-sm border border-input bg-transparent px-1"
                />
              </div>
            </div>

            <div className="ms-4 font-bold">Primary Education</div>
            <div className="flex  items-center gap-4">
              <label htmlFor="primary-educ-school">School:</label>
              <input
                type="text"
                name=""
                id="primary-educ-school"
                className="w-1/2 rounded-sm border border-input bg-transparent px-1"
              />
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="primary-educ-school-address">School Address:</label>
              <input
                type="text"
                name=""
                id="primary-educ-school-address"
                className="w-1/2 rounded-sm border border-input bg-transparent px-1"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <label htmlFor="primary-educ-year-started">Year Started:</label>
                <input
                  type="date"
                  name=""
                  id="primary-educ-year-started"
                  className="rounded-sm border border-input bg-transparent px-1"
                />
              </div>
              -
              <div className="flex items-center gap-4">
                <label htmlFor="primary-educ-year-ended">Year Ended:</label>
                <input
                  type="date"
                  name=""
                  id="primary-educ-year-ended"
                  className="rounded-sm border border-input bg-transparent px-1"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() =>
                router.push(`${paths.ORGANIZATION}${paths.MY_ORGANIZATION}${paths.MEMBER_INFO}`)
              }
              className="mt-4 rounded-sm border border-gray bg-gray px-3 active:scale-95"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() =>
                router.push(
                  `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.ACCOMPLISHMENT_REPORT}${paths.RESOLUTION}${paths.PRINT}`
                )
              }
              className="mt-4 rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
            >
              Add
            </button>
          </div>
          
        </div>
      </main>
    </>
  );
}
