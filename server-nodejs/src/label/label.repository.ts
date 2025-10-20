import { Label } from '@prisma/client';
import { prisma } from '../lib/prisma';

export class LabelRepository {
  async findLabelsByUserId(userId: string): Promise<Label[]> {
    return prisma.label.findMany({
      where: { userId },
    });
  }

  async findLabelsByTodoId(todoId: string): Promise<Label[]> {
    return prisma.label.findMany({
      where: { todoLabels: { some: { todoId } } },
    });
  }

  /**
   * Batch load labels for multiple todo IDs
   * Returns a map of todoId -> labels[]
   */
  async findLabelsByTodoIds(
    todoIds: readonly string[],
  ): Promise<Record<string, Label[]>> {
    const todoLabels = await prisma.todoLabel.findMany({
      where: { todoId: { in: [...todoIds] } },
      include: { label: true },
    });

    // Group labels by todoId
    const labelsByTodoId: Record<string, Label[]> = {};
    todoIds.forEach((todoId) => {
      labelsByTodoId[todoId] = [];
    });

    todoLabels.forEach((todoLabel) => {
      labelsByTodoId[todoLabel.todoId].push(todoLabel.label);
    });

    return labelsByTodoId;
  }

  async findLabelById(id: string): Promise<Label | null> {
    return prisma.label.findUnique({
      where: { id },
    });
  }

  async createLabel(data: {
    userId: string;
    name: string;
    color?: string;
  }): Promise<Label> {
    return prisma.label.create({
      data,
    });
  }

  async updateLabel(
    id: string,
    data: {
      name?: string;
      color?: string;
    },
  ): Promise<Label> {
    return prisma.label.update({
      where: { id },
      data,
    });
  }

  async deleteLabel(id: string): Promise<void> {
    await prisma.label.delete({
      where: { id },
    });
  }
}
