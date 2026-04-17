import { API_CONFIG } from "../config/apiConfig";
import { apiClient } from "./apiClient";
import { tokenStorage } from "./authService";

export type AdminPolicyType =
  | "privacy-policy"
  | "terms-conditions"
  | "about-app";

export interface AdminPolicy {
  _id?: string;
  type: AdminPolicyType;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

interface PolicyResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data?: AdminPolicy | AdminPolicy[];
}

interface UpsertPolicyPayload {
  title: string;
  content: string;
}

const getRequiredAccessToken = (): string => {
  const token = tokenStorage.getAccessToken();

  if (!token) {
    throw new Error("Session expired. Please sign in again.");
  }

  return token;
};

const getAuthHeaders = () => {
  const token = getRequiredAccessToken();

  return {
    Authorization: `Bearer ${token}`,
  };
};

const policyBaseEndpoint = API_CONFIG.endpoints.adminPolicy;

const normalizePolicy = (policy: AdminPolicy): AdminPolicy => ({
  ...policy,
  title: policy.title ?? "",
  content: policy.content ?? "",
});

export const policyService = {
  getAllPolicies: async (): Promise<AdminPolicy[]> => {
    const response = await apiClient.get<PolicyResponse>(policyBaseEndpoint, {
      headers: getAuthHeaders(),
    });

    const payload = response.data.data;

    if (!payload) {
      return [];
    }

    if (Array.isArray(payload)) {
      return payload.map(normalizePolicy);
    }

    return [normalizePolicy(payload)];
  },

  getPolicyByType: async (type: AdminPolicyType): Promise<AdminPolicy> => {
    const response = await apiClient.get<PolicyResponse>(
      `${policyBaseEndpoint}/${type}`,
      {
        headers: getAuthHeaders(),
      },
    );

    const payload = response.data.data;

    if (!payload || Array.isArray(payload)) {
      throw new Error("Policy response is not in expected format.");
    }

    return normalizePolicy(payload);
  },

  createPolicy: async (
    type: AdminPolicyType,
    payload: UpsertPolicyPayload,
  ): Promise<AdminPolicy> => {
    const response = await apiClient.post<PolicyResponse>(
      `${policyBaseEndpoint}/${type}`,
      payload,
      {
        headers: getAuthHeaders(),
      },
    );

    const responsePayload = response.data.data;

    if (!responsePayload || Array.isArray(responsePayload)) {
      throw new Error("Policy create response is not in expected format.");
    }

    return normalizePolicy(responsePayload);
  },

  updatePolicy: async (
    type: AdminPolicyType,
    payload: UpsertPolicyPayload,
  ): Promise<AdminPolicy> => {
    const response = await apiClient.patch<PolicyResponse>(
      `${policyBaseEndpoint}/${type}`,
      payload,
      {
        headers: getAuthHeaders(),
      },
    );

    const responsePayload = response.data.data;

    if (!responsePayload || Array.isArray(responsePayload)) {
      throw new Error("Policy update response is not in expected format.");
    }

    return normalizePolicy(responsePayload);
  },
};
