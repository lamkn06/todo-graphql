import * as z from 'zod'
import { CreateTodoInput } from './graphql-types'

type Properties<T> = Required<{
  [K in keyof T]: z.ZodType<T[K]>;
}>;

type definedNonNullAny = {};

export const isDefinedNonNullAny = (v: any): v is definedNonNullAny => v !== undefined && v !== null;

export const definedNonNullAnySchema = z.any().refine((v) => isDefinedNonNullAny(v));

export function CreateTodoInputSchema(): z.ZodObject<Properties<CreateTodoInput>> {
  return z.object({
    description: z.string().nullish(),
    title: z.string()
  })
}
