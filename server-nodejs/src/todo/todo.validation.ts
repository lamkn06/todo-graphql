import * as z from 'zod';
import { CreateTodoInputSchema } from '../generated/zod-schemas';

// Custom validation schema with additional validation rules
export const CreateTodoInputValidationSchema = () => {
  const baseSchema = CreateTodoInputSchema();

  return baseSchema.extend({
    title: z
      .string()
      .min(1, 'Title must be at least 1 character')
      .max(10, 'Title must be at most 10 characters'),
  });
};
