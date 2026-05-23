import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;
let accessToken = null;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

axiosInstance.interceptors.request.use((config)=>{
    // Don't add Bearer token to refresh requests
    if(accessToken && !config.url?.includes('/auth/refresh')){
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
},(error)=>Promise.reject(error)
);

axiosInstance.interceptors.response.use((response) => response,
    async(error)=>{
        const originalRequest = error.config;

        // If refresh endpoint itself fails, don't retry
        if (originalRequest.url?.includes('/auth/refresh')) {
            clearAccessToken();
            return Promise.reject(error);
        }

        // Only retry once for 401 errors on non-refresh requests
        if(error.response?.status == 401 && !originalRequest._retry){
            originalRequest._retry = true;
            try {
                const {data} = await axios.post(`${API_BASE_URL}/auth/refresh`,{},{withCredentials:true});
                setAccessToken(data.accessToken);
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Clear token and redirect to login on refresh failure
                clearAccessToken();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
)

export function setAccessToken(token) {
  accessToken = token;
}

export function clearAccessToken() {
  accessToken = null;
}

export default axiosInstance;