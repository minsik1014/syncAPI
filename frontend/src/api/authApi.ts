import client from './client';

export const login = async (data: any) => {
  const response = await client.post('/api/users/login', data);
  return response.data;
};

export const signup = async (data: any) => {
  const response = await client.post('/api/users/register', data);
  return response.data;
};
