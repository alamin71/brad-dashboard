import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { toast, type Id } from "react-toastify";
import { API_CONFIG } from "../config/apiConfig";

export const apiClient = axios.create({
  baseURL: API_CONFIG.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

type ApiRequestConfig = InternalAxiosRequestConfig & {
  metadata?: {
    loadingToastId?: Id;
  };
};

const getApiErrorMessage = (error: AxiosError): string => {
  const responseData = error.response?.data;

  if (
    responseData &&
    typeof responseData === "object" &&
    "message" in responseData &&
    typeof responseData.message === "string"
  ) {
    return responseData.message;
  }

  if (error.message === "Network Error") {
    return "Network error. Please check your connection.";
  }

  return error.message || "API request failed.";
};

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const nextConfig = config as ApiRequestConfig;

  nextConfig.metadata = {
    ...nextConfig.metadata,
    loadingToastId: toast.loading("Loading..."),
  };

  return nextConfig;
});

apiClient.interceptors.response.use(
  (response) => {
    const config = response.config as ApiRequestConfig;

    if (config.metadata?.loadingToastId) {
      toast.dismiss(config.metadata.loadingToastId);
    }

    return response;
  },
  (error: AxiosError) => {
    const config = error.config as ApiRequestConfig | undefined;

    if (config?.metadata?.loadingToastId) {
      toast.dismiss(config.metadata.loadingToastId);
    }

    toast.error(getApiErrorMessage(error));
    return Promise.reject(error);
  },
);
