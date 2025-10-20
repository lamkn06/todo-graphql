import { UpdateTodoInputSchema } from '../generated/zod-schemas';
import { CreateTodoInputValidationSchema } from './todo.validation';
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
import { handleResolverError } from '../utils/validation';
const todoService = new TodoService();

export const TodoResolvers = {
  Query: {
    todo: (_: unknown, args: { id: string }): Promise<Todo | null> => {
      return todoService.getTodoById(args.id);
    },
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
      try {
        const input = CreateTodoInputValidationSchema().parse(args.input);

        return await todoService.createTodo({
          userId: ctx.user.id,
          title: input.title,
          description: input.description || undefined,
        });
      } catch (error) {
        throw handleResolverError(error);
      }
    },
    updateTodo: async (
      _: unknown,
      args: { id: string; input: UpdateTodoInput },
    ): Promise<Todo> => {
      try {
        const input = UpdateTodoInputSchema().parse(args.input);
        return await todoService.updateTodo(args.id, input);
      } catch (error) {
        throw handleResolverError(error);
      }
    },
    deleteTodo: async (
      _: unknown,
      args: { id: string },
    ): Promise<DeletionResponse> => {
      try {
        await todoService.deleteTodo(args.id);
        return {
          success: true,
          message: `${args.id} deleted successfully`,
        };
      } catch (error) {
        throw handleResolverError(error);
      }
    },
  },

  Todo: {
    labels: async (parent: any, _: unknown, ctx: GraphQLContext) => {
      return await labelService.getLabelsByTodoId(parent.id);
    },
  },
};
