import { getToken } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const api = {
  public: {
    get: async (endpoint: string) => {
      const res = await fetch(`${BASE_URL}${endpoint}`);
      return res.json();
    },

    post: async (endpoint: string, data: Record<string, unknown>) => {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    put: async (endpoint: string, data: Record<string, unknown>) => {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return res.json();
    },

    delete: async (endpoint: string) => {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "DELETE",
      });
      return res.json();
    },
  },

  auth: {
    get: async (endpoint: string) => {
      const token = getToken();
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.json();
    },

    post: async <T = Record<string, unknown>>(endpoint: string, data: T) => {
      const token = getToken();
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return res.json();
    },

    put: async (endpoint: string, data: Record<string, unknown>) => {
      const token = getToken();
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return res.json();
    },

    delete: async (endpoint: string) => {
      const token = getToken();
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.json();
    },
  },
};
