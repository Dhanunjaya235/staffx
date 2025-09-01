import axios, { HttpStatusCode } from 'axios';

const AxiosInstance = axios.create({
  baseURL: 'http://localhost:6262',
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

AxiosInstance.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

AxiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === HttpStatusCode.Unauthorized) {
      if (window.top) {
            window.top.location.reload();
        } else if (window.parent) {
            window.parent.location.reload();
        } else {
            window.location.reload();
        }
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;

