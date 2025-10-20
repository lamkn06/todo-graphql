import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { useServer as useWsServer } from 'graphql-ws/use/ws';
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

// Create HTTP server
const httpServer = createServer(app);

// Create Apollo Server with subscription support
const server = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

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

  // Create WebSocket server for subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  // Set up GraphQL WebSocket server
  useWsServer(
    {
      schema,
      context: createContext,
    },
    wsServer,
  );

  httpServer.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${ENV.PORT}/graphql`);
    console.log(`Subscriptions endpoint: ws://localhost:${ENV.PORT}/graphql`);
  });
}

startServer().catch(console.error);
