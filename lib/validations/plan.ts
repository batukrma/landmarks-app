import { z } from 'zod';

// Helper function to get tomorrow's date in YYYY-MM-DD format
const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

export const locationSchema = z.object({
  position: z.tuple([z.number(), z.number()]),
  name: z.string().min(1, 'Location name is required'),
  visit_date: z
    .string()
    .refine((date) => {
      const visitDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      return visitDate >= today;
    }, 'Visit date cannot be in the past')
    .optional(),
});

export const planFormSchema = z.object({
  planName: z.string().min(3, 'Plan name must be at least 3 characters'),
  locations: z.array(locationSchema).min(1, 'Add at least one location'),
});

export type PlanFormValues = z.infer<typeof planFormSchema>;

// Export the helper function to be used in components
export const getMinDate = getTomorrowDate;
