import * as z from 'zod'
import { CreateLabelInput, CreateTodoInput, UpdateLabelInput, UpdateTodoInput } from './graphql-types'

type Properties<T> = Required<{
  [K in keyof T]: z.ZodType<T[K]>;
}>;

type definedNonNullAny = {};

export const isDefinedNonNullAny = (v: any): v is definedNonNullAny => v !== undefined && v !== null;

export const definedNonNullAnySchema = z.any().refine((v) => isDefinedNonNullAny(v));

export function CreateLabelInputSchema(): z.ZodObject<Properties<CreateLabelInput>> {
  return z.object({
    color: z.string().nullish(),
    name: z.string()
  })
}

export function CreateTodoInputSchema(): z.ZodObject<Properties<CreateTodoInput>> {
  return z.object({
    description: z.string().nullish(),
    title: z.string()
  })
}

export function UpdateLabelInputSchema(): z.ZodObject<Properties<UpdateLabelInput>> {
  return z.object({
    color: z.string().nullish(),
    name: z.string().nullish()
  })
}

export function UpdateTodoInputSchema(): z.ZodObject<Properties<UpdateTodoInput>> {
  return z.object({
    key: z.string(),
    value: z.any().nullish()
  })
}
