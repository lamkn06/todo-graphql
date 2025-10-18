import {
  CreateTodoInputSchema,
  UpdateTodoInputSchema,
} from '../generated/zod-schemas';
import type { GraphQLContext } from '../graphql/context';
import type {
  CreateTodoInput,
  UpdateTodoInput,
} from '../generated/graphql-types';
import { TodoService } from './todo.service';
import { labelService } from '../label/label.resolver';
const todoService = new TodoService();

export const TodoResolvers = {
  Query: {
    todos: (_: unknown, __: unknown, ctx: GraphQLContext) => {
      return todoService.getTodosByUserId(ctx.user.id);
    },
  },

  Mutation: {
    createTodo: async (
      _: unknown,
      args: { input: CreateTodoInput },
      ctx: GraphQLContext,
    ) => {
      const input = CreateTodoInputSchema().parse(args.input);

      return await todoService.createTodo({
        userId: ctx.user.id,
        title: input.title,
        description: input.description || undefined,
      });
    },
    updateTodo: async (
      _: unknown,
      args: { id: string; input: UpdateTodoInput },
      ctx: GraphQLContext,
    ) => {
      const input = UpdateTodoInputSchema().parse(args.input);
      return await todoService.updateTodo(args.id, input);
    },
  },

  Todo: {
    labels: async (parent: any, _: unknown, ctx: GraphQLContext) => {
      return await labelService.getLabelsByTodoId(parent.id);
    },
  },
};
