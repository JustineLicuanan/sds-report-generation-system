import { zodResolver } from '@hookform/resolvers/zod';
import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import InflowCollectionRow from '~/components/inflow-collection-row';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
import { useToast } from '~/components/ui/use-toast';
import { meta } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';
import { getMonthName } from '~/utils/get-month-name';
import { schemas } from '~/zod-schemas';

type CreateInflowCollectionRowFSInputs = z.infer<
  typeof schemas.shared.inflowCollectionRowFS.create
>;

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
  const inflowCollectionId = router.query.inflowCollectionId;
  const utils = api.useContext();
  const { toast } = useToast();

  const getMonthNameQuery = api.shared.monthlyFS.get.useQuery({
    where: { id: monthlyId as string },
  });
  const monthly = getMonthNameQuery?.data?.[0];

  const getInflowCollectionFSQuery = api.shared.inflowCollectionFS.get.useQuery({
    where: { id: inflowCollectionId as string },
    include: { rows: true },
  });
  const inflowCollectionFS = getInflowCollectionFSQuery?.data?.[0];
  const inflowCollectionRowFS = inflowCollectionFS?.rows;

  const getReportSemQuery = api.shared.reportSemester.get.useQuery();
  const reportSem = getReportSemQuery?.data;

  const createInflowCollectionRowFSForm = useForm<CreateInflowCollectionRowFSInputs>({
    resolver: zodResolver(schemas.shared.inflowCollectionRowFS.create),
    // These values are for the initial data of input fields, mostly used for 'edit/update' forms like this one
    values: {
      date: new Date().toISOString().split('T')[0] ?? '',
      monthlyId: monthlyId as string,
      inflowCollectionId: inflowCollectionId as string,
      name: 'John Doe',
      ORNumber: '00',
      amount: '0',
    },
  });

  const createInflowCollectionRowFS = api.shared.inflowCollectionRowFS.create.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async ({ id }) => {
      toast({ variant: 'c-primary', description: '✔️ FS Inflow Collection created successfully.' });
      await utils.shared.inflowCollectionRowFS.invalidate();
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

  const onSubmitCreateInflowCollectionFS: SubmitHandler<CreateInflowCollectionRowFSInputs> = (
    values
  ) => {
    if (createInflowCollectionRowFS.isLoading) {
      return;
    }
    createInflowCollectionRowFS.mutate(values);
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
          <div className="mb-4 text-4xl font-bold">Inflow - Collection</div>
          <div className="text-medium text-lg capitalize">
            {reportSem?.term.toLowerCase()} Semester - {getMonthName(monthly?.month as number)}
          </div>

          {/* TABLE */}
          <div className="mt-4 flex min-h-[60vh] w-full flex-col gap-2 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <form
              className="flex justify-end gap-2"
              onSubmit={createInflowCollectionRowFSForm.handleSubmit(
                onSubmitCreateInflowCollectionFS,
                (error) => console.log(error)
              )}
            >
              <button
                type="submit"
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Add row
              </button>
              <button
                type="button"
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Done
              </button>
            </form>
            <div>
              <div className="flex w-full border border-black bg-green">
                <div className="w-[20%] p-1 text-center text-lg font-bold text-white ">Date</div>
                <div className="w-[30%] p-1 text-center text-lg font-bold text-white ">Name</div>
                <div className="w-[10%] p-1 text-center text-lg font-bold text-white ">OR No.</div>
                <div className="w-[10%] p-1 text-center text-lg font-bold text-white ">Amount</div>
                <div className="w-[20%] p-1 text-center text-lg font-bold text-white ">Receipt</div>
                <div className="w-[10%] p-1 text-center text-lg font-bold text-white ">Action</div>
              </div>
              {inflowCollectionRowFS?.map((inflowCollectionRow, index) => (
                <InflowCollectionRow inflowCollectionRow={inflowCollectionRow} />
              ))}
              {/* {FSInflowRow?.map((inflowRow, index) => (
                <div key={index} className="flex">
                  <input
                    type="text"
                    name=""
                    id=""
                    className="w-[20%] border p-1 text-center focus:z-10 focus:font-bold"
                  />
                  <input
                    type="text"
                    name=""
                    id=""
                    className="w-[30%] border p-1 text-center focus:z-10 focus:font-bold"
                  />
                  <input
                    type="text"
                    name=""
                    id=""
                    className="w-[10%] border p-1 text-center focus:z-10 focus:font-bold"
                  />
                  <input
                    type="text"
                    name=""
                    id=""
                    className="w-[10%] border p-1 text-center focus:z-10 focus:font-bold"
                  />
                  <div className="flex w-[20%] items-center justify-between border px-4">
                    <div className="flex gap-4">
                      <button
                        type="button"
                        className="rounded-sm border border-yellow bg-yellow px-1 active:scale-95"
                      >
                        Upload
                      </button>
                      {inflowRow.receipt ? (
                        <div className="text-green">
                          <Check />
                        </div>
                      ) : (
                        <div className="text-red">
                          <X />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="my-1 rounded-sm border border-gray bg-gray p-1 active:scale-95"
                      >
                        <Eye />
                      </button>
                    </div>
                  </div>
                  <div className="flex w-[10%] justify-center gap-2 border">
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}/${
                            monthlyId as string
                          }${paths.MODIFY_FINANCIAL_STATEMENT}${paths.INFLOWS}/${inflowId}${
                            paths.COLLECTION_ROW
                          }/${inflowRow.id}${paths.EDIT}`
                        )
                      }
                      className="my-1 rounded-sm border border-gray bg-gray p-1 active:scale-95"
                    >
                      <Pencil />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteFSInflowRow.mutate({ id: inflowRow.id })}
                      className="my-1 rounded-sm border border-red bg-red p-1 text-white active:scale-95"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              ))} */}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
