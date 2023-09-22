import Head from 'next/head';
import NavBar from '../components/navigation-bar';

export default function Home() {
  const data = [
    { id: 1, subject: 'Subject 1', date: '02/03/23' },
    { id: 2, subject: 'Subject 2', date: '02/04/23' },
    { id: 3, subject: 'Subject 3', date: '02/05/23' },
    { id: 4, subject: 'Subject 4', date: '02/06/23' },
    { id: 5, subject: 'Subject 5', date: '02/07/23' },
  ];
  return (
    <>
      <Head>
        <title>SD Services MIS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />

      <div
        id="side-bar"
        className="sticky top-20 my-4 ml-3 grid h-32 w-32 grid-cols-2 bg-[#2A9134] p-1 md:h-16 md:w-60 md:grid-cols-4 "
      >
        <div className=" m-1 h-12 w-12 rounded-md bg-[#D9D9D9] md:mx-1"></div>
        <div className=" m-1 h-12 w-12 rounded-md bg-[#D9D9D9] md:mx-1"></div>
        <div className=" m-1 h-12 w-12 rounded-md bg-[#D9D9D9] md:mx-1"></div>
        <div className=" m-1 h-12 w-12 rounded-md bg-[#D9D9D9] md:mx-1"></div>
      </div>

      <div
        id="side-bar"
        className="sticky top-20 my-4 ml-3 h-[67vh] w-32 bg-[#2A9134] p-2 md:h-[75vh] md:w-60 md:p-3"
      >
        {data.map((item) => (
          <div key={item.id} className="mb-2 h-12 w-full rounded-md bg-[#D9D9D9] p-1 md:h-12">
            <h1 className="text-sm font-semibold md:text-base ">{item.subject}</h1>
            <div className="mt-2 text-right text-xs text-gray-600 md:mt-1">{item.date}</div>
          </div>
        ))}
      </div>
    </>
  );
}
