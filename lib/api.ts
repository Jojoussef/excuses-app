import axios from "axios";

// Create an Axios instance with default config

if (process.env.NEXT_PUBLIC_BACKEND_URL === undefined) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors in development
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", error);
    }

    // Rethrow the error for the component to handle
    return Promise.reject(error);
  }
);
