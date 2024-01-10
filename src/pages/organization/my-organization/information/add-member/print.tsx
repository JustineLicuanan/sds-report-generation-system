import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { meta } from '~/meta';
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

export default function CurriculumVitae() {
  return (
    <>
      <Head>
        <title>{`Curriculum Vitae ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>
      <div className="mx-auto my-0 flex max-w-[210mm] flex-col items-center">
        <div className="mb-1  w-full border-2 "></div>
        <div className="flex w-full justify-between">
          <div>
            <div className="font-bold">[NAME]</div>
            <div className="">[Address]</div>
            <div className="">[Contact #]</div>
            <div className="">[email@address.com]</div>
          </div>
          <div className="h-20 w-20 border-2">Profile Image</div>
        </div>

        <div className="mb-1  w-full border-2 "></div>
        <div className="">
          <div className="text-lg font-bold">PROFESSIONAL OBJECTIVES:</div>
          <div className="">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus alias explicabo
            obcaecati rerum nihil soluta, nisi eum iure accusantium doloribus ullam recusandae
            veniam, dicta aliquid suscipit fuga praesentium autem corporis.
          </div>
        </div>

        <div className="mb-1  w-full border-2 "></div>
        <div className=" flex w-full flex-col items-start">
          <div className="text-lg font-bold">PERSONAL SKILLS:</div>
          <div className="ms-8">
            <li>Teamplayer</li>
            <li>Adapt easily</li>
          </div>
        </div>

        <div className="mb-1  w-full border-2 "></div>
        <div className=" flex w-full flex-col justify-start">
          <div className="text-lg font-bold">PERSONAL INFORMATION:</div>
          <div>
            <div>
              <span className="font-bold">Date of Birth: </span> [Dirthdate]
            </div>
            <div>
              <span className="font-bold">Age: </span> [Age]
            </div>
            <div>
              <span className="font-bold">Civil Status: </span> [Civil Status]
            </div>
            <div>
              <span className="font-bold">Nationality: </span> [Nationality]
            </div>
            <div>
              <span className="font-bold">Religion: </span> [Religion]
            </div>
          </div>
        </div>

        <div className="mb-1  w-full border-2 "></div>
        <div className=" flex w-full flex-col justify-start">
          <div className="text-lg font-bold">EDUCATIONAL BACKGROUND:</div>
          <div className="">
            <div className="font-bold">Tertiary Education</div>
            <div className="">[Course]</div>
            <div className="">[School Name]</div>
            <div className="">[School Address]</div>
            <div className="">[Year Started] - Present</div>
          </div>
          <div className="mt-2">
            <div className="font-bold">Secondary Education</div>
            <div className="">[Course]</div>
            <div className="">[School Name]</div>
            <div className="">[School Address]</div>
            <div className="">[Year Started] - [Year ended]</div>

            <div className="mt-4">[School Name]</div>
            <div>[School Address]</div>
            <div className="">[Year Started] - [Year ended]</div>
          </div>

          <div className="mt-2">
            <div className="font-bold">Primary Education</div>
            <div className="">[School Name]</div>
            <div className="">[School Address]</div>
            <div className="">[Year Started] - [Year ended]</div>
          </div>
        </div>
        <div className="mb-1  w-full border-2 "></div>

        <div className="mt-20 w-full text-left">
          The undersigned hereby certifies that all information provided is true and correct.
        </div>

        <div className="mt-20 w-full text-end">[Name]</div>
      </div>
    </>
  );
}
