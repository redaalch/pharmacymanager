import axios, { AxiosError } from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api/v1";

export const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

export type ApiErrorPayload = {
  detail?: string;
  [field: string]: unknown;
};

export class ApiError extends Error {
  status: number;
  payload: ApiErrorPayload;

  constructor(status: number, payload: ApiErrorPayload, message: string) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    const status = error.response?.status ?? 0;
    const payload = error.response?.data ?? {};
    const message =
      payload.detail ??
      (typeof Object.values(payload)[0] === "string"
        ? (Object.values(payload)[0] as string)
        : error.message);
    return Promise.reject(new ApiError(status, payload, message));
  },
);

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
