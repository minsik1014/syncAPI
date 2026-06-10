import client from './client';
import { mockAuthApi } from './mockApi';

export const login = async (data: any) => {
  if (data.email === 'guest' || data.email === 'guest@syncapi.com') {
    return mockAuthApi.login(data);
  }
  const response = await client.post('/api/auth/login', data);
  return response.data;
};

export const signup = async (data: any) => {
  const response = await client.post('/api/auth/signup', data);
  return response.data;
};
