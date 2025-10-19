import { Prisma, Todo } from '@prisma/client';
import { prisma } from '../lib/prisma';
import {
  TodoPaginationInput,
  TodosFilterInput,
  UpdateTodoInput,
} from '~/generated/graphql-types';

export class TodoRepository {
  async findTodosByUserId(
    userId: string,
    args: { pagination?: TodoPaginationInput; filter?: TodosFilterInput },
  ): Promise<Todo[]> {
    const { pagination, filter } = args;
    let where: Prisma.TodoWhereInput = { userId };
    console.log('filter', filter);
    if (filter?.isFinished !== null) {
      where.isFinished = filter?.isFinished;
    }

    let skip = 0;
    let take = 10;
    if (pagination) {
      take = pagination.limit ?? 10;
      skip = (pagination?.page ?? 0) * take;
    }

    return prisma.todo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async findTodoById(id: string): Promise<Todo | null> {
    return prisma.todo.findUnique({
      where: { id },
    });
  }

  async createTodo(data: {
    userId: string;
    title: string;
    description?: string;
  }): Promise<Todo> {
    return prisma.todo.create({
      data: {
        ...data,
        isFinished: false,
      },
    });
  }

  async updateTodo(id: string, data: UpdateTodoInput): Promise<Todo> {
    return prisma.todo.update({
      where: { id },
      data: {
        [data.key as keyof Todo]: data.value,
      },
    });
  }

  async deleteTodo(id: string): Promise<void> {
    await prisma.todo.delete({
      where: { id },
    });
  }
}
