import axios from "axios";
import type { ApiResponse } from "../../types/response";
import { baseURL } from "../constants";

export const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  validateStatus: () => true,
});

export async function request<T>(promise: Promise<{ data: ApiResponse<T> }>) {
  const { data } = await promise;

  if (!data.success) {
    throw new Error(data.errors.join(", "));
  }

  return data.data;
}
