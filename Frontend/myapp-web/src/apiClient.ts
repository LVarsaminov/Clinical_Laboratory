import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://localhost:44370",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("API Request:", config.url, config.method);
  return config;
});

apiClient.interceptors.response.use(
  response => {
    console.log("API Response:", response.status, response.data);
    return response;
  },
  error => {
    console.log("API Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export default apiClient;
