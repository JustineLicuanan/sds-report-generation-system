import { zodResolver } from '@hookform/resolvers/zod';
import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import InflowIgpRow from '~/components/inflow-igp-row';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
import { useToast } from '~/components/ui/use-toast';
import { meta } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';
import { getMonthName } from '~/utils/get-month-name';
import { schemas } from '~/zod-schemas';
import { OrderBy } from '~/zod-schemas/utils';

type CreateInflowIgpRowFSInputs = z.infer<typeof schemas.shared.inflowIgpRowFS.create>;

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.organization(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

export default function AddInflowFinancialStatementPage() {
  const router = useRouter();
  const monthlyId = router.query.monthlyId;
  const inflowIgpId = router.query.inflowIgpId;
  const utils = api.useContext();
  const { toast } = useToast();

  const getMonthNameQuery = api.shared.monthlyFS.get.useQuery({
    where: { id: monthlyId as string },
  });
  const monthly = getMonthNameQuery?.data?.[0];

  const getInflowIgpRowFSQuery = api.shared.inflowIgpRowFS.get.useQuery({
    where: { inflowIGPId: inflowIgpId as string },
    orderBy: { date: OrderBy.ASC },
  });
  const inflowIgpRowFS = getInflowIgpRowFSQuery?.data;

  const getReportSemQuery = api.shared.reportSemester.get.useQuery();
  const reportSem = getReportSemQuery?.data;

  const createInflowIgpRowFSForm = useForm<CreateInflowIgpRowFSInputs>({
    resolver: zodResolver(schemas.shared.inflowIgpRowFS.create),
    // These values are for the initial data of input fields, mostly used for 'edit/update' forms like this one
    values: {
      date: new Date().toISOString().split('T')[0] ?? '',
      monthlyId: monthlyId as string,
      inflowIGPId: inflowIgpId as string,
      particulars: 'Item',
      ORNumber: '00',
      price: 0,
      quantity: 0,
      unit: 'pc/s',
    },
  });

  const createInflowIgpRowFS = api.shared.inflowIgpRowFS.create.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async ({ id }) => {
      toast({ variant: 'c-primary', description: '✔️ FS Inflow Igp created successfully.' });
      await utils.shared.inflowIgpRowFS.invalidate();
    },
    // This is the callback function after failed backend execution. This is mostly used for 'unique' data conflict errors like unique email, etc.
    onError: () => {
      toast({
        variant: 'destructive',
        title: '❌ Internal Server Error',
        description: 'Creating of FS Inflow Igp failed.',
      });
    },
  });

  const onSubmitCreateInflowIgpFS: SubmitHandler<CreateInflowIgpRowFSInputs> = (values) => {
    if (createInflowIgpRowFS.isLoading) {
      return;
    }
    createInflowIgpRowFS.mutate(values);
  };

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
          <div className="mb-4 text-4xl font-bold">Inflow - Income Generating Project</div>
          <div className="text-medium text-lg capitalize">
            {reportSem?.term.toLowerCase()} Semester - {getMonthName(monthly?.month as number)}
          </div>

          {/* TABLE */}
          <div className="mt-4 flex min-h-[60vh] w-full flex-col gap-2 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <form
              className="flex justify-end gap-2"
              onSubmit={createInflowIgpRowFSForm.handleSubmit(onSubmitCreateInflowIgpFS, (error) =>
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
                <div className="w-[10%] p-1 text-center text-lg font-bold text-white ">Date</div>
                <div className="w-[10%] p-1 text-center text-lg font-bold text-white ">
                  Quantity
                </div>
                <div className="w-[15%] p-1 text-center text-lg font-bold text-white ">
                  Particulars
                </div>
                <div className="w-[10%] p-1 text-center text-lg font-bold text-white ">OR No.</div>
                <div className="w-[10%] p-1 text-center text-lg font-bold text-white ">Unit</div>
                <div className="w-[10%] p-1 text-center text-lg font-bold text-white ">Price</div>
                <div className="w-[10%] p-1 text-center text-lg font-bold text-white ">Amount</div>
                <div className="w-[15%] p-1 text-center text-lg font-bold text-white ">Receipt</div>
                <div className="w-[10%] p-1 text-center text-lg font-bold text-white ">Action</div>
              </div>
              {inflowIgpRowFS?.map((inflowIgpRow, index) => (
                <InflowIgpRow inflowIgpRow={inflowIgpRow} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
