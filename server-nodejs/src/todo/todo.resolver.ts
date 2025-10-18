import { CreateTodoInputSchema } from '../generated/zod-schemas';
import type { GraphQLContext } from '../graphql/context';
import type { CreateTodoInput } from '../generated/graphql-types';
import { TodoService } from './todo.service';

const todoService = new TodoService();

export const TodoResolvers = {
  Query: {
    todos: () => [],
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
  },
};
