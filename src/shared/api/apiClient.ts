import axios from "axios";

// eslint-disable-next-line import/no-named-as-default-member
export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

// Add response interceptor to simulate network latency (800ms) and log request status
apiClient.interceptors.response.use(
  async (response) => {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Mock latency
    return response;
  },
  (error) => {
    console.error("API client error response:", error.response || error.message);
    return Promise.reject(error);
  }
);
