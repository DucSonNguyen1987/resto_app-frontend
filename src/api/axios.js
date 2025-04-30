import axios from 'axios';
// import { useDispatch, useSelector } from 'react-redux';
import { setAccessToken } from '../reducers/user';

let store;

export const injectStore = _store => {
  store = _store
}


const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}`,
    headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const accessToken = store.getState().user.value.accessToken;
        console.log('interceptor!', accessToken, store.getState());
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // const dispatch = useDispatch();
        const originalRequest = error.config;
  
        // If the error status is 403 and there is no originalRequest._retry flag,
        // it means the token has expired and we need to refresh it
        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
  
            try {
                const refreshToken = store.getState().user.value.refreshToken;
                const response = await api.post('/users/refreshToken', { refreshToken });
                const { accessToken } = response.data;
    
                store.dispatch(setAccessToken(accessToken));

                // Retry the original request with the new accessToken
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axios(originalRequest);
            } catch (error) {
                // Handle refresh token error or redirect to login
                console.error(error);
            }
        }
  
        return Promise.reject(error);
    }
);

export default api