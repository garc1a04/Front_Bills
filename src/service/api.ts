import axios from "axios";

export const api = axios.create({baseURL: "https://apibills-production.up.railway.app", withCredentials: true});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== "/") {
          window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);