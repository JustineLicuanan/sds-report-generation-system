import { zodResolver } from '@hookform/resolvers/zod';
import { OutflowFSCategory } from '@prisma/client';
import { Pencil, Trash2 } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
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
type CreateInflowIgpFSInputs = z.infer<typeof schemas.shared.inflowIgpFS.create>;
type CreateOutflowFSInputs = z.infer<typeof schemas.shared.outflowFS.create>;

export default function ModifyFinancialStatementPage() {
  const router = useRouter();
  const monthlyId = router.query.monthlyId;
  const utils = api.useContext();
  const { toast } = useToast();

  // const getReportSemQuery = api.shared.reportSemester.get.useQuery();
  // const reportSem = getReportSemQuery?.data;
  const [selectedFS, setSelectedFS] = useState('inflow-collection');
  const [selectedOutflowFS, setSelectedOutflowFS] = useState('inflow-collection');

  const getMonthNameQuery = api.shared.monthlyFS.get.useQuery({
    where: { id: monthlyId as string },
  });
  const monthly = getMonthNameQuery?.data?.[0];

  const getInflowCollectionFSQuery = api.shared.inflowCollectionFS.get.useQuery({
    where: { monthlyId: monthlyId as string },
  });
  const collectionFS = getInflowCollectionFSQuery?.data;

  const getInflowIgpFSQuery = api.shared.inflowIgpFS.get.useQuery({
    where: { monthlyId: monthlyId as string },
  });
  const IgpFS = getInflowIgpFSQuery?.data;

  const getOutflowFSQuery = api.shared.outflowFS.get.useQuery({
    where: { monthlyId: monthlyId as string },
  });
  const outflowFS = getOutflowFSQuery?.data;

  const createInflowCollectionFSForm = useForm<CreateInflowCollectionFSInputs>({
    resolver: zodResolver(schemas.shared.inflowCollectionFS.create),
    // These values are for the initial data of input fields, mostly used for 'edit/update' forms like this one
    values: {
      date: new Date().toISOString().split('T')[0] ?? '',
      monthlyId: monthlyId as string,
    },
  });

  const createInflowCollectionFS = api.shared.inflowCollectionFS.create.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async ({ id }) => {
      toast({ variant: 'c-primary', description: '✔️ FS Inflow Collection created successfully.' });
      await utils.shared.inflowCollectionFS.invalidate();
      await router.push(
        `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}${paths.MONTHLY}/${monthlyId as string}${
          paths.INFLOW_COLLECTION
        }/${id}`
      );
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

  const createInflowIgpFSForm = useForm<CreateInflowIgpFSInputs>({
    resolver: zodResolver(schemas.shared.inflowIgpFS.create),
    // These values are for the initial data of input fields, mostly used for 'edit/update' forms like this one
    values: {
      date: new Date().toISOString().split('T')[0] ?? '',
      monthlyId: monthlyId as string,
    },
  });

  const createInflowIgpFS = api.shared.inflowIgpFS.create.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async ({ id }) => {
      toast({ variant: 'c-primary', description: '✔️ FS Inflow IGP created successfully.' });
      await utils.shared.inflowIgpFS.invalidate();
      await router.push(
        `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}${paths.MONTHLY}/${monthlyId as string}${
          paths.INFLOW_IGP
        }/${id}`
      );
    },
    // This is the callback function after failed backend execution. This is mostly used for 'unique' data conflict errors like unique email, etc.
    onError: () => {
      toast({
        variant: 'destructive',
        title: '❌ Internal Server Error',
        description: 'Creating of FS Inflow IGP failed.',
      });
    },
  });

  // const createOutflowFSForm = useForm<CreateOutflowFSInputs>({
  //   resolver: zodResolver(schemas.shared.outflowFS.create),
  //   // These values are for the initial data of input fields, mostly used for 'edit/update' forms like this one
  //   defaultValues: {
  //     date: new Date().toISOString().split('T')[0] ?? '',
  //     monthlyId: monthlyId as string,
  //   },
  // });

  // const createOutflowFS = api.shared.outflowFS.create.useMutation({
  //   // This is the callback function after successful backend execution
  //   onSuccess: async ({ id }) => {
  //     toast({ variant: 'c-primary', description: '✔️ FS Outflow created successfully.' });
  //     await utils.shared.monthlyFS.invalidate();
  //     await router.push(
  //       `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}/${monthlyId as string}${
  //         paths.MODIFY_FINANCIAL_STATEMENT
  //       }${paths.OUTFLOWS}/${id}${paths.ADD_OUTFLOW}`
  //     );
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

  // This is the function that will run after clicking submit. Of course, it will NOT run if there are input validation errors like 'required', etc.
  const onSubmitCreateInflowCollectionFS: SubmitHandler<CreateInflowCollectionFSInputs> = (
    values
  ) => {
    if (createInflowCollectionFS.isLoading) {
      return;
    }
    createInflowCollectionFS.mutate(values);
  };

  const onSubmitCreateInflowIgpFS: SubmitHandler<CreateInflowIgpFSInputs> = (values) => {
    if (createInflowIgpFS.isLoading) {
      return;
    }
    createInflowIgpFS.mutate(values);
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

  const createOutflowFSForm = useForm<CreateOutflowFSInputs>({
    resolver: zodResolver(schemas.shared.outflowFS.create),
    // These values are for the initial data of input fields, mostly used for 'edit/update' forms like this one
    values: {
      date: new Date().toISOString().split('T')[0] ?? '',
      monthlyId: monthlyId as string,
      category: selectedOutflowFS,
    },
  });

  const createOutflowFS = api.shared.outflowFS.create.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async ({ id }) => {
      toast({ variant: 'c-primary', description: '✔️ FS Outflow created successfully.' });
      await utils.shared.outflowFS.invalidate();
      await router.push(
        `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}${paths.MONTHLY}/${monthlyId as string}${
          paths.OUTFLOW
        }/${id}`
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
  const onSubmitCreateOutflowFS: SubmitHandler<CreateOutflowFSInputs> = (values) => {
    if (createOutflowFS.isLoading) {
      return;
    }
    createOutflowFS.mutate(values);
  };

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
          <div className="mx-auto my-0 flex max-w-screen-lg justify-end gap-5 rounded-sm px-4 py-2">
            <form
              className="flex  items-center gap-4"
              onSubmit={
                selectedFS === 'inflow-collection'
                  ? createInflowCollectionFSForm.handleSubmit(
                      onSubmitCreateInflowCollectionFS,
                      (error) => console.log(error)
                    )
                  : selectedFS === 'inflow-igp'
                  ? createInflowIgpFSForm.handleSubmit(onSubmitCreateInflowIgpFS, (error) =>
                      console.log(error)
                    )
                  : createOutflowFSForm.handleSubmit(onSubmitCreateOutflowFS, (error) =>
                      console.log(error)
                    )
              }
            >
              <select
                name=""
                id="generate-fs-row"
                className="border-sm relative flex items-center justify-between  gap-4 border border-input bg-transparent px-4 py-2"
                onChange={(e) => setSelectedFS(e.target.value)}
                value={selectedFS}
              >
                <option value="inflow-collection">Inflow - Collection</option>
                <option value="inflow-igp">Inflow - IGP</option>
                <option value="outflow">Outflow</option>
              </select>
              {selectedFS === 'outflow' && (
                <select
                  name=""
                  id="generate-fs-row"
                  className="border-sm relative flex items-center justify-between  gap-4 border  border-input bg-transparent px-4 py-2 capitalize"
                  onChange={(e) => setSelectedOutflowFS(e.target.value)}
                  value={selectedOutflowFS}
                >
                  {Object.values(OutflowFSCategory).map((outflowCategory, index) => (
                    <option key={index} value={outflowCategory} className="capitalize">
                      {outflowCategory.toLowerCase().replace(/_/, ' ')}
                    </option>
                  ))}
                </select>
              )}

              <button
                type="submit"
                className="rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Generate
              </button>
            </form>
          </div>
          {/* TABLE */}
          <div className="mx-auto mt-4 flex min-h-[50vh] max-w-screen-lg flex-col gap-2 rounded-sm p-4 shadow-[0_1px_5px_0px_rgba(0,0,0,0.50)]">
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
                {collectionFS?.map((collectionFS) => (
                  <tr key={collectionFS.id} className="even:bg-[#808080]/20">
                    <td className="border border-x-0 border-black py-2 text-base">Inflow</td>
                    <td className="border border-x-0 border-black py-2 text-base">Collection</td>
                    <td className="border border-x-0 border-black py-2 text-base">
                      {collectionFS.date.toISOString().split('T')[0]}
                    </td>
                    <td className="border border-x-0 border-black py-2 text-base">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}${paths.MONTHLY}/${monthlyId}${paths.INFLOW_COLLECTION}/${collectionFS.id}`
                            )
                          }
                          className="rounded-sm border border-yellow bg-yellow p-1 active:scale-95"
                        >
                          <Pencil />
                        </button>
                        <button
                          type="button"
                          className="rounded-sm border border-red bg-red p-1 text-white active:scale-95"
                          onClick={() => deleteInflowCollection.mutate({ id: collectionFS.id })}
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {IgpFS?.map((IgpFS) => (
                  <tr key={IgpFS.id} className="even:bg-[#808080]/20">
                    <td className="border border-x-0 border-black py-2 text-base">Inflow</td>
                    <td className="border border-x-0 border-black py-2 text-base">IGP</td>
                    <td className="border border-x-0 border-black py-2 text-base">
                      {IgpFS.date.toISOString().split('T')[0]}
                    </td>
                    <td className="border border-x-0 border-black py-2 text-base">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}/${
                                monthlyId as string
                              }${paths.MODIFY_FINANCIAL_STATEMENT}${paths.INFLOWS}/${IgpFS.id}${
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
                          onClick={() => deleteInflowCollection.mutate({ id: IgpFS.id })}
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {outflowFS?.map((outflow) => (
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
                                monthlyId as string
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
