import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import type { Response } from 'express';

const SALT = 10;

export const hashPassword = (plain: string) => bcrypt.hash(plain, SALT);
export const verifyPassword = (plain: string, hashed: string) =>
  bcrypt.compare(plain, hashed);

export const signAccess = (p: object) =>
  jwt.sign(p, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES || '15m',
  });
export const signRefresh = (p: object) =>
  jwt.sign(p, process.env.REFRESH_SECRET!, {
    expiresIn: `${process.env.REFRESH_EXPIRES_DAYS || 7}d`,
  });
export const verifyRefresh = <T = any>(t: string) =>
  jwt.verify(t, process.env.REFRESH_SECRET!) as T;

export const setRefreshCookie = (res: Response, token: string) => {
  res.cookie('rt', token, {
    httpOnly: true,
    secure: true, // enable when HTTPS
    sameSite: 'lax',
    maxAge: Number(process.env.REFRESH_EXPIRES_DAYS || 7) * 86400000,
    path: '/',
  });
};
export const clearRefreshCookie = (res: Response) =>
  res.clearCookie('rt', { path: '/' });
