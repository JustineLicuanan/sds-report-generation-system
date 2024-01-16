import { zodResolver } from '@hookform/resolvers/zod';
import { OutflowFSCategory } from '@prisma/client';
import { Pencil, Trash2 } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { type z } from 'zod';
import OrgNavBar from '~/components/organization-navigation-bar';
import OrganizationSideBarMenu from '~/components/organization-side-bar-menu';
import { useToast } from '~/components/ui/use-toast';
import { meta, paths } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';
import { getMonthName } from '~/utils/get-month-name';
import { schemas } from '~/zod-schemas';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.organization(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

type CreateInflowCollectionFSInputs = z.infer<typeof schemas.shared.inflowCollectionFS.create>;
type CreateFSOutflowInputs = z.infer<typeof schemas.shared.outflowFS.create>;

export default function ModifyFinancialStatementPage() {
  const router = useRouter();
  const monthId = router.query.monthId;
  const utils = api.useContext();
  const { toast } = useToast();

  // const getReportSemQuery = api.shared.reportSemester.get.useQuery();
  // const reportSem = getReportSemQuery?.data;

  const getFSInflowQuery = api.shared.inflowCollectionFS.get.useQuery({
    where: { monthlyId: monthId as string },
  });
  const FSInflow = getFSInflowQuery?.data;

  const getFSOutflowQuery = api.shared.outflowFS.get.useQuery({
    where: { monthlyId: monthId as string },
  });
  const FSOutflow = getFSOutflowQuery?.data;

  const getMonthNameQuery = api.shared.monthlyFS.get.useQuery({
    where: { id: monthId as string },
  });
  const monthly = getMonthNameQuery?.data?.[0];

  const createFSInflowForm = useForm<CreateInflowCollectionFSInputs>({
    resolver: zodResolver(schemas.shared.inflowCollectionFS.create),
    // These values are for the initial data of input fields, mostly used for 'edit/update' forms like this one
    values: {
      date: new Date().toISOString().split('T')[0] ?? '',
      monthlyId: monthId as string,
    },
  });

  const createFSInflow = api.shared.inflowCollectionFS.create.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async ({ id }) => {
      toast({ variant: 'c-primary', description: '✔️ FS Inflow created successfully.' });
      await utils.shared.orgSignatoryInfo.invalidate();
      await router.push(
        `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}/${monthId as string}${
          paths.MODIFY_FINANCIAL_STATEMENT
        }${paths.INFLOWS}/${id}${paths.ADD_INFLOW}`
      );
    },
    // This is the callback function after failed backend execution. This is mostly used for 'unique' data conflict errors like unique email, etc.
    onError: () => {
      toast({
        variant: 'destructive',
        title: '❌ Internal Server Error',
        description: 'Creating of FS Inflow failed.',
      });
    },
  });

  const createFSOutflowForm = useForm<CreateFSOutflowInputs>({
    resolver: zodResolver(schemas.shared.outflowFS.create),
    // These values are for the initial data of input fields, mostly used for 'edit/update' forms like this one
    defaultValues: {
      date: new Date().toISOString().split('T')[0] ?? '',
      monthlyId: monthId as string,
    },
  });

  const createFSOutflow = api.shared.outflowFS.create.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async ({ id }) => {
      toast({ variant: 'c-primary', description: '✔️ FS Outflow created successfully.' });
      await utils.shared.monthlyFS.invalidate();
      await router.push(
        `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}/${monthId as string}${
          paths.MODIFY_FINANCIAL_STATEMENT
        }${paths.OUTFLOWS}/${id}${paths.ADD_OUTFLOW}`
      );
    },
    // This is the callback function after failed backend execution. This is mostly used for 'unique' data conflict errors like unique email, etc.
    onError: () => {
      toast({
        variant: 'destructive',
        title: '❌ Internal Server Error',
        description: 'Creating of FS Outflow failed.',
      });
    },
  });

  // This is the function that will run after clicking submit. Of course, it will NOT run if there are input validation errors like 'required', etc.
  const onSubmitCreateFSInflow: SubmitHandler<CreateInflowCollectionFSInputs> = (values) => {
    if (createFSInflow.isLoading) {
      return;
    }
    createFSInflow.mutate(values);
  };

  const deleteInflowCollection = api.shared.inflowCollectionFS.delete.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ FS Inflow deleted successfully.' });
      await utils.shared.inflowCollectionFS.invalidate();
    },
  });

  const deleteOutflow = api.shared.outflowFS.delete.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ FS Outflow deleted successfully.' });
      await utils.shared.outflowFS.invalidate();
    },
  });

  // const createFSOutflowForm = useForm<CreateFSOutflowInputs>({
  //   resolver: zodResolver(schemas.shared.FSOutflow.create),
  //   // These values are for the initial data of input fields, mostly used for 'edit/update' forms like this one
  //   values: {
  //     date: new Date().toISOString().split('T')[0] ?? '',
  //     monthlyId: monthlyID as string,
  //     reportSemesterId: reportSem?.id as string,
  //     category: 'FOOD_EXPENSE',
  //   },
  // });

  // const createFSOutflow = api.shared.FSOutflow.create.useMutation({
  //   // This is the callback function after successful backend execution
  //   onSuccess: async ({ id }) => {
  //     toast({ variant: 'c-primary', description: '✔️ FS Outflow created successfully.' });
  //     await utils.shared.orgSignatoryInfo.invalidate();
  //     await router.push({
  //       pathname: `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}${paths.FINANCIAL_STATEMENT}/${monthlyID}${paths.MODIFY_FINANCIAL_STATEMENT}${paths.OUTFLOWS}/${id}${paths.ADD_OUTFLOW}`,
  //       query: { monthlyID: monthlyID, FSOutflowID: id },
  //     });
  //   },
  //   // This is the callback function after failed backend execution. This is mostly used for 'unique' data conflict errors like unique email, etc.
  //   onError: () => {
  //     toast({
  //       variant: 'destructive',
  //       title: '❌ Internal Server Error',
  //       description: 'Creating of FS Outflow failed.',
  //     });
  //   },
  // });

  // // This is the function that will run after clicking submit. Of course, it will NOT run if there are input validation errors like 'required', etc.
  // const onSubmitCreateFSOutflow: SubmitHandler<CreateFSOutflowInputs> = (values) => {
  //   if (createFSOutflow.isLoading) {
  //     return;
  //   }
  //   createFSOutflow.mutate(values);
  // };

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
          <div className="mb-4 text-center text-4xl font-bold">
            {getMonthName(monthly?.month as number)} {monthly?.year}
          </div>
          <div className="grid grid-cols-2 grid-rows-4 gap-4">
            {/* INFLOWS */}
            <form
              className="col-span-1 row-span-2 flex justify-between gap-2 rounded-sm p-4 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]"
              onSubmit={createFSInflowForm.handleSubmit(onSubmitCreateFSInflow, (err) => {
                console.error(err);
              })}
            >
              <div className="flex items-center gap-2">
                <div className="text-lg font-bold">Inflow</div>
              </div>

              <select
                className="w-full max-w-[12rem] rounded-sm border border-input capitalize"
                disabled
              >
                <option value="COLLECTION">Collection</option>
              </select>

              <input
                type="date"
                className="rounded-sm border border-input"
                {...createFSInflowForm.register('date')}
              />

              <button
                type="submit"
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Add
              </button>
            </form>

            {/* NET */}
            <div className="col-span-1 row-span-4 flex flex-col justify-between gap-2 rounded-sm p-4 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
              <select name="" id="inflows" className="self-end rounded-sm border p-2">
                <option value="collection">Collection</option>
                <option value="igp">IGP</option>
              </select>
              <div>Net (Gross/Loss): </div>
              <div className="text-center text-4xl font-bold">[Value]</div>
            </div>

            {/* OUTFLOWS */}
            <form
              className="col-span-1 row-span-2 flex justify-between gap-2 rounded-sm p-4 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]"
              onSubmit={createFSOutflowForm.handleSubmit(
                (values) => {
                  if (createFSOutflow.isLoading) return;

                  createFSOutflow.mutate(values);
                },
                (err) => console.error(err)
              )}
            >
              <div className="flex items-center gap-2">
                <div className="text-lg font-bold">Outflow</div>
              </div>

              <select
                className="rounded-sm border border-input capitalize"
                {...createFSOutflowForm.register('category')}
              >
                {Object.values(OutflowFSCategory).map((category) => (
                  <option key={category} value={category}>
                    {category.replace(/_/g, ' ').toLowerCase()}
                  </option>
                ))}
              </select>

              <input
                type="date"
                className="rounded-sm border border-input"
                {...createFSOutflowForm.register('date')}
              />

              <button
                type="submit"
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Add
              </button>
            </form>
          </div>
          {/* TABLE */}
          <div className="mt-4 flex min-h-[40vh] w-full flex-col gap-2 rounded-sm px-4 py-2 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
            <div className="flex justify-end">
              <input
                name="search"
                id="search-item"
                placeholder="Search"
                className="h-7 rounded-l-sm border-[1px] border-green px-2 py-2 outline-none"
              />
              <label
                htmlFor="search-item"
                className="flex h-7 w-11 items-center  rounded-r-sm border-[1px] border-l-0 border-green  px-2"
              >
                <Image
                  width={100}
                  height={100}
                  src="/search_icon.svg"
                  className="md:h-full "
                  alt="Search Icon"
                />
              </label>
            </div>
            <table className="w-full min-w-max border-collapse  border border-black text-center">
              <thead>
                <tr>
                  <th className=" border-r-0 border-black bg-green p-1 text-lg font-bold tracking-tight text-white ">
                    Type
                  </th>
                  <th className=" border-r-0 border-black bg-green p-1 text-lg font-bold tracking-tight text-white ">
                    Category
                  </th>

                  <th className=" border-r-0 border-black bg-green p-1 text-lg font-bold tracking-tight text-white ">
                    Date
                  </th>
                  <th className=" border-r-0 border-black bg-green p-1 text-lg font-bold tracking-tight text-white ">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {FSInflow?.map((FSInflow) => (
                  <tr key={FSInflow.id} className="even:bg-[#808080]/20">
                    <td className="border border-x-0 border-black py-2 text-base">Inflow</td>
                    <td className="border border-x-0 border-black py-2 text-base">Collection</td>
                    <td className="border border-x-0 border-black py-2 text-base">
                      {FSInflow.date.toISOString().split('T')[0]}
                    </td>
                    <td className="border border-x-0 border-black py-2 text-base">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}/${
                                monthId as string
                              }${paths.MODIFY_FINANCIAL_STATEMENT}${paths.INFLOWS}/${FSInflow.id}${
                                paths.ADD_INFLOW
                              }`
                            )
                          }
                          className="rounded-sm border border-yellow bg-yellow p-1 active:scale-95"
                        >
                          <Pencil />
                        </button>
                        <button
                          type="button"
                          className="rounded-sm border border-red bg-red p-1 text-white active:scale-95"
                          onClick={() => deleteInflowCollection.mutate({ id: FSInflow.id })}
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {FSOutflow?.map((outflow) => (
                  <tr key={outflow.id} className="even:bg-[#808080]/20">
                    <td className="border border-x-0 border-black py-2 text-base">Outflow</td>
                    <td className="border border-x-0 border-black py-2 text-base">
                      {outflow.category}
                    </td>
                    <td className="border border-x-0 border-black py-2 text-base">
                      {outflow.date.toISOString().split('T')[0]}
                    </td>
                    <td className="border border-x-0 border-black py-2 text-base">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}/${
                                monthId as string
                              }${paths.MODIFY_FINANCIAL_STATEMENT}${paths.OUTFLOWS}/${outflow.id}${
                                paths.ADD_OUTFLOW
                              }`
                            )
                          }
                          className="rounded-sm border border-yellow bg-yellow p-1 active:scale-95"
                        >
                          <Pencil />
                        </button>
                        <button
                          type="button"
                          className="rounded-sm border border-red bg-red p-1 text-white active:scale-95"
                          onClick={() => deleteOutflow.mutate({ id: outflow.id })}
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
