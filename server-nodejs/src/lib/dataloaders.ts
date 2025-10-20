import DataLoader from 'dataloader';
import { Label } from '@prisma/client';
import { labelService } from '../label/label.resolver';

/**
 * DataLoader for batch loading labels by todo IDs
 * This prevents N+1 query problems when loading labels for multiple todos
 */
export const createLabelDataLoader = () => {
  return new DataLoader<string, Label[]>(async (todoIds: readonly string[]) => {
    // Batch load all labels for all todo IDs in a single query
    const labelsByTodoId = await labelService.getLabelsByTodoIds(todoIds);

    // Return labels in the same order as requested todoIds
    return todoIds.map((todoId) => labelsByTodoId[todoId] || []);
  });
};

export type DataLoaders = {
  labels: DataLoader<string, Label[]>;
};
