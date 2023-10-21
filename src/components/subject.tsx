import Link from 'next/link';
import { useState } from 'react';

type Subject = {
  id: number;
  subject: string;
  date: string;
  status: string;
  isHidden: boolean;
};
export default function Subject({ subjects }: { subjects: Subject[] }) {
  const [activeSubject, setActiveSubject] = useState<number | null>(null);
  const [subjectsState, setSubjectsState] = useState(subjects);
  const toggleShowOption = (id: number) => {
    if (activeSubject === id) {
      // Clicking the same button again, hide the div
      setActiveSubject(null);
      console.log(activeSubject, id);
    } else {
      // Clicking a new button, show the div and hide others
      setActiveSubject(id);
      console.log(setActiveSubject(id));
    }
  };

  const toggleHide = (isHidden: boolean, id: number) => {
    const updatedSubjects = subjectsState.map((subject) => {
      if (subject.id === id) {
        return {
          ...subject,
          isHidden: !isHidden,
        };
      }
      return subject;
    });
    setSubjectsState(updatedSubjects);
  };

  let filteredData = subjectsState.filter((item) => !item.isHidden);

  return (
    <>
      {filteredData.map((subject) => (
        <button
          onClick={() => toggleShowOption(subject.id)}
          key={subject.id}
          className={`${
            subject.isHidden ? 'hidden' : ''
          }relative mb-2 mt-2 h-16 w-full rounded-md border border-[#2A9134] p-1 shadow-[0_2px_4px_0px_rgba(0,0,0,0.25)] ${
            activeSubject === subject.id ? 'bg-[#f7b205]' : 'bg-[#ffffff]'
          }  hover:bg-[#f7b205]`}
        >
          <h1 className=" text-left text-xl font-semibold ">{subject.subject}</h1>
          <div className="mt-1 text-right text-lg text-black">{subject.date}</div>

          {subject.status === 'Approved' ? (
            <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full border-2 border-black bg-[#0CF022] font-bold">
              <img src="approved_icon.svg" alt="Approved Icon" />
            </div>
          ) : subject.status === 'Rejected' ? (
            <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full border-2 border-black bg-[#FF0000] font-bold">
              <img src="rejected_icon.png" alt="Rejected Icon" />
            </div>
          ) : (
            <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full border-2 border-black bg-[#f7b205] font-bold">
              <img src="pending_icon.png" alt="Pending Icon" />
            </div>
          )}
          {activeSubject === subject.id && (
            <div className="absolute left-full top-1/2 z-[1] flex flex-col bg-[#d9d9d9] py-1">
              <Link href="/my-request" className="bg-slate-300 px-5 py-2 hover:bg-[#f7b205] ">
                Open
              </Link>
              <button
                type="button"
                onClick={() => toggleHide(subject.isHidden, subject.id)}
                className=" rounded bg-slate-300 px-5 py-2 hover:bg-[#f7b205]"
              >
                Hide
              </button>
            </div>
          )}
        </button>
      ))}
    </>
  );
}
