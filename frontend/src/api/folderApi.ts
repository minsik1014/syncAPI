import client from './client';

export const getFolders = async (projectId: string) => {
  const response = await client.get(`/api/folders?projectId=${projectId}`);
  return response.data;
};

export const createFolder = async (projectId: string, name: string) => {
  const response = await client.post('/api/folders', { projectId, name });
  return response.data;
};

export const updateFolder = async (folderId: string, name: string) => {
  const response = await client.put(`/api/folders/${folderId}`, { name });
  return response.data;
};

export const deleteFolder = async (folderId: string) => {
  await client.delete(`/api/folders/${folderId}`);
};
