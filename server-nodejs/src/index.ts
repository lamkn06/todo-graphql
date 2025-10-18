import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import express from 'express';
import { ENV } from './config/env';
import { schema } from './graphql/schema';
import { createContext } from './graphql/context';

const app = express();

// Basic route
app.get('/', (_, res) => res.send('Hello TypeScript!'));

// Create Apollo Server
const server = new ApolloServer({ schema });

// Start server
async function startServer() {
  await server.start();

  // Apply GraphQL middleware to /graphql endpoint
  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(server, {
      context: createContext,
    }),
  );

  app.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${ENV.PORT}/graphql`);
  });
}

startServer().catch(console.error);
