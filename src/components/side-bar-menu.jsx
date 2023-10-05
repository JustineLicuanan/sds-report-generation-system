export default function SideBarMenu() {
  const sidebarMenu = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    { id: 4, name: 'Item 4' },
  ];
  return (
    <>
      {sidebarMenu.map((item) => (
        <button
          key={item.id}
          className=" m-1 mb-2 h-12 w-12 rounded-md bg-[#D9D9D9]  hover:bg-[#f7b205] md:mx-1"
        ></button>
      ))}
    </>
  );
}

export function Subject({ onButtonClick }) {
  const subjects = [
    { id: 1, subject: 'Subject 1', date: '02/03/23' },
    { id: 2, subject: 'Subject 2', date: '02/04/23' },
    { id: 3, subject: 'Subject 3', date: '02/05/23' },
    { id: 4, subject: 'Subject 4', date: '02/06/23' },
    { id: 5, subject: 'Subject 5', date: '02/07/23' },
  ];

  const handleButtonClick = (subject, date) => {
    onButtonClick({ subject, date });
  };

  return (
    <>
      {subjects.map((subject) => (
        <button
          key={subject.id}
          className="relative mb-2 h-12 w-full rounded-md bg-[#D9D9D9] p-1 hover:bg-[#f7b205] focus:bg-[#f7b205] md:h-12"
          onClick={() => handleButtonClick(subject.subject, subject.date)}
        >
          <h1 className=" text-left text-sm font-semibold md:text-base">{subject.subject}</h1>
          <div className="mt-2 text-right text-xs text-gray-600 md:mt-1">{subject.date}</div>
          <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-[#0CF022]">!</div>
        </button>
      ))}
    </>
  );
}
