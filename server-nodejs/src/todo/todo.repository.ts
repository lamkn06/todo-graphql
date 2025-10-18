import { Todo } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { UpdateTodoInput } from '~/generated/graphql-types';

export class TodoRepository {
  async findTodosByUserId(userId: string): Promise<Todo[]> {
    return prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
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
