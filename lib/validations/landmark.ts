import { z } from 'zod';

export const landmarkSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  visit_date: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  is_visited: z.boolean().optional(),
});

export type LandmarkFormValues = z.infer<typeof landmarkSchema>;
