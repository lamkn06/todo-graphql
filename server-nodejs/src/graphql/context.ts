import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

export type GraphQLContext = {
  prisma: PrismaClient;
  user: { id: string; email?: string };
};

export async function createContext({ req }: any) {
  const auth = (req.headers.authorization as string | undefined) ?? '';
  const token = auth.replace(/^Bearer\s+/i, '');

  let user: { id: string; email?: string } | null = null;

  if (!token) {
    throw new GraphQLError('Authentication required', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    });
  }

  if (token) {
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

  return { prisma, user };
}
