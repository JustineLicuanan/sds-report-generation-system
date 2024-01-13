import { zodResolver } from '@hookform/resolvers/zod';
import { OrganizationCategory } from '@prisma/client';
import { Loader2, Trash2, Users } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import { CldImage } from 'next-cloudinary';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useFieldArray, useForm, type SubmitHandler } from 'react-hook-form';
import { type z } from 'zod';

import AdminNavbar from '~/components/admin-navigation-bar';
import AdminSidebarMenu from '~/components/admin-side-bar-menu';
import { PositionSelect } from '~/components/position-select';
import { Button, buttonVariants } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Separator } from '~/components/ui/separator';
import { Textarea } from '~/components/ui/textarea';
import { useToast } from '~/components/ui/use-toast';
import { ResourceType, UploadButton, type OnSuccessUpload } from '~/components/upload-button';
import { meta, paths } from '~/meta';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { authRedirects } from '~/utils/auth-redirects';
import { orgSchemas } from '~/zod-schemas/admin/org';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.admin(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

type CreateOrganizationInputs = z.infer<typeof orgSchemas.create>;

export default function CreateOrganizationPage() {
  const router = useRouter();
  const utils = api.useContext();
  const { toast } = useToast();

  const createOrganizationForm = useForm<CreateOrganizationInputs>({
    resolver: zodResolver(orgSchemas.create),
    defaultValues: {
      name: '',
      acronym: '',
      description: '',
      adviser1: '',
      adviser2: '',
      deptChairperson: '',
      category: OrganizationCategory.STUDENT_GOVERNING_BODY,
      members: [{ email: '', name: '', isActive: true }],
    },
  });

  const membersFieldArray = useFieldArray({
    name: 'members',
    control: createOrganizationForm.control,
  });

  const createOrganization = api.admin.org.create.useMutation({
    onSuccess: async ({ id }) => {
      toast({ variant: 'c-primary', description: '✔️ Organization has been created.' });
      await utils.admin.org.invalidate();
      await router.push(`${paths.ADMIN}${paths.ORGANIZATIONS}/${id}`);
    },
    onError: (error, variables) => {
      if (error.data?.code === 'CONFLICT') {
        const idx = variables.members.findIndex(({ email }) => error.message === email);
        createOrganizationForm.setError(`members.${idx}.email`, {
          message: 'Email is already taken',
        });
      } else {
        toast({
          variant: 'destructive',
          title: '❌ Internal Server Error',
          description: 'Creation of organization failed.',
        });
      }
    },
  });

  const onSuccessUpload: OnSuccessUpload = (result) => {
    createOrganizationForm.setValue('image', result.info?.secure_url);
    createOrganizationForm.setValue('imageId', result.info?.public_id);
  };

  const onSubmitCreateOrganization: SubmitHandler<CreateOrganizationInputs> = (values) => {
    if (createOrganization.isLoading || createOrganization.isSuccess) return;

    createOrganization.mutate(values);
  };

  return (
    <>
      <Head>
        <title>{`Create an Organization ${meta.SEPARATOR} ${meta.NAME}`}</title>
      </Head>

      <div className="relative flex min-h-screen flex-col">
        <AdminNavbar />

        <div className="flex flex-1">
          <AdminSidebarMenu />

          <main className="flex-1 pb-24">
            <Form {...createOrganizationForm}>
              <form
                className="container flex max-w-screen-lg flex-col justify-center gap-4 px-4 py-6 md:px-8"
                onSubmit={createOrganizationForm.handleSubmit(onSubmitCreateOrganization, (err) => {
                  toast({
                    variant: 'destructive',
                    title: '❌ Creation of Organization Failed',
                    description: `${err.members?.root?.message}`,
                  });
                })}
              >
                <header className="flex items-center gap-4 md:gap-2">
                  <Users className="h-8 w-8" />

                  <h1 className="text-3xl font-semibold">Create an Organization</h1>
                </header>

                <Separator />

                <div className="flex flex-col items-center justify-center gap-2">
                  {createOrganizationForm.watch('imageId') ? (
                    <CldImage
                      width="96"
                      height="96"
                      src={createOrganizationForm.watch('imageId')!}
                      alt="Organization Logo"
                      className="rounded-full"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-c-primary text-c-secondary">
                      <Users className="h-16 w-16" />
                    </div>
                  )}

                  <UploadButton
                    className={buttonVariants({ variant: 'c-secondary' })}
                    folder="org-logos"
                    resourceType={ResourceType.IMAGE}
                    onSuccess={onSuccessUpload}
                    disabled={createOrganization.isLoading || createOrganization.isSuccess}
                  >
                    Upload
                  </UploadButton>
                </div>

                <FormField
                  control={createOrganizationForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Name of the organization"
                          disabled={createOrganization.isLoading || createOrganization.isSuccess}
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
                  control={createOrganizationForm.control}
                  name="acronym"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Acronym (e.g.: BITS)"
                          disabled={createOrganization.isLoading || createOrganization.isSuccess}
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
                  control={createOrganizationForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          rows={6}
                          placeholder="Description (Optional)"
                          className="resize-none"
                          disabled={createOrganization.isLoading || createOrganization.isSuccess}
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
                  control={createOrganizationForm.control}
                  name="adviser1"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Organization Adviser 1 (Optional)"
                          disabled={createOrganization.isLoading || createOrganization.isSuccess}
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
                  control={createOrganizationForm.control}
                  name="adviser2"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Organization Adviser 2 (Optional)"
                          disabled={createOrganization.isLoading || createOrganization.isSuccess}
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
                  control={createOrganizationForm.control}
                  name="deptChairperson"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Department Chairperson (Optional)"
                          disabled={createOrganization.isLoading || createOrganization.isSuccess}
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
                  control={createOrganizationForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="flex flex-wrap items-center gap-2 space-y-0 pb-6 md:gap-4">
                      <FormLabel>Category:</FormLabel>

                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-wrap items-center gap-2 md:gap-6"
                          disabled={createOrganization.isLoading || createOrganization.isSuccess}
                        >
                          {Object.values(OrganizationCategory).map((value) => (
                            <FormItem key={value} className="flex items-center gap-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={value} />
                              </FormControl>

                              <FormLabel className="font-normal capitalize">
                                {value.replace(/_/g, ' ').toLowerCase()}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <h2 className="text-xl font-semibold">Members:</h2>

                {membersFieldArray.fields.map((field, idx) => (
                  <div key={field.id}>
                    <div className="flex flex-wrap gap-2 md:flex-nowrap">
                      <div className="flex w-full flex-col justify-center gap-1 md:flex-1">
                        <Input
                          type="email"
                          placeholder="e.g.: juan.delacruz@cvsu.edu.ph"
                          className="flex-auto md:flex-1"
                          disabled={createOrganization.isLoading || createOrganization.isSuccess}
                          {...createOrganizationForm.register(`members.${idx}.email`)}
                        />

                        <p className="h-4 text-sm font-medium text-destructive">
                          {createOrganizationForm.formState.errors.members?.[idx]?.email?.message}
                        </p>
                      </div>

                      <div className="flex flex-col justify-center gap-1">
                        <PositionSelect
                          setValue={(value) => {
                            createOrganizationForm.setValue(`members.${idx}.name`, value);
                          }}
                          disabled={createOrganization.isLoading || createOrganization.isSuccess}
                        />

                        <p className="h-4 text-sm font-medium text-destructive">
                          {createOrganizationForm.formState.errors.members?.[idx]?.name?.message}
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => membersFieldArray.remove(idx)}
                        disabled={
                          membersFieldArray.fields.length === 1 ||
                          createOrganization.isLoading ||
                          createOrganization.isSuccess
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="c-secondary"
                  onClick={() => membersFieldArray.append({ email: '', name: '', isActive: true })}
                  disabled={createOrganization.isLoading || createOrganization.isSuccess}
                >
                  Add a Member
                </Button>

                <Button
                  type="submit"
                  variant="c-primary"
                  disabled={createOrganization.isLoading || createOrganization.isSuccess}
                >
                  {createOrganization.isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}{' '}
                  Create an Organization
                </Button>
              </form>
            </Form>
          </main>
        </div>
      </div>
    </>
  );
}
