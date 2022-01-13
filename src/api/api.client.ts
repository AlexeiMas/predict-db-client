import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { storageService } from "../services";
import { routes } from "../routes";

const isLocal = /localhost/gi.test(window.location.hostname);
const baseURL = isLocal ? "http://localhost:3000/v1/" : process.env.REACT_APP_API_URL;
const api = axios.create({ baseURL, timeout: 90000 });

api.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const token = storageService.get("access_token");

    if (token) {
      if (config && config.headers) config.headers.Authorization = `Bearer ${token}`;
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
      const token = storageService.get("refresh_token");

      try {
        const response = await api.post(`${baseURL}auth/refresh`, { token });

        const credentials = {
          accessToken: response.data.credentials.accessToken,
          refreshToken: response.data.credentials.refreshToken,
          accessExpMS: response.data.credentials.accessExpMS,
          refreshExpMS: response.data.credentials.refreshExpMS,
        };

        storageService.set("access_token", credentials.accessToken);
        storageService.set("refresh_token", credentials.refreshToken);
        storageService.set("access_token_expires", credentials.accessExpMS);
        storageService.set("refresh_token_expires", credentials.refreshExpMS);

        return api.request(originalRequest);
      } catch (e) {
        storageService.clear();
        window.location.href = routes.signIn;
      }
    }

    return error.response;
  }
);

export default api;
