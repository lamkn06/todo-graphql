import { Todo } from '@prisma/client';
import { TodoRepository } from './todo.repository';

export class TodoService {
  private todoRepository: TodoRepository;

  constructor() {
    this.todoRepository = new TodoRepository();
  }

  async getTodosByUserId(userId: string): Promise<Todo[]> {
    try {
      return await this.todoRepository.findTodosByUserId(userId);
    } catch (error) {
      throw new Error(
        `Failed to get todos for user ${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async getTodoById(id: string): Promise<Todo | null> {
    try {
      return await this.todoRepository.findTodoById(id);
    } catch (error) {
      throw new Error(
        `Failed to get todo ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async createTodo(data: {
    userId: string;
    title: string;
    description?: string;
  }): Promise<Todo> {
    try {
      return await this.todoRepository.createTodo(data);
    } catch (error) {
      throw new Error(
        `Failed to create todo: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async updateTodo(
    id: string,
    data: {
      title?: string;
      description?: string;
    },
  ): Promise<Todo> {
    try {
      return await this.todoRepository.updateTodo(id, data);
    } catch (error) {
      throw new Error(
        `Failed to update todo ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async deleteTodo(id: string): Promise<void> {
    try {
      return await this.todoRepository.deleteTodo(id);
    } catch (error) {
      throw new Error(
        `Failed to delete todo ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
