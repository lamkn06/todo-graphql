import { Todo } from '@prisma/client';
import { prisma } from '../lib/prisma';

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
      data,
    });
  }

  async updateTodo(
    id: string,
    data: {
      title?: string;
      description?: string;
    },
  ): Promise<Todo> {
    return prisma.todo.update({
      where: { id },
      data,
    });
  }

  async deleteTodo(id: string): Promise<void> {
    await prisma.todo.delete({
      where: { id },
    });
  }
}
