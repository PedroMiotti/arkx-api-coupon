import { z } from 'zod';

export const issueCouponSchema = z.object({
  body: z.object({
    userPhone: z.string({ required_error: 'User Phone is required' }).min(3).max(14),
  }),
});
