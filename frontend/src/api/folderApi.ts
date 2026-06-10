import client from './client';
import { mockFolderApi } from './mockApi';

const isGuest = () => {
  const userStr = localStorage.getItem('user');
  return userStr && JSON.parse(userStr).email === 'guest@syncapi.com';
};

export const getFolders = async (projectId: string) => {
  if (isGuest()) return mockFolderApi.getFolders(projectId);
  const response = await client.get(`/api/folders?projectId=${projectId}`);
  return response.data;
};

export const createFolder = async (projectId: string, name: string) => {
  if (isGuest()) return mockFolderApi.createFolder(projectId, name);
  const response = await client.post('/api/folders', { projectId, name });
  return response.data;
};

export const updateFolder = async (folderId: string, name: string) => {
  if (isGuest()) return mockFolderApi.updateFolder(folderId, name);
  const response = await client.put(`/api/folders/${folderId}`, { name });
  return response.data;
};

export const deleteFolder = async (folderId: string) => {
  if (isGuest()) return mockFolderApi.deleteFolder(folderId);
  await client.delete(`/api/folders/${folderId}`);
};
