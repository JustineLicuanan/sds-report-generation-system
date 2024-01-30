import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import { getMonthName } from '~/utils/get-month-name';

export default function MonthLabel() {
  const router = useRouter();
  const monthId = router.query.monthId;
  const getMonthlyFSQuery = api.shared.monthlyFS.get.useQuery({
    where: { id: monthId as string },
  });
  const monthlyFS = getMonthlyFSQuery?.data?.[0];
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
