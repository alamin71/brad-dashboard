import axios from "axios";
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
    try {
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
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message || "Login failed"
        : error instanceof Error
          ? error.message
          : "Login failed";
      throw new Error(errorMessage);
    }
  },

  logout: () => {
    tokenStorage.clearAll();
  },

  isAuthenticated: () => {
    return tokenStorage.isLoggedIn();
  },
};
