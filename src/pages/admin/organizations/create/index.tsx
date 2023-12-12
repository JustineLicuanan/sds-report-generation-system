import { zodResolver } from '@hookform/resolvers/zod';
import { OrganizationCategory } from '@prisma/client';
import { Loader2, Trash2, Users } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import { CldImage } from 'next-cloudinary';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useFieldArray, useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import { type z } from 'zod';

import AdminNavbar from '~/components/admin-navigation-bar';
import AdminSidebarMenu from '~/components/admin-side-bar-menu';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Separator } from '~/components/ui/separator';
import { Textarea } from '~/components/ui/textarea';
import { ResourceType, UploadButton, type OnSuccessUpload } from '~/components/upload-button';
import { UserPosition } from '~/enums/user-position';
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

  const [isOther, setIsOther] = useState(false);

  const createOrganizationForm = useForm<CreateOrganizationInputs>({
    resolver: zodResolver(orgSchemas.create),
    defaultValues: {
      name: '',
      description: '',
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
      toast.success('Organization has been created.');
      await utils.admin.org.invalidate();
      await router.push(`${paths.ADMIN}${paths.ORGANIZATIONS}/${id}`);
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
                onSubmit={createOrganizationForm.handleSubmit(onSubmitCreateOrganization)}
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          rows={6}
                          placeholder="Description"
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
                    <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">
                      <Input
                        type="email"
                        placeholder="e.g.: juan.delacruz@cvsu.edu.ph"
                        className="flex-auto md:flex-1"
                        disabled={createOrganization.isLoading || createOrganization.isSuccess}
                        {...createOrganizationForm.register(`members.${idx}.email`)}
                      />

                      <Select
                        onValueChange={(value) => {
                          if (value === 'other') {
                            setIsOther(() => true);
                            createOrganizationForm.setValue(`members.${idx}.name`, '');
                            return;
                          }

                          setIsOther(() => false);
                          createOrganizationForm.setValue(`members.${idx}.name`, value);
                        }}
                        disabled={createOrganization.isLoading || createOrganization.isSuccess}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a position" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Positions</SelectLabel>

                            {Object.values(UserPosition).map((position) => (
                              <SelectItem key={position} value={position}>
                                {position}
                              </SelectItem>
                            ))}

                            <SelectItem value="other">Other</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      <Input
                        placeholder="e.g.: President"
                        className="w-32"
                        disabled={
                          !isOther || createOrganization.isLoading || createOrganization.isSuccess
                        }
                        {...createOrganizationForm.register(`members.${idx}.name`)}
                      />

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

                    <p className="h-4 text-sm font-medium text-destructive">
                      {createOrganizationForm.formState.errors.members?.[idx]?.email?.message ??
                        createOrganizationForm.formState.errors.members?.[idx]?.name?.message}
                    </p>
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
