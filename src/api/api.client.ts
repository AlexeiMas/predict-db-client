import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import storage from "../services/storage.service";
import { routes } from "../routes";

const baseURL = process.env.REACT_APP_API_URI || "http://localhost:3001/v1/";
const api = axios.create({ baseURL, timeout: 90000 });

api.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const token = storage.get("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      const token = storage.get("refresh_token");

      try {
        const response = await api.post(`${baseURL}auth/refresh`, { token });

        const credentials = {
          accessToken: response.data.credentials.accessToken,
          refreshToken: response.data.credentials.refreshToken,
          accessExpMS: response.data.credentials.accessExpMS,
          refreshExpMS: response.data.credentials.refreshExpMS,
        };

        storage.set("access_token", credentials.accessToken);
        storage.set("refresh_token", credentials.refreshToken);
        storage.set("access_token_expires", credentials.accessExpMS);
        storage.set("refresh_token_expires", credentials.refreshExpMS);

        return api.request(originalRequest);
      } catch (e) {
        storage.clear();
        window.location.href = routes.signIn;
      }
    }

    return error.response;
  }
);

export default api;
