import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
import OutflowRow from '~/components/outflow-row';
import { useToast } from '~/components/ui/use-toast';
import { meta, paths } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';
import { getMonthName } from '~/utils/get-month-name';
import { schemas } from '~/zod-schemas';
import { OrderBy } from '~/zod-schemas/utils';

type CreateOutflowRowFSInputs = z.infer<typeof schemas.shared.outflowRowFS.create>;

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.organization(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function OutflowFinancialStatementPage() {
  const router = useRouter();
  const monthlyId = router.query.monthlyId;
  const outflowId = router.query.outflowId;
  const utils = api.useContext();
  const { toast } = useToast();

  const getMonthNameQuery = api.shared.monthlyFS.get.useQuery({
    where: { id: monthlyId as string },
    current: true,
  });
  const monthly = getMonthNameQuery?.data?.[0];

  const getOutflowFSQuery = api.shared.outflowFS.get.useQuery({
    where: { id: outflowId as string },
  });
  const outflowFS = getOutflowFSQuery?.data?.[0];

  const getOutflowRowFSQuery = api.shared.outflowRowFS.get.useQuery({
    where: { outflowId: outflowId as string },
    orderBy: { date: OrderBy.ASC },
  });
  const outflowRowFS = getOutflowRowFSQuery?.data;

  const createOutflowRowFSForm = useForm<CreateOutflowRowFSInputs>({
    resolver: zodResolver(schemas.shared.outflowRowFS.create),
    // These values are for the initial data of input fields, mostly used for 'edit/update' forms like this one
    values: {
      date: new Date().toISOString().split('T')[0] ?? '',
      monthlyId: monthlyId as string,
      outflowId: outflowId as string,
      particulars: 'Item',
      price: 0,
      quantity: 0,
      unit: 'pc/s',
    },
  });

  const createOutflowRowFS = api.shared.outflowRowFS.create.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async ({ id }) => {
      toast({ variant: 'c-primary', description: '✔️ FS Outflow created successfully.' });
      await utils.shared.outflowRowFS.invalidate();
    },
    // This is the callback function after failed backend execution. This is mostly used for 'unique' data conflict errors like unique email, etc.
    onError: () => {
      toast({
        variant: 'destructive',
        title: '❌ Internal Server Error',
        description: 'Creating of FS Inflow Collection failed.',
      });
    },
  });

  const onSubmitCreateOutflowIgpFS: SubmitHandler<CreateOutflowRowFSInputs> = (values) => {
    if (createOutflowRowFS.isLoading) {
      return;
    }
    createOutflowRowFS.mutate(values);
  };

  const getReportSemQuery = api.shared.reportSemester.get.useQuery();
  const reportSem = getReportSemQuery?.data;

  const [disable, setDisable] = useState(false);

  return (
    <>
      <Head>
        <title>{`Financial Statement ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <OrgNavBar />

      <main className="flex">
        {/* SIDE BAR*/}
        <OrganizationSideBarMenu />
        <div id="main-content" className="mx-4 my-4  w-full  gap-8">
          <div className="w-full rounded-md px-5 py-3 ">
            <ol className="list-reset flex">
              <li>
                <Link
                  href={`${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}`}
                  className="hover:text-black/80"
                >
                  Home
                </Link>
              </li>
              <li>
                <span className="mx-2 text-neutral-500">&gt;</span>
              </li>
              <li className="hover:text-black/80">
                <Link
                  href={`${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}${paths.MONTHLY}/${monthlyId}`}
                  className="hover:text-black/80"
                >
                  {getMonthName(monthly?.month as number)} {monthly?.year}
                </Link>
              </li>
              <li>
                <span className="mx-2 text-neutral-500">&gt;</span>
              </li>
              <li className="text-neutral-500 capitalize">
                Outflow - {outflowFS?.category.toLowerCase().replace(/_/, ' ')}
              </li>
            </ol>
          </div>

          <div className="mb-4 text-4xl font-bold capitalize">
            Outflow - {outflowFS?.category.toLowerCase().replace(/_/, ' ')}
          </div>
          <div className="text-medium text-lg capitalize">
            {reportSem?.term.toLowerCase()} Semester - {getMonthName(monthly?.month as number)}
          </div>

          {/* TABLE */}
          <div className="mt-4 flex min-h-[60vh] w-full flex-col gap-2 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <form
              className="flex justify-end gap-2"
              onSubmit={createOutflowRowFSForm.handleSubmit(onSubmitCreateOutflowIgpFS, (error) =>
                console.log(error)
              )}
            >
              <button
                type="submit"
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Add row
              </button>
            </form>
            <div>
              <div className="flex w-full border border-black bg-green">
                <div className="w-[15%] p-1 text-center text-lg font-bold text-white ">Date</div>
                <div className="w-[10%] p-1 text-center text-lg font-bold text-white ">
                  Quantity
                </div>
                <div className="w-[15%] p-1 text-center text-lg font-bold text-white ">
                  Particulars
                </div>
                <div className="w-[10%] p-1 text-center text-lg font-bold text-white ">Unit</div>
                <div className="w-[10%] p-1 text-center text-lg font-bold text-white ">Price</div>
                <div className="w-[10%] p-1 text-center text-lg font-bold text-white ">Amount</div>
                <div className="w-[15%] p-1 text-center text-lg font-bold text-white ">Receipt</div>
                <div className="w-[15%] p-1 text-center text-lg font-bold text-white ">Action</div>
              </div>
              {outflowRowFS?.map((outflowRow, index) => <OutflowRow outflowRow={outflowRow} />)}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
