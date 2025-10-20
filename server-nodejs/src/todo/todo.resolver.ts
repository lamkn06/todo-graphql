import {
  CreateTodoInputSchema,
  UpdateTodoInputSchema,
} from '../generated/zod-schemas';
import type { GraphQLContext } from '../graphql/context';
import type {
  CreateTodoInput,
  DeletionResponse,
  Todo,
  TodoPaginationInput,
  TodosFilterInput,
  TodoList,
  UpdateTodoInput,
} from '../generated/graphql-types';
import { TodoService } from './todo.service';
import { labelService } from '../label/label.resolver';
const todoService = new TodoService();

export const TodoResolvers = {
  Query: {
    todos: (
      _: unknown,
      args: { pagination?: TodoPaginationInput; filter?: TodosFilterInput },
      ctx: GraphQLContext,
    ): Promise<TodoList> => {
      return todoService.getTodosByUserId(ctx.user.id, args);
    },
  },

  Mutation: {
    createTodo: async (
      _: unknown,
      args: { input: CreateTodoInput },
      ctx: GraphQLContext,
    ): Promise<Todo> => {
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
    ): Promise<Todo> => {
      const input = UpdateTodoInputSchema().parse(args.input);
      return await todoService.updateTodo(args.id, input);
    },
    deleteTodo: async (
      _: unknown,
      args: { id: string },
    ): Promise<DeletionResponse> => {
      await todoService.deleteTodo(args.id);
      return {
        success: true,
        message: `${args.id} deleted successfully`,
      };
    },
  },

  Todo: {
    labels: async (parent: any, _: unknown, ctx: GraphQLContext) => {
      return await labelService.getLabelsByTodoId(parent.id);
    },
  },
};
