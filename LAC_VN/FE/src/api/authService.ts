import axiosClient from './axiosClient';
import { 
  AuthResponse, 
  OtpResponse, 
  LoginRequest, 
  RegisterRequest, 
  OTPRequest, 
  VerifyOTPRequest 
} from '../types/auth.types';
import { ApiResponse } from '../types/product.types';

const authService = {
  sendOtp: async (email: string): Promise<OtpResponse> => {
    const request: OTPRequest = { email };
    const response = await axiosClient.post<ApiResponse<OtpResponse>>('/auth/send-otp', request);
    return response.data.data;
  },

  verifyOtp: async (email: string, otp: string): Promise<OtpResponse> => {
    const request: VerifyOTPRequest = { email, otp };
    const response = await axiosClient.post<ApiResponse<OtpResponse>>('/auth/verify-otp', request);
    return response.data.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const request: LoginRequest = { email, password };
    const response = await axiosClient.post<ApiResponse<AuthResponse>>('/auth/login', request);
    return response.data.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axiosClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },
};

export default authService;
