import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;
let accessToken = null;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

axiosInstance.interceptors.request.use((config)=>{
    if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
},(error)=>Promise.reject(error)
);

axiosInstance.interceptors.response.use((response) => response,
    async(error)=>{
        const originalRequest = error.config;

        if(error.response?.status == 401 && !originalRequest._retry){
            originalRequest._retry = true;
            try {
                const {data} = await axios.post(`${API_BASE_URL}/auth/refresh`,{},{withCredentials:true});
                accessToken = data.accessToken;
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch (referror) {
                window.location.href = '/login';
                return Promise.reject(referror);
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