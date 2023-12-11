import { zodResolver } from '@hookform/resolvers/zod';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { z } from 'zod';

import AdminNavbar from '~/components/admin-navigation-bar';
import AdminSidebarMenu from '~/components/admin-side-bar-menu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Separator } from '~/components/ui/separator';
import { Switch } from '~/components/ui/switch';
import { Textarea } from '~/components/ui/textarea';
import { meta, paths } from '~/meta';
import { api } from '~/utils/api';
import { announcementSchemas } from '~/zod-schemas/admin/announcement';

type CreateAnnouncementInputs = z.infer<typeof announcementSchemas.create>;

export default function CreateAnnouncement() {
  const router = useRouter();
  const utils = api.useContext();

  const getOrganizations = api.admin.org.get.useQuery();

  const options = getOrganizations.data?.map(({ id, name, category }) => ({
    value: id,
    label: name,
    category,
  }));

  const createAnnouncementForm = useForm<CreateAnnouncementInputs>({
    resolver: zodResolver(announcementSchemas.create),
    defaultValues: { subject: '', description: '', hasReport: false, audience: [] },
  });
  // console.log(createAnnouncementForm.watch('audience'));

  const createAnnouncement = api.admin.announcement.create.useMutation({
    onSuccess: async ({ id }) => {
      toast.success('Announcement has been created.');
      await utils.admin.announcement.invalidate();
      router.push(`${paths.ADMIN}${paths.ANNOUNCEMENTS}/#${id}`);
    },
  });

  const onSubmitCreateAnnouncement: SubmitHandler<CreateAnnouncementInputs> = (values) => {
    if (createAnnouncement.isLoading || createAnnouncement.isSuccess) return;

    createAnnouncement.mutate(values);
  };

  return (
    <>
      <Head>
        <title>{`Create an Announcement ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      <div className="relative flex min-h-screen flex-col">
        <AdminNavbar />

        <div className="flex flex-1">
          <AdminSidebarMenu />

          <main className="flex-1 pb-24">
            <Form {...createAnnouncementForm}>
              <form
                className="container flex max-w-screen-lg flex-col justify-center gap-4 px-4 py-6 md:px-8"
                onSubmit={createAnnouncementForm.handleSubmit(onSubmitCreateAnnouncement)}
              >
                <h1 className="text-3xl font-semibold">📣 Create an Announcement</h1>

                <Separator />

                <FormField
                  control={createAnnouncementForm.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Subject"
                          disabled={createAnnouncement.isLoading || createAnnouncement.isSuccess}
                          {...field}
                        />
                      </FormControl>

                      <div className="h-4">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={createAnnouncementForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          rows={6}
                          placeholder="Description"
                          className="resize-none"
                          disabled={createAnnouncement.isLoading || createAnnouncement.isSuccess}
                          {...field}
                        />
                      </FormControl>

                      <div className="h-4">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={createAnnouncementForm.control}
                  name="audience"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0 pb-6">
                      <FormLabel>Audience:</FormLabel>

                      <FormControl>
                        <Select
                          closeMenuOnSelect={false}
                          options={options ?? []}
                          className="w-full"
                          isMulti
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="start-date" className="md:whitespace-nowrap">
                        Start Date:
                      </Label>

                      <Input
                        id="start-date"
                        type="datetime-local"
                        disabled={createAnnouncement.isLoading || createAnnouncement.isSuccess}
                        {...createAnnouncementForm.register('start')}
                      />
                    </div>

                    <p className="h-4 text-sm font-medium text-destructive">
                      {createAnnouncementForm.formState.errors.start?.message}
                    </p>
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="due-date" className="md:whitespace-nowrap">
                        Due Date:
                      </Label>

                      <Input
                        id="due-date"
                        type="datetime-local"
                        disabled={createAnnouncement.isLoading || createAnnouncement.isSuccess}
                        {...createAnnouncementForm.register('due')}
                      />
                    </div>

                    <p className="h-4 text-sm font-medium text-destructive">
                      {createAnnouncementForm.formState.errors.due?.message}
                    </p>
                  </div>
                </div>

                <FormField
                  control={createAnnouncementForm.control}
                  name="hasReport"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0 pb-6">
                      <FormLabel>Accept Reports:</FormLabel>

                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-c-primary data-[state=unchecked]:bg-c-secondary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </main>
        </div>
      </div>
    </>
  );
}
