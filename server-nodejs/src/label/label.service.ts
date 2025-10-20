import { Label } from '@prisma/client';
import { LabelRepository } from './label.repository';

export class LabelService {
  private labelRepository: LabelRepository;

  constructor() {
    this.labelRepository = new LabelRepository();
  }

  async getLabelsByTodoId(todoId: string): Promise<Label[]> {
    try {
      return await this.labelRepository.findLabelsByTodoId(todoId);
    } catch (error) {
      throw new Error(
        `Failed to get labels for todo ${todoId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Batch load labels for multiple todo IDs
   * Returns a map of todoId -> labels[]
   */
  async getLabelsByTodoIds(
    todoIds: readonly string[],
  ): Promise<Record<string, Label[]>> {
    try {
      return await this.labelRepository.findLabelsByTodoIds(todoIds);
    } catch (error) {
      throw new Error(
        `Failed to get labels for todos: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async getLabelById(id: string): Promise<Label | null> {
    try {
      return await this.labelRepository.findLabelById(id);
    } catch (error) {
      throw new Error(
        `Failed to get label ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async createLabel(data: {
    userId: string;
    name: string;
    color?: string;
  }): Promise<Label> {
    try {
      return await this.labelRepository.createLabel(data);
    } catch (error) {
      throw new Error(
        `Failed to create label: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async updateLabel(
    id: string,
    data: {
      name?: string;
      color?: string;
    },
  ): Promise<Label> {
    try {
      return await this.labelRepository.updateLabel(id, data);
    } catch (error) {
      throw new Error(
        `Failed to update label ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async deleteLabel(id: string): Promise<void> {
    try {
      return await this.labelRepository.deleteLabel(id);
    } catch (error) {
      throw new Error(
        `Failed to delete label ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
