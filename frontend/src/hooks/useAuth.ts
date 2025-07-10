import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRecoilState } from 'recoil';
import { api } from '@/lib/api';
import { authState } from '@/store/atoms';
import { LoginDto, RegisterDto, AuthResponse } from '@/types';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const [auth, setAuth] = useRecoilState(authState);
  const router = useRouter();
  const queryClient = useQueryClient();

  const loginMutation = useMutation<AuthResponse, Error, LoginDto>({
    mutationFn: async (credentials) => {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setAuth({
        user: data.user,
        token: data.access_token,
        isAuthenticated: true,
      });
      toast.success('Login successful');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });

  const registerMutation = useMutation<AuthResponse, Error, RegisterDto>({
    mutationFn: async (userData) => {
      const response = await api.post('/auth/register', userData);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setAuth({
        user: data.user,
        token: data.access_token,
        isAuthenticated: true,
      });
      toast.success('Registration successful');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({
      user: null,
      token: null,
      isAuthenticated: false,
    });
    queryClient.clear();
    router.push('/login');
    toast.success('Logged out successfully');
  };

  // Initialize auth from localStorage
  const initializeAuth = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setAuth({
        user: JSON.parse(user),
        token,
        isAuthenticated: true,
      });
    }
  };

  return {
    ...auth,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    initializeAuth,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
}; 