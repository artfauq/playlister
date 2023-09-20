import axios, { AxiosRequestConfig, isAxiosError } from 'axios';
import { getSession } from 'next-auth/react';

import { API_URL } from '@src/config';
import { TokenResponse } from '@src/types';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

apiClient.interceptors.request.use(async config => {
  const authHeader = config.headers.get('Authorization');

  if (!authHeader) {
    const session = await getSession();
    const accessToken = session?.accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (!isAxiosError(error) || !error.response) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const {
        data: { access_token: accessToken },
      } = await axios.post<TokenResponse>('/api/auth/refresh');

      apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      return apiClient(originalRequest);
    }

    return Promise.reject(error);
  },
);

/**
 * Make a request to the Spotify API.
 */
export const apiRequest = async <TData>(
  config: AxiosRequestConfig = {
    method: 'GET',
  },
) => {
  return apiClient<TData>(config).then(response => response.data);
};
