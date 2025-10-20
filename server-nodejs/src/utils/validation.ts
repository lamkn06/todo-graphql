import { GraphQLError } from 'graphql';
import { ZodError } from 'zod';

/**
 * Converts ZodError to GraphQLError with detailed validation information
 */
export function handleZodError(error: ZodError): GraphQLError {
  const errorMessages = error.issues
    .map((issue) => {
      const path = issue.path.join('.');
      return `${path}: ${issue.message}`;
    })
    .join(', ');

  return new GraphQLError(`Validation failed: ${errorMessages}`, {
    extensions: {
      code: 'BAD_USER_INPUT',
      http: { status: 400 },
      validationErrors: error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
      })),
    },
  });
}

/**
 * Generic error handler for GraphQL resolvers
 */
export function handleResolverError(error: unknown): GraphQLError {
  if (error instanceof ZodError) {
    return handleZodError(error);
  }

  // Handle other known error types
  if (error instanceof GraphQLError) {
    return error;
  }

  // Handle unknown errors
  return new GraphQLError('Internal server error', {
    extensions: {
      code: 'INTERNAL_SERVER_ERROR',
      http: { status: 500 },
    },
  });
}
