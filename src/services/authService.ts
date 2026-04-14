import { API_CONFIG } from "../config/apiConfig";
import { apiClient } from "./apiClient";

export const API_BASE_URL = API_CONFIG.baseUrl;

interface AdminData {
  id: string;
  email: string;
  name?: string;
  role?: string;
  [key: string]: string | number | boolean | undefined;
}

interface LoginResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    accessToken: string;
    refreshToken: string;
    admin: AdminData;
  };
}

interface LoginRequest {
  email: string;
  password: string;
}

interface ForgetPasswordResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    otp?: string;
    otpToken: string;
  };
}

interface VerifyResetOtpResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    resetToken: string;
  };
}

interface ResetPasswordRequest {
  newPassword: string;
  confirmPassword: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message: string;
  statusCode: number;
}

// Token management
export const tokenStorage = {
  setAccessToken: (token: string) => {
    localStorage.setItem("accessToken", token);
  },
  getAccessToken: () => {
    return localStorage.getItem("accessToken");
  },
  setRefreshToken: (token: string) => {
    localStorage.setItem("refreshToken", token);
  },
  getRefreshToken: () => {
    return localStorage.getItem("refreshToken");
  },
  setAdmin: (admin: AdminData) => {
    localStorage.setItem("admin", JSON.stringify(admin));
  },
  getAdmin: (): AdminData | null => {
    const admin = localStorage.getItem("admin");
    return admin ? JSON.parse(admin) : null;
  },
  clearAll: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("admin");
  },
  isLoggedIn: () => {
    return !!localStorage.getItem("accessToken");
  },
};

// Admin Login API
export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      API_CONFIG.endpoints.adminLogin,
      credentials,
    );

    const data = response.data;

    if (data.success && data.data) {
      // Store tokens
      tokenStorage.setAccessToken(data.data.accessToken);
      tokenStorage.setRefreshToken(data.data.refreshToken);
      tokenStorage.setAdmin(data.data.admin);
    }

    return data;
  },

  logout: () => {
    tokenStorage.clearAll();
  },

  isAuthenticated: () => {
    return tokenStorage.isLoggedIn();
  },

  forgetPassword: async (email: string): Promise<ForgetPasswordResponse> => {
    const response = await apiClient.post<ForgetPasswordResponse>(
      API_CONFIG.endpoints.adminForgetPassword,
      { email },
    );

    return response.data;
  },

  verifyResetOtp: async (
    otp: string,
    otpToken: string,
  ): Promise<VerifyResetOtpResponse> => {
    const response = await apiClient.post<VerifyResetOtpResponse>(
      API_CONFIG.endpoints.adminVerifyResetOtp,
      { otp },
      {
        headers: {
          "otp-token": otpToken,
        },
      },
    );

    return response.data;
  },

  resetPassword: async (
    payload: ResetPasswordRequest,
    resetToken: string,
  ): Promise<ResetPasswordResponse> => {
    const response = await apiClient.post<ResetPasswordResponse>(
      API_CONFIG.endpoints.adminResetPassword,
      payload,
      {
        headers: {
          "reset-token": resetToken,
        },
      },
    );

    return response.data;
  },
};
