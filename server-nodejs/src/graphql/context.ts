import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function createContext({ req }: any) {
  const auth = (req.headers.authorization as string | undefined) ?? '';
  const token = auth.replace(/^Bearer\s+/i, '');
  let user: { id: string; email?: string } | null = null;
  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET!) as any;
    } catch {}
  }
  return { prisma, user };
}
