// src/types/auth.ts

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: 'user' | 'admin';
  createdAt?: string;
}

export interface AuthResponseData {
  user: User;
  token: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: AuthResponseData;
}

// Reuse this for Login as well since they usually share the same shape
export type LoginResponse = RegisterResponse;

export interface ApiError {
  response?: {
    status?: number;
    data?: { 
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
}
