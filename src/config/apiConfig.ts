/**
 * API Configuration
 * Automatically detects environment and sets appropriate base URL
 */

// Get baseUrl from environment variable or use defaults
const getApiBaseUrl = (): string => {
  if (__API_BASE_URL__) {
    return __API_BASE_URL__;
  }

  // Auto-detect based on current domain
  const hostname = window.location.hostname;

  // Local development
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return __API_DEV_URL__ || "http://localhost:5000";
  }

  // Production - API on same server
  if (hostname === "3.224.168.58") {
    return "http://3.224.168.58:5000";
  }

  // Fallback
  return "http://3.224.168.58:5000";
};

export const API_CONFIG = {
  baseUrl: getApiBaseUrl(),
  endpoints: {
    adminLogin: "/api/v1/admin/login",
    adminLogout: "/api/v1/admin/logout",
    adminForgetPassword: "/api/v1/admin/forgot-password",
    adminResendOtp: "/api/v1/admin/resend-otp",
    adminVerifyResetOtp: "/api/v1/admin/verify-reset-otp",
    adminResetPassword: "/api/v1/admin/reset-password",
    adminChangePassword: "/api/v1/admin/change-password",
    adminChangeEmailRequest: "/api/v1/admin/change-email/request",
    adminVerifyChangeEmailOtp: "/api/v1/admin/change-email/verify-otp",
  },
};

// Helper to build full endpoint URL
export const getEndpointUrl = (endpoint: string): string => {
  return `${API_CONFIG.baseUrl}${endpoint}`;
};

// Debug: log if you need to check which URL is being used
if (import.meta.env.DEV) {
  console.log("🔗 API Base URL:", API_CONFIG.baseUrl);
}
