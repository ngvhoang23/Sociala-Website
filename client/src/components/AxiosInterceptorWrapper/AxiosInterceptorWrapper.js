import axios from 'axios';
import { createContext } from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const AxiosInstanceContext = createContext();

function AxiosInterceptorWrapper({ children }) {
  const handeRefreshToken = () => {
    const payload = {
      refresh_token: cookies.get('REFRESH_TOKEN'),
    };
    return axiosInstance.post('/auth/refresh-token', payload);
  };

  let refreshTokenRequest = null;

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error?.response?.data?.error?.name === 'TokenExpiredError' && error.response.status === 401) {
        refreshTokenRequest = refreshTokenRequest
          ? refreshTokenRequest
          : handeRefreshToken().finally(() => {
              refreshTokenRequest = null;
            });

        return refreshTokenRequest
          .then((result) => {
            const { access_token, refresh_token } = result.data;
            cookies.set('ACCESS_TOKEN', access_token, {
              path: '/',
            });
            cookies.set('REFRESH_TOKEN', refresh_token, {
              path: '/',
            });
            error.response.config.headers.Authorization = `Bearer ${access_token}`;
            return axiosInstance(error.response.config);
          })
          .catch((err) => {
            console.log('err: ', err);
          });
      }
      return Promise.reject(error);
    },
  );

  return <AxiosInstanceContext.Provider value={axiosInstance}>{children}</AxiosInstanceContext.Provider>;
}

export default AxiosInterceptorWrapper;
