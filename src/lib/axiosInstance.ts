import { setLoggedIn } from "@/store/authSlice";
import axios from "axios";

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_API_URL}api/`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshAuthToken = async (): Promise<string> => {
  try {
    const response = await axios.post<string>(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}api/auth/refresh`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Refresh token failed");
  }
};

interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const addToFailedQueue = (
  resolve: (token: string) => void,
  reject: (error: unknown) => void
): void => {
  failedQueue.push({ resolve, reject });
};

const processQueue = (error: unknown, token: string | null): void => {
  for (const { resolve, reject } of failedQueue) {
    if (token) {
      resolve(token);
    } else {
      reject(error);
    }
  }
  failedQueue = [];
};

const redirectToLogin = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwtToken");
    setLoggedIn(false)
    window.location.href = "/login";
  }
};

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token && config?.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const is401 = error.response?.status === 401;
    const isRetry = originalRequest._retry;

    if (is401 && !isRetry) {
      originalRequest._retry = true;
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          addToFailedQueue(resolve, reject);
        }).then((newToken: string) => {
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newToken}`,
          };
          return instance(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const newToken = await refreshAuthToken();
        localStorage.setItem("jwtToken", newToken);
        setLoggedIn(true)

        instance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newToken}`;

        processQueue(null, newToken);
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        redirectToLogin();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
