# Validation Utilities

## Common Error Handler

The `validation.ts` file provides utility functions for handling validation errors consistently across the entire GraphQL API.

### Functions

#### `handleZodError(error: ZodError): GraphQLError`
Converts ZodError to GraphQLError with detailed validation information.

#### `handleResolverError(error: unknown): GraphQLError`
Generic error handler for all GraphQL resolvers.

### Usage

```typescript
import { handleResolverError } from '../utils/validation';

export const MyResolver = {
  Mutation: {
    createSomething: async (_, args, ctx) => {
      try {
        // Validation
        const input = MyValidationSchema().parse(args.input);
        
        // Business logic
        return await myService.create(input);
      } catch (error) {
        throw handleResolverError(error);
      }
    }
  }
};
```

### Error Response Format

When validation fails, the response will have this format:

```json
{
  "errors": [
    {
      "message": "Validation failed: fieldName: Error message",
      "extensions": {
        "code": "BAD_USER_INPUT",
        "http": { "status": 400 },
        "validationErrors": [
          {
            "field": "fieldName",
            "message": "Error message",
            "code": "error_code"
          }
        ]
      }
    }
  ]
}
```

### Benefits

- ✅ Consistent error handling across all resolvers
- ✅ Detailed validation error information
- ✅ Easy to maintain and extend
- ✅ Type-safe error handling
- ✅ Automatic HTTP status code mapping
