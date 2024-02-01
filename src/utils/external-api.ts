import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '~/utils/api';
import { schemas } from '~/zod-schemas';
import { ActivityProposal } from '~/zod-schemas/activity-proposal';

export type AdminGetActivityProposalsInputs = z.infer<typeof schemas.admin.activityProposal.get>;

const SDS_SCHEDULER_URL = 'https://cvsuimus-sdsscheduler.org';
const SDS_SCHEDULER_API = `${SDS_SCHEDULER_URL}/api`;

export function getSDSSchedulerDocument(title: string) {
  return `${SDS_SCHEDULER_URL}/Uploads/Documents/${title}.pdf`;
}

export const externalAPI = {
  admin: {
    activityProposal: {
      get: {
        useQuery(
          input?: AdminGetActivityProposalsInputs,
          options?: Parameters<
            typeof useQuery<
              ActivityProposal[],
              unknown,
              ActivityProposal[],
              (string | AdminGetActivityProposalsInputs)[]
            >
          >[2]
        ) {
          return useQuery({
            queryKey: [`externalApi.admin.activityProposal.get`, input],
            async queryFn() {
              const res = await fetch(
                `${SDS_SCHEDULER_API}/activity-proposals.php${
                  input?.acronym ? `?organizationAcronym=${input.acronym}` : ''
                }`
              );

              const activityProposals = await res.json();
              return activityProposals as ActivityProposal[];
            },
            ...options,
          });
        },
      },
    },
  },

  shared: {
    activityProposal: {
      get: {
        useQuery(
          _input?: undefined,
          options?: Parameters<
            typeof useQuery<ActivityProposal[], unknown, ActivityProposal[], string[]>
          >[2]
        ) {
          const getOrganization = api.shared.organization.get.useQuery();
          const organizationAcronym = getOrganization.data?.acronym;

          return useQuery({
            queryKey: ['externalApi.shared.activityProposal.get'],
            async queryFn() {
              const res = await fetch(
                `${SDS_SCHEDULER_API}/activity-proposals.php?organizationAcronym=${organizationAcronym}`
              );

              const activityProposals = await res.json();
              return activityProposals as ActivityProposal[];
            },
            ...options,
          });
        },
      },
    },
  },
};
