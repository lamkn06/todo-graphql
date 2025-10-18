import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { ENV } from './config/env';
import { createContext } from './graphql/context';
import { schema } from './graphql/schema';
import authRoutes from './auth/auth.routes';
const app = express();
app.use(cors({ origin: ENV.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(json());

// Basic route
app.use('/auth', authRoutes);

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
