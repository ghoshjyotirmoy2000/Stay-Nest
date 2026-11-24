import axios from "axios";
import { store } from "../store";
import { resetAuth } from "../store/slices/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ skip refresh for these routes — avoid infinite loop
    const skipRoutes = ["/auth/signin", "/auth/signup", "/auth/refresh-token"];
    const isSkipRoute = skipRoutes.some(route => originalRequest.url?.includes(route));

    if (error.response?.status === 401 && !originalRequest._retry && !isSkipRoute) {
      originalRequest._retry = true;

      try {
        await api.get("/auth/refresh-token");
        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(resetAuth());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;