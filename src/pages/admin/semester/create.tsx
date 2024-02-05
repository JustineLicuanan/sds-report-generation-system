import { zodResolver } from '@hookform/resolvers/zod';
import { SemesterTerm } from '@prisma/client';
import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import AdminNavbar from '~/components/admin-navigation-bar';
import AdminSidebar from '~/components/admin-side-bar-menu';
import { CustomDialog } from '~/components/custom-dialog';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { useToast } from '~/components/ui/use-toast';
import { meta, paths } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';
import { getYearArray } from '~/utils/get-year-array';
import { schemas } from '~/zod-schemas';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.admin(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

type CreateSemesterInputs = z.infer<typeof schemas.admin.reportSemester.create>;

export default function CreateSemPage() {
  const router = useRouter();
  const utils = api.useContext();
  const { toast } = useToast();

  const getSemester = api.admin.reportSemester.get.useQuery({ current: true });
  const semester = getSemester.data?.[0];

  const createSemesterForm = useForm<CreateSemesterInputs>({
    resolver: zodResolver(schemas.admin.reportSemester.create),
    defaultValues: {
      yearStart: new Date().getFullYear().toString(),
      yearEnd: (new Date().getFullYear() + 1).toString(),
    },
  });

  const createSemester = api.admin.reportSemester.create.useMutation({
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ Semester has been created.' });
      await utils.admin.reportSemester.invalidate();
      router.push(`${paths.ADMIN}`);
    },

    onError: ({ data, message }) => {
      toast({
        variant: 'c-primary',
        title: `${data?.httpStatus} ${data?.code}`,
        description: message,
      });
    },
  });

  const archiveSemester = api.admin.reportSemester.archive.useMutation({
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ Semester has been archived.' });
      await utils.admin.reportSemester.invalidate();
    },
  });

  return (
    <>
      <Head>
        <title>{`Create Semester ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      {/* NAVIGATION BAR */}
      <AdminNavbar />

      <main className="flex">
        {/* SIDE BAR*/}
        <AdminSidebar />

        <div className="container flex max-w-screen-lg flex-col gap-4 px-4 py-6 md:px-8">
          <form
            id="main-content"
            className="mx-4 my-4 w-full"
            onSubmit={createSemesterForm.handleSubmit(
              (values) => {
                if (createSemester.isLoading) return;

                createSemester.mutate(values);
              },
              (err) => console.error(err)
            )}
          >
            <div className="text-2xl font-bold">Create New Semester</div>
            <div className="mt-8 flex flex-col gap-4">
              <div className="flex gap-4">
                <label htmlFor="year-start">Year start:</label>
                <select
                  id="year-start"
                  className="w-full max-w-[12.5rem] rounded-sm border border-input bg-transparent px-1"
                  {...createSemesterForm.register('yearStart')}
                >
                  {getYearArray().map((year) => (
                    <option id={year.toString()} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4">
                <label htmlFor="year-end">Year end:</label>
                <select
                  id="year-end"
                  className="w-full max-w-[12.5rem] rounded-sm border border-input bg-transparent px-1"
                  {...createSemesterForm.register('yearEnd')}
                >
                  {getYearArray().map((year) => (
                    <option id={year.toString()} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4">
                <label htmlFor="term">Term:</label>
                <select
                  id="term"
                  className="w-full max-w-[12.5rem] rounded-sm border border-input bg-transparent px-1 capitalize"
                  {...createSemesterForm.register('term')}
                >
                  {Object.values(SemesterTerm).map((term) => (
                    <option id={term} value={term}>
                      {term.toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4">
                <label htmlFor="dueDateAR">Accomplishment Report Due Date:</label>
                <input
                  type="datetime-local"
                  id="dueDateAR"
                  className="rounded-sm border border-input bg-transparent px-1"
                  {...createSemesterForm.register('dueDateAR')}
                />
              </div>
              <div className="flex gap-4">
                <label htmlFor="dueDateFS">Financial Statement Due Date:</label>
                <input
                  type="datetime-local"
                  id="dueDateFS"
                  className="rounded-sm border border-input bg-transparent px-1"
                  {...createSemesterForm.register('dueDateFS')}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push(`${paths.ADMIN}`)}
                className="mt-4 rounded-sm border border-gray bg-gray px-3 active:scale-95"
              >
                Back
              </button>
              <button
                type="submit"
                className="mt-4 rounded-sm border border-yellow bg-yellow px-3 active:scale-95"
              >
                Create
              </button>
            </div>
          </form>

          <Separator />

          {semester && (
            <CustomDialog
              handleContinue={() => archiveSemester.mutate()}
              emoji="🚨"
              description="This action will archive the semester from our servers."
            >
              <Button variant="destructive" size="lg">
                Archive Current Semester
              </Button>
            </CustomDialog>
          )}

          <Button
            variant="c-secondary"
            size="lg"
            onClick={() => router.push(`${paths.ADMIN}${paths.SEMESTER}`)}
          >
            Semester Archives
          </Button>
        </div>
      </main>
    </>
  );
}
