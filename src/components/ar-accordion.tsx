import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

export default function ARAccordion({ title, content }: { title: string; content: string }) {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <div className="mx-auto my-0 max-w-screen-lg">
        <div
          className="flex items-center justify-between bg-yellow px-8 py-2"
          onClick={() => setIsActive(!isActive)}
        >
          <div className="text-lg font-bold">{title}</div>
          <div className="font-bold">{isActive ? <Minus /> : <Plus />}</div>
        </div>
        {isActive && (
          <div className="px-4 py-2 shadow-[0_4px_10px_0px_rgba(0,0,0,0.20)]">{content}</div>
        )}
      </div>
    </>
  );
}
