// Auth request/response types
export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResult {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    isActive: boolean;
  };
}

export interface RefreshTokenResult {
  accessToken: string;
}

// Database operation types
export interface CreateUserData {
  email: string;
  passwordHash: string;
  isActive?: boolean;
}

// API Response types
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
    user: {
      id: string;
      email: string;
      isActive: boolean;
    };
  };
}

export interface RefreshResponse {
  success: boolean;
  data?: {
    accessToken: string;
  };
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}
