import { z } from 'zod';

export const CreateMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),

  uniqueId: z.string().min(1, 'Unique ID is required'),

  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),

  membershipId: z.string().uuid('Invalid membership ID'),
  staffId: z.string().uuid('Invalid staff ID'),
});

export type CreateMemberBody = z.infer<typeof CreateMemberSchema>;

export const UpdateMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  uniqueId: z.string().min(1, 'Unique ID is required'),
});

export type UpdateMemberBody = z.infer<typeof UpdateMemberSchema>;

export const CreateMembershipSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  durationDays: z.number().min(1, 'Duration of the membership is required'),
  price: z.number(),
});

export type CreateMembershipBody = z.infer<typeof CreateMembershipSchema>;

export const UpdateMembershipSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  durationDays: z.number().min(1, 'Duration of the membership is required'),
  price: z.number(),
});

export type UpdateMembershipBody = z.infer<typeof UpdateMembershipSchema>;

export const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
  password: z.string().max(50, 'Password cant be longer than 50 characters.'),
  role: z.enum(['STAFF', 'ADMIN']),
});

export type CreateUserBody = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
  role: z.enum(['STAFF', 'ADMIN']),
});

export type UpdateUserBody = z.infer<typeof UpdateUserSchema>;

export const LoginUserSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password cant be longer than 50 characters.'),
});

export type LoginUserBody = z.infer<typeof LoginUserSchema>;
