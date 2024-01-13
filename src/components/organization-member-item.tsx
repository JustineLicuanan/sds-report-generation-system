import { zodResolver } from '@hookform/resolvers/zod';
import { type User } from '@prisma/client';
import { Loader2, LogOut, Save, Trash2 } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { type z } from 'zod';

import { PositionSelect } from '~/components/position-select';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { useToast } from '~/components/ui/use-toast';
import { api } from '~/utils/api';
import { userSchemas } from '~/zod-schemas/admin/user';

type Props = { member: User; isOneMember: boolean };
type UpdateMemberInputs = z.infer<typeof userSchemas.update>;

export default function OrganizationMemberItem({ member, isOneMember }: Props) {
  const utils = api.useContext();
  const { toast } = useToast();

  const countSessions = api.admin.session.count.useQuery({ id: member.id });
  const hasSessions = !!countSessions.data?.[0]?._count.sessions;

  const updateMemberForm = useForm<UpdateMemberInputs>({
    resolver: zodResolver(userSchemas.update),
    defaultValues: {
      id: member.id,
      name: member.name,
      email: member.email,
      isActive: member.isActive,
    },
  });

  const updateMemberFormNameFieldIsDirty =
    updateMemberForm.watch('name') !== updateMemberForm.formState.defaultValues?.name;

  const updateMember = api.admin.user.update.useMutation({
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ Member has been updated.' });
      await utils.admin.org.invalidate();
    },
    onError: (error) => {
      if (error.data?.code === 'CONFLICT') {
        updateMemberForm.setError('email', { message: 'Email is already taken' });
      } else {
        toast({
          variant: 'destructive',
          title: '❌ Internal Server Error',
          description: 'Updating of member failed.',
        });
      }
    },
  });

  const removeMember = api.admin.user.remove.useMutation({
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ Member has been removed.' });
      await utils.admin.org.invalidate();
    },
  });

  const deleteAllSessions = api.admin.session.deleteAll.useMutation({
    onSuccess: async () => {
      toast({ variant: 'c-primary', description: '✔️ Member has been signed out to all devices.' });
      await utils.admin.org.invalidate();
    },
  });

  const onSubmitUpdateMember: SubmitHandler<UpdateMemberInputs> = (values) => {
    if (
      (!updateMemberForm.formState.isDirty && !updateMemberFormNameFieldIsDirty) ||
      updateMember.isLoading ||
      removeMember.isLoading ||
      removeMember.isSuccess
    )
      return;

    updateMember.mutate(values);
  };

  return (
    <Form {...updateMemberForm}>
      <form
        className="flex flex-wrap gap-2 md:flex-nowrap"
        onSubmit={updateMemberForm.handleSubmit(onSubmitUpdateMember)}
      >
        <div className="flex w-full flex-col justify-center gap-1 md:flex-1">
          <Input
            type="email"
            placeholder="e.g.: juan.delacruz@cvsu.edu.ph"
            className="flex-auto md:flex-1"
            disabled={updateMember.isLoading || removeMember.isLoading || removeMember.isSuccess}
            {...updateMemberForm.register('email')}
          />

          <p className="h-4 text-sm font-medium text-destructive">
            {updateMemberForm.formState.errors.email?.message}
          </p>
        </div>

        <div className="flex flex-col justify-center gap-1">
          <PositionSelect
            controlledValue={member.name}
            setValue={(value) => updateMemberForm.setValue('name', value)}
            disabled={updateMember.isLoading || removeMember.isLoading || removeMember.isSuccess}
          />

          <p className="h-4 text-sm font-medium text-destructive">
            {updateMemberForm.formState.errors.name?.message}
          </p>
        </div>

        <div className="flex flex-wrap gap-1">
          <Button
            type="submit"
            variant="c-primary"
            size="icon"
            disabled={
              (!updateMemberForm.formState.isDirty && !updateMemberFormNameFieldIsDirty) ||
              updateMember.isLoading ||
              removeMember.isLoading ||
              removeMember.isSuccess
            }
          >
            {updateMember.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => deleteAllSessions.mutate({ id: member.id })}
            disabled={!hasSessions || deleteAllSessions.isLoading}
          >
            {deleteAllSessions.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => removeMember.mutate({ id: member.id })}
            disabled={
              isOneMember ||
              updateMember.isLoading ||
              removeMember.isLoading ||
              removeMember.isSuccess
            }
          >
            {removeMember.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
