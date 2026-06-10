import client from './client';

export const login = async (data: any) => {
  const response = await client.post('/api/auth/login', data);
  return response.data;
};

export const signup = async (data: any) => {
  const response = await client.post('/api/auth/signup', data);
  return response.data;
};
