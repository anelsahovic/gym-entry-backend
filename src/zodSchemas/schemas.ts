import { z } from 'zod';

export const CreateMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),

  uniqueId: z.string().min(1, 'Unique ID is required'),

  startDate: z.string().datetime().optional(),

  membershipId: z.string().uuid('Invalid membership ID'),
  staffId: z.string().uuid('Invalid staff ID'),
});

export type CreateMemberBody = z.infer<typeof CreateMemberSchema>;

export const UpdateMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
  uniqueId: z.string().min(1, 'Unique ID is required'),
});

export type UpdateMemberBody = z.infer<typeof UpdateMemberSchema>;
