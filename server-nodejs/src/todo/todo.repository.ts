import { Prisma, Todo } from '@prisma/client';
import { prisma } from '../lib/prisma';
import {
  TodoPaginationInput,
  TodosFilterInput,
  UpdateTodoInput,
  TodoList,
} from '~/generated/graphql-types';

export class TodoRepository {
  async findTodosByUserId(
    userId: string,
    args: { pagination?: TodoPaginationInput; filter?: TodosFilterInput },
  ): Promise<TodoList> {
    const { pagination, filter } = args;
    let where: Prisma.TodoWhereInput = { userId };
    if (filter?.isFinished !== null) {
      where.isFinished = filter?.isFinished;
    }

    let skip = 0;
    let take = 10;
    let page = 0;
    if (pagination) {
      take = pagination.limit ?? 10;
      page = pagination.page ?? 0;
      skip = page * take;
    }
    const total = await prisma.todo.count({ where });
    const items = await prisma.todo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });

    return {
      items,
      total,
      page,
      limit: take,
    };
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
