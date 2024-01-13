import { zodResolver } from '@hookform/resolvers/zod';
import { OrganizationCategory } from '@prisma/client';
import { Loader2, Users } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import { CldImage } from 'next-cloudinary';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { type z } from 'zod';

import AdminNavbar from '~/components/admin-navigation-bar';
import AdminSidebarMenu from '~/components/admin-side-bar-menu';
import OrganizationMemberItem from '~/components/organization-member-item';
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
import { userSchemas } from '~/zod-schemas/admin/user';

export const getServerSideProps = (async (ctx) => {
  const authSession = await getServerAuthSession(ctx);
  const authRedirect = authRedirects.admin(authSession);

  // if(!authRedirect.props) {
  //   return authRedirect;
  // }

  return authRedirect;
}) satisfies GetServerSideProps;

type UpdateOrganizationInputs = z.infer<typeof orgSchemas.update>;
type AddMemberInputs = z.infer<typeof userSchemas.create>;

export default function UpdateOrganizationPage() {
  const router = useRouter();
  const utils = api.useContext();
  const { toast } = useToast();

  const getOrganization = api.admin.org.get.useQuery({
    id: router.query.id as string,
    includeMembers: true,
  });
  const organization = getOrganization.data?.[0];

  const updateOrganizationForm = useForm<UpdateOrganizationInputs>({
    resolver: zodResolver(orgSchemas.update),
    values: {
      id: router.query.id as string,
      name: organization?.name ?? '',
      acronym: organization?.acronym ?? '',
      description: organization?.description ?? '',
      category: organization?.category,
      image: organization?.image,
      imageId: organization?.imageId,
    },
  });

  const updateOrganizationFormImageIdFieldIsDirty =
    updateOrganizationForm.watch('imageId') !==
    updateOrganizationForm.formState.defaultValues?.imageId;

  const updateOrganization = api.admin.org.update.useMutation({
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ Organization has been updated.' });
      await utils.admin.org.invalidate();
    },
  });

  const addMemberForm = useForm<AddMemberInputs>({
    resolver: zodResolver(userSchemas.create),
    values: {
      name: '',
      email: '',
      isActive: true,
      organization: { id: router.query.id as string, name: organization?.name ?? '' },
    },
  });

  const addMember = api.admin.user.create.useMutation({
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ Member has been added.' });
      addMemberForm.reset(undefined, { keepDefaultValues: true });
      await utils.admin.org.invalidate();
    },
    onError: (error) => {
      if (error.data?.code === 'CONFLICT') {
        addMemberForm.setError('email', { message: 'Email is already taken' });
      } else {
        toast({
          variant: 'destructive',
          title: '❌ Internal Server Error',
          description: 'Adding of member failed.',
        });
      }
    },
  });

  const onSuccessUpload: OnSuccessUpload = (result) => {
    updateOrganizationForm.setValue('image', result.info?.secure_url);
    updateOrganizationForm.setValue('imageId', result.info?.public_id);
  };

  const onSubmitUpdateOrganization: SubmitHandler<UpdateOrganizationInputs> = (values) => {
    if (
      (!updateOrganizationForm.formState.isDirty && !updateOrganizationFormImageIdFieldIsDirty) ||
      updateOrganization.isLoading
    )
      return;

    updateOrganization.mutate(values);
  };

  const onSubmitAddMember: SubmitHandler<AddMemberInputs> = (values) => {
    if (addMember.isLoading) return;

    addMember.mutate(values);
  };

  return (
    <>
      <Head>
        <title>{`Edit Organization: ${organization?.acronym ?? ''} ${meta.SEPARATOR} ${
          meta.NAME
        }`}</title>
      </Head>

      <div className="relative flex min-h-screen flex-col">
        <AdminNavbar />

        <div className="flex flex-1">
          <AdminSidebarMenu />

          <main className="flex-1 pb-24">
            <Form {...updateOrganizationForm}>
              <form
                className="container flex max-w-screen-lg flex-col justify-center gap-4 px-4 py-6 md:px-8"
                onSubmit={updateOrganizationForm.handleSubmit(onSubmitUpdateOrganization)}
              >
                <header className="flex items-center gap-4 md:gap-2">
                  <Users className="h-8 w-8" />

                  <h1 className="text-3xl font-semibold">
                    Edit Organization:{' '}
                    <Link
                      href={`${paths.ADMIN}${paths.ORGANIZATIONS}/${router.query.id as string}`}
                      className="text-c-primary hover:underline"
                    >
                      {organization?.acronym}
                    </Link>
                  </h1>
                </header>

                <Separator />

                <div className="flex flex-col items-center justify-center gap-2">
                  {updateOrganizationForm.watch('imageId') ? (
                    <CldImage
                      width="96"
                      height="96"
                      src={updateOrganizationForm.watch('imageId')!}
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
                    disabled={updateOrganization.isLoading}
                  >
                    Upload
                  </UploadButton>
                </div>

                <FormField
                  control={updateOrganizationForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Name of the organization"
                          disabled={updateOrganization.isLoading}
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
                  control={updateOrganizationForm.control}
                  name="acronym"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Acronym (e.g.: BITS)"
                          disabled={updateOrganization.isLoading}
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
                  control={updateOrganizationForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          rows={6}
                          placeholder="Description"
                          className="resize-none"
                          disabled={updateOrganization.isLoading}
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
                  control={updateOrganizationForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="flex flex-wrap items-center gap-2 space-y-0 pb-6 md:gap-4">
                      <FormLabel>Category:</FormLabel>

                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-wrap items-center gap-2 md:gap-6"
                          disabled={updateOrganization.isLoading}
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

                <Button
                  type="submit"
                  variant="c-primary"
                  disabled={
                    (!updateOrganizationForm.formState.isDirty &&
                      !updateOrganizationFormImageIdFieldIsDirty) ||
                    updateOrganization.isLoading
                  }
                >
                  {updateOrganization.isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}{' '}
                  Save changes
                </Button>
              </form>
            </Form>

            <section className="container max-w-screen-lg px-4 md:px-8">
              <Separator />
            </section>

            <Form {...addMemberForm}>
              <form
                className="container flex max-w-screen-lg flex-col justify-center gap-4 px-4 py-6 md:px-8"
                onSubmit={addMemberForm.handleSubmit(onSubmitAddMember)}
              >
                <h2 className="text-xl font-semibold">Add a Member:</h2>

                <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">
                  <div className="flex w-full flex-col justify-center gap-1">
                    <Input
                      type="email"
                      placeholder="e.g.: juan.delacruz@cvsu.edu.ph"
                      className="flex-auto md:flex-1"
                      disabled={addMember.isLoading}
                      {...addMemberForm.register('email')}
                    />

                    <p className="h-4 text-sm font-medium text-destructive">
                      {addMemberForm.formState.errors.email?.message}
                    </p>
                  </div>

                  <div className="flex flex-col justify-center gap-1">
                    <PositionSelect
                      setValue={(value) => addMemberForm.setValue('name', value)}
                      disabled={addMember.isLoading}
                    />

                    <p className="h-4 text-sm font-medium text-destructive">
                      {addMemberForm.formState.errors.name?.message}
                    </p>
                  </div>
                </div>

                <Button type="submit" variant="c-secondary" disabled={addMember.isLoading}>
                  {addMember.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Add a
                  Member
                </Button>
              </form>
            </Form>

            <section className="container flex max-w-screen-lg flex-col justify-center gap-4 px-4 py-6 md:px-8">
              <h2 className="text-xl font-semibold">{organization?.acronym} Members</h2>

              <div className="flex flex-col justify-center gap-4">
                {organization?.members.map((member) => (
                  <OrganizationMemberItem
                    key={member.id}
                    member={member}
                    isOneMember={organization?.members.length === 1}
                  />
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
