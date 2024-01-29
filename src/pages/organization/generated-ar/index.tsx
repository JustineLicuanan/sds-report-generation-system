import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ARAccordion from '~/components/ar-accordion';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
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

export default function AccomplishmentReportTemplatePage() {
  const router = useRouter();
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 8;

  // const files = Object.values(GeneratedARTemplate)
  //   .filter(
  //     (template) =>
  //       !['CALENDAR_OF_ACTIVITIES', 'INVITATION_LETTER', 'REQUEST_LETTER'].includes(template)
  //   )
  //   .map((template) => ({
  //     filePath: `/${enumToSlug(template)}`,
  //     title: template.replace(/_/g, ' '),
  //   }));

  // const [templateName, setTemplateName] = useState('');

  // const getGeneratedARQuery = api.shared.generatedAR.get.useQuery({
  //   orderBy: { createdAt: OrderBy.DESC },
  // });
  // const generatedAR = getGeneratedARQuery?.data;

  // const totalPages = Math.ceil(files.length / itemsPerPage);
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const visibleGeneratedAR = generatedAR?.slice(startIndex, startIndex + itemsPerPage);

  // const handlePageChange = (newPage: number) => {
  //   setCurrentPage(newPage);
  // };

  const [isActive, setIsActive] = useState(false);

  const accordionContent = [
    {
      title: 'Sample title 1',
      content:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officiis tempora natus numquam expedita voluptatem. Nostrum reprehenderit laborum fugit eos officiis!',
    },
    {
      title: 'Sample title 2',
      content:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officiis tempora natus numquam expedita voluptatem. Nostrum reprehenderit laborum fugit eos officiis!',
    },
    {
      title: 'Sample title 3',
      content:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officiis tempora natus numquam expedita voluptatem. Nostrum reprehenderit laborum fugit eos officiis!',
    },
  ];

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
            <div className="text-4xl font-bold">Generate Accomplishment Report</div>
          </div>
          <div className="mt-4">
            {accordionContent.map((accordion, index) => (
              <ARAccordion key={index} title={accordion.title} content={accordion.content} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
