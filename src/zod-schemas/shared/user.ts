import { z } from 'zod';

export const userSchemas = {
  signIn: z.object({ email: z.string().trim().toLowerCase().email() }),
};
