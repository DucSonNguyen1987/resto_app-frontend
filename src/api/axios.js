import axios from 'axios';
import { setAccessToken } from '../reducers/userSlice';

let store;

export const injectStore = _store => {
  store = _store
}

// Dans Vite, les variables d'environnement sont accessibles via import.meta.env
// et doivent être préfixées par VITE_ au lieu de NEXT_PUBLIC_
const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
    headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        if (store) {
            // Get token from the centralized user state
            const accessToken = store.getState()?.user?.value?.accessToken;
            
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
                console.log('✅ Token ajouté à la requête:', config.url);
                console.log('Token utilisé:', accessToken.substring(0, 10) + '...');  // Loggez une partie du token pour vérification
            } else {
                console.log('❌ Pas de token disponible pour:', config.url);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
  
        // If the error status is 403 and there is no originalRequest._retry flag,
        // it means the token has expired and we need to refresh it
        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry && store) {
            originalRequest._retry = true;
  
            try {
                const refreshToken = store.getState()?.user?.value?.refreshToken;
                if (refreshToken) {
                    console.log('Attempting to refresh token...');
                    const response = await api.post('/auth/refreshToken', { refreshToken });
                    const { accessToken } = response.data;
        
                    store.dispatch(setAccessToken(accessToken));
    
                    // Retry the original request with the new accessToken
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return axios(originalRequest);
                }
            } catch (refreshError) {
                // Handle refresh token error or redirect to login
                console.error('Error refreshing token:', refreshError);
            }
        }
  
        return Promise.reject(error);
    }
);

export default api;