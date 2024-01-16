import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useFieldArray, useForm, type SubmitHandler } from 'react-hook-form';
import { type z } from 'zod';

import AdminNavbar from '~/components/admin-navigation-bar';
import AdminSidebarMenu from '~/components/admin-side-bar-menu';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Separator } from '~/components/ui/separator';
import { useToast } from '~/components/ui/use-toast';
import { meta } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';
import { schemas } from '~/zod-schemas';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.admin(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

type UpdateReportSignatoryInputs = z.infer<typeof schemas.admin.reportSignatory.update>;

export default function ReportSettingsPage() {
  const utils = api.useContext();
  const { toast } = useToast();

  const getReportSignatory = api.admin.reportSignatory.get.useQuery();
  const reportSignatory = getReportSignatory.data;

  const updateReportSignatoryForm = useForm<UpdateReportSignatoryInputs>({
    resolver: zodResolver(schemas.admin.reportSignatory.update),
    values: { signatories: reportSignatory ?? [] },
  });

  const signatoriesFieldArray = useFieldArray({
    name: 'signatories',
    control: updateReportSignatoryForm.control,
  });

  const updateReportSignatory = api.admin.reportSignatory.update.useMutation({
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ Report Signatory has been updated.' });
      await utils.admin.reportSignatory.invalidate();
    },
  });

  const onSubmitUpdateReportSignatory: SubmitHandler<UpdateReportSignatoryInputs> = (values) => {
    if (updateReportSignatory.isLoading) return;

    updateReportSignatory.mutate(values);
  };

  return (
    <>
      <Head>
        <title>{`Report Signatory Settings ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      <div className="relative flex min-h-screen flex-col">
        <AdminNavbar />

        <div className="flex flex-1">
          <AdminSidebarMenu />

          <main className="flex-1 pb-24">
            <Form {...updateReportSignatoryForm}>
              <form
                className="container flex max-w-screen-lg flex-col justify-center gap-4 px-4 py-6 md:px-8"
                onSubmit={updateReportSignatoryForm.handleSubmit(
                  onSubmitUpdateReportSignatory,
                  (err) => {
                    console.error(err);
                  }
                )}
              >
                <header className="flex items-center gap-4 md:gap-2">
                  <h1 className="text-3xl font-semibold">✍️ Report Signatory Settings</h1>
                </header>

                <Separator />

                {signatoriesFieldArray.fields.map((field, idx) => (
                  <div key={field.id}>
                    <Label htmlFor={field.position} className="font-semibold">
                      {field.position}:
                    </Label>

                    <Input
                      id={field.position}
                      placeholder={field.position}
                      disabled={updateReportSignatory.isLoading}
                      {...updateReportSignatoryForm.register(`signatories.${idx}.name`)}
                    />

                    <p className="h-4 text-sm font-medium text-destructive">
                      {updateReportSignatoryForm.formState.errors.signatories?.[idx]?.name?.message}
                    </p>
                  </div>
                ))}

                <Button
                  type="submit"
                  variant="c-primary"
                  disabled={updateReportSignatory.isLoading}
                >
                  {updateReportSignatory.isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}{' '}
                  Save changes
                </Button>
              </form>
            </Form>
          </main>
        </div>
      </div>
    </>
  );
}
