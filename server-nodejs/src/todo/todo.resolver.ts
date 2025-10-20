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
  TodoFinishedPayload,
} from '../generated/graphql-types';
import { TodoService } from './todo.service';
import { labelService } from '../label/label.resolver';
import { handleResolverError } from '../utils/validation';
import { pubsub, TODO_EVENTS } from '../lib/pubsub';
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

        const todo = await todoService.createTodo({
          userId: ctx.user.id,
          title: input.title,
          description: input.description || undefined,
        });

        return todo;
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
        const todo = await todoService.updateTodo(args.id, input);
        const { key, value } = input;
        if (args.input.key === 'isFinished') {
          pubsub.publish(TODO_EVENTS.TODO_FINISHED, {
            id: todo.id,
            isFinished: value,
          });
        }
        return todo;
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

  Subscription: {
    todoFinished: {
      subscribe: () => pubsub.asyncIterableIterator(TODO_EVENTS.TODO_FINISHED),
      resolve: (payload: TodoFinishedPayload) => payload,
    },
  },

  Todo: {
    labels: async (parent: any, _: unknown, ctx: GraphQLContext) => {
      return await ctx.loaders.labels.load(parent.id);
    },
  },
};
