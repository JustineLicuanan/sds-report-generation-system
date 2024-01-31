import { MonthlyFS } from '@prisma/client';
import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import { getMonthName } from '~/utils/get-month-name';

export default function MonthLabel({monthlyFS}:{monthlyFS: MonthlyFS}) {
  
  return (
    <>
      <div className="mx-auto my-0 mb-16 flex min-h-[100vh] flex-col items-center justify-center p-4">
        <div className="text-6xl font-bold uppercase">
          {getMonthName(monthlyFS?.month as number)}
        </div>
      </div>
    </>
  );
}
