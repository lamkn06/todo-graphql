import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { createLabelDataLoader, DataLoaders } from '../lib/dataloaders';

export type GraphQLContext = {
  prisma: PrismaClient;
  user: { id: string; email?: string };
  loaders: DataLoaders;
};

export const createContext = async (params: any) => {
  let token: string | undefined;

  // Handle different context types (HTTP vs WebSocket)
  if (params.req) {
    // HTTP request context
    const auth = (params.req.headers.authorization as string | undefined) ?? '';
    token = auth.replace(/^Bearer\s+/i, '');
  } else if (params.connectionParams?.authorization) {
    // WebSocket connection context
    const auth = params.connectionParams.authorization as string;
    token = auth.replace(/^Bearer\s+/i, '');
  } else if (params.extra?.request?.headers?.authorization) {
    // Alternative WebSocket context format
    const auth = params.extra.request.headers.authorization as string;
    token = auth.replace(/^Bearer\s+/i, '');
  } else if (params.connectionParams?.token) {
    // Alternative token parameter name
    token = params.connectionParams.token as string;
  } else if (params.token) {
    // Direct token parameter
    token = params.token as string;
  }

  let user: { id: string; email?: string } | null = null;

  // For WebSocket connections, authentication might be optional
  const isWebSocket = !params.req;

  if (!token) {
    if (isWebSocket) {
      // For WebSocket connections without token, create a default anonymous user
      // This allows subscriptions to work without authentication
      user = { id: 'anonymous', email: undefined };
    } else {
      // For HTTP requests, authentication is required
      throw new GraphQLError('Authentication required', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },
        },
      });
    }
  } else {
    // Verify token if provided
    try {
      user = jwt.verify(token, process.env.JWT_SECRET!) as any;
    } catch (error) {
      throw new GraphQLError('Invalid token', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },
        },
      });
    }
  }

  // Create DataLoaders for this request
  const loaders: DataLoaders = {
    labels: createLabelDataLoader(),
  };

  return { prisma, user, loaders };
};
