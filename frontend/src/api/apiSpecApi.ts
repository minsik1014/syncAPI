import client from './client';
import { mockApiSpecApi } from './mockApi';

const isGuest = () => {
  const userStr = localStorage.getItem('user');
  return userStr && JSON.parse(userStr).email === 'guest@syncapi.com';
};

export const getApiSpecs = async (projectId: string) => {
  if (isGuest()) return mockApiSpecApi.getApiSpecs(projectId);
  const response = await client.get(`/api/specs?projectId=${projectId}`);
  return response.data;
};

export const createApiSpec = async (projectId: string, folderId: string, data: any) => {
  if (isGuest()) return mockApiSpecApi.createApiSpec(projectId, folderId, data);
  const response = await client.post('/api/specs', { ...data, projectId, folderId });
  return response.data;
};

export const updateApiSpec = async (apiSpecId: string, data: any) => {
  if (isGuest()) return mockApiSpecApi.updateApiSpec(apiSpecId, data);
  const response = await client.put(`/api/specs/${apiSpecId}`, data);
  return response.data;
};

export const deleteApiSpec = async (apiSpecId: string) => {
  if (isGuest()) return mockApiSpecApi.deleteApiSpec(apiSpecId);
  const response = await client.delete(`/api/specs/${apiSpecId}`);
  return response.data;
};
