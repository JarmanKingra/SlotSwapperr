import axios from "axios";

export const BASE_URL = "https://slotswapperr-ox2y.onrender.com/";

const clientServer = axios.create({
    baseURL: BASE_URL
})

clientServer.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default clientServer;
