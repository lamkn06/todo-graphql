import { CreateTodoInputSchema } from '../generated/zod-schemas';
import type { GraphQLContext } from '../graphql/context';
import type { CreateTodoInput } from '../generated/graphql-types';

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

      return ctx.prisma.todo.create({
        data: {
          userId: '68f317e44c0019025c42e98f',
          title: input.title,
          description: input.description ?? null,
        },
      });
    },
  },
};
