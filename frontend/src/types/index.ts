export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dob: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dob: string;
}

export interface UpdatePatientDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  dob?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
} 