import type { Request, Response } from 'express';
import { clearRefreshCookie, setRefreshCookie } from '../utils/crypto';
import { AuthService } from './auth.service';
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  RegisterInput,
  LoginInput,
} from './auth.schema';

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = registerSchema.parse(req.body) as RegisterInput;

    const result = await authService.register({ email, password });

    // Set refresh token as cookie
    if (result.refreshToken) {
      setRefreshCookie(res, result.refreshToken);
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Registration failed',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body) as LoginInput;

    const result = await authService.login({ email, password });

    // Set refresh token as cookie
    if (result.refreshToken) {
      setRefreshCookie(res, result.refreshToken);
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : 'Login failed',
    });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const rt = req.cookies?.rt as string | undefined;
    if (!rt) {
      throw new Error('No refresh token');
    }

    const result = await authService.refreshToken(rt);

    res.json({
      success: true,
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : 'Token refresh failed',
    });
  }
};

export const logout = async (_req: Request, res: Response) => {
  clearRefreshCookie(res);
  res.json({
    success: true,
    message: 'Logout successful',
  });
};
