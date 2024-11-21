//src/utils/api.ts

import axios from "axios";

const base_url = "http://localhost:5000/api";

export const $api = axios.create({ baseURL: base_url });

$api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.url !== "/auth/register") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
