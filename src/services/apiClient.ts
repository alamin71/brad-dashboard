import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";

export const apiClient = axios.create({
  baseURL: API_CONFIG.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
