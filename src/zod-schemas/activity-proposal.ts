import { z } from 'zod';

export type ActivityProposal = { Proposal_ID: number; Event_Title: string };

const adminSchemas = {
  get: z.object({ acronym: z.string().trim().optional() }).optional(),
};

// const sharedSchemas = {};

export const activityProposalSchemas = {
  admin: adminSchemas,
  // shared: sharedSchemas,
};
