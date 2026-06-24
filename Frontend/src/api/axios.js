import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://freelancer-marketplace-local.loca.lt/api/",
  headers: {
    "bypass-tunnel-reminder": "true",
  }
});

export default api;