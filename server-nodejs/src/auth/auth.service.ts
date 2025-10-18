import { AuthRepository } from './auth.repository';
import { User } from '@prisma/client';
import {
  RegisterData,
  LoginData,
  AuthResult,
  RefreshTokenResult,
} from './auth.types';
import {
  hashPassword,
  verifyPassword,
  signAccess,
  signRefresh,
  verifyRefresh,
} from '../utils/crypto';

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async register(data: RegisterData): Promise<AuthResult> {
    // Check if user already exists
    const existingUser = await this.authRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Create user
    const user = await this.authRepository.createUser({
      email: data.email,
      passwordHash,
      isActive: true,
    });

    // Generate tokens
    const accessToken = signAccess({ id: user.id, email: user.email });
    const refreshToken = signRefresh({ id: user.id });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        isActive: user.isActive,
      },
    };
  }

  async login(data: LoginData): Promise<AuthResult> {
    // Find user
    const user = await this.authRepository.findUserByEmail(data.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await verifyPassword(
      data.password,
      user.passwordHash,
    );
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is inactive');
    }

    // Generate tokens
    const accessToken = signAccess({ id: user.id, email: user.email });
    const refreshToken = signRefresh({ id: user.id });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        isActive: user.isActive,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResult> {
    // Verify refresh token
    const payload = verifyRefresh<{ id: string }>(refreshToken);
    if (!payload) {
      throw new Error('Invalid refresh token');
    }

    // Find user
    const user = await this.authRepository.findUserById(payload.id);
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    // Generate new access token
    const accessToken = signAccess({ id: user.id, email: user.email });

    return { accessToken };
  }

  async getUserById(id: string): Promise<User | null> {
    return this.authRepository.findUserById(id);
  }
}
