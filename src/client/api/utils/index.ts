import axios, { AxiosRequestConfig } from "axios";
import { setupInterceptorsTo } from "./interceptor";

export const userInstance = (options?: AxiosRequestConfig) => {
  const instance = axios.create({ baseURL: `/api/v1/user`, ...options });

  return setupInterceptorsTo(instance);
};
