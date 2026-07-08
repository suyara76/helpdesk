import { api } from './api';
import { User } from "@/types";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  login: async (data: LoginData) => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData) : Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};
