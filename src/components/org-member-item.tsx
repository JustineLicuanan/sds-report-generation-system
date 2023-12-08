import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import Image from 'next/image';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { UserPosition } from '~/enums/user-position';
import { api } from '~/utils/api';
import { userSchemas } from '~/zod-schemas/admin/user';

type UpdateMemberInputs = z.infer<typeof userSchemas.update>;
type Props = {
  member: User;
  orgId: string;
  setSuccessAlert: (value: React.SetStateAction<boolean>) => void;
};

export function OrgMemberItem({ member, orgId, setSuccessAlert }: Props) {
  const utils = api.useContext();
  const [isOther, setIsOther] = useState(
    () => !Object.values(UserPosition).includes(member.name as UserPosition)
  );

  const countUserSessionsQuery = api.admin.user.countSessions.useQuery({ id: member.id });

  const updateMemberForm = useForm<UpdateMemberInputs>({
    resolver: zodResolver(userSchemas.update),
    defaultValues: { id: member.id, name: member.name, email: member.email },
  });

  const isUpdateMemberFormDisabled =
    updateMemberForm.formState.defaultValues?.name === updateMemberForm.watch('name') &&
    updateMemberForm.formState.defaultValues?.email === updateMemberForm.watch('email');

  const updateMemberMutation = api.admin.user.update.useMutation({
    onSuccess: async () => {
      await utils.admin.org.get.invalidate({ id: orgId, includeMembers: true });
      setSuccessAlert(true);
    },
  });

  const removeMemberMutation = api.admin.user.remove.useMutation({
    onSuccess: async () => {
      await utils.admin.org.get.invalidate({ id: orgId, includeMembers: true });
      setSuccessAlert(true);
    },
  });

  const clearAllUserSessionsMutation = api.admin.user.clearAllSessions.useMutation({
    onSuccess: async () => {
      await utils.admin.user.countSessions.invalidate({ id: member.id });
      setSuccessAlert(true);
    },
  });

  const onSubmitUpdateMember: SubmitHandler<UpdateMemberInputs> = async (values) => {
    if (isUpdateMemberFormDisabled) return;

    await updateMemberMutation.mutateAsync(values);
  };

  return (
    <form
      className="my-1 flex items-center"
      onSubmit={updateMemberForm.handleSubmit(onSubmitUpdateMember)}
    >
      <button
        type="button"
        className={`me-1 ms-1 flex h-9 cursor-pointer items-center bg-red px-2 disabled:cursor-not-allowed
      `}
        onClick={async () => await clearAllUserSessionsMutation.mutateAsync({ id: member.id })}
        disabled={!countUserSessionsQuery.data}
      >
        <Image src="/session_icon.png" alt="Session Icon" width={40} height={40} />
      </button>
      <div className="me-1 w-2/4">
        <input
          type="email"
          id="email-address"
          placeholder="Email"
          className={`h-9 w-full border-[1px] border-green px-2  py-1 text-lg `}
          {...updateMemberForm.register('email')}
        />
      </div>
      <div className="w-1/4">
        <select
          id="position"
          className={`h-9 w-full border-[1px] border-green px-2  py-1 text-lg `}
          onChange={(e) => {
            if (e.target.value === 'other') {
              updateMemberForm.setValue('name', '');
              setIsOther(() => true);
            } else {
              updateMemberForm.setValue('name', e.target.value);
              setIsOther(() => false);
            }
          }}
          value={isOther ? 'other' : updateMemberForm.watch('name')}
        >
          <option value="">Select a position</option>
          {Object.values(UserPosition).map((position, index) => (
            <option key={position} value={position}>
              {position}
            </option>
          ))}
          <option value="other">Other</option>
        </select>
      </div>

      <div className="ms-1 w-1/4">
        <input
          type="text"
          id="other"
          className={`${
            isOther ? '' : 'bg-gray'
          } h-9 w-full border-[1px] border-green px-2  py-1 text-lg `}
          disabled={!isOther}
          {...updateMemberForm.register('name')}
        />
      </div>

      <button
        type="submit"
        className="ms-1 flex h-9 cursor-pointer items-center bg-green px-2 text-white disabled:cursor-not-allowed"
        disabled={isUpdateMemberFormDisabled}
      >
        <Image src="/save_icon.png" alt="Save Icon" width={40} height={40} />
      </button>

      <button
        type="button"
        onClick={async () => await removeMemberMutation.mutateAsync({ id: member.id })}
        className="ms-1 flex h-9 items-center bg-red px-2 text-white"
      >
        <Image src="/delete_icon.svg" alt="Delete" width={40} height={40} />
      </button>
    </form>
  );
}
