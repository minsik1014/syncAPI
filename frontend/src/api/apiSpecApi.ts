import client from './client';

export const getApiSpecs = async (projectId: string) => {
  const response = await client.get(`/api/specs?projectId=${projectId}`);
  return response.data;
};

export const createApiSpec = async (projectId: string, folderId: string, apiData: any) => {
  const response = await client.post('/api/specs', { projectId, folderId, ...apiData });
  return response.data;
};

export const updateApiSpec = async (apiId: string, apiData: any) => {
  const response = await client.put(`/api/specs/${apiId}`, apiData);
  return response.data;
};

export const deleteApiSpec = async (apiId: string) => {
  await client.delete(`/api/specs/${apiId}`);
};
