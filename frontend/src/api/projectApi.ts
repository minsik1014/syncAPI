import client from './client';
import { mockProjectApi } from './mockApi';

const isGuest = () => {
  const userStr = localStorage.getItem('user');
  return userStr && JSON.parse(userStr).email === 'guest@syncapi.com';
};

export const getProjects = async (userId?: string) => {
  if (isGuest()) return mockProjectApi.getProjects();
  const url = userId ? `/api/projects?userId=${userId}` : '/api/projects';
  const response = await client.get(url);
  return response.data;
};

export const createProject = async (data: { title: string; description: string; baseUrl?: string; userId?: string }) => {
  if (isGuest()) return mockProjectApi.createProject(data);
  const response = await client.post('/api/projects', data);
  return response.data;
};

export const deleteProjectApi = async (projectId: string) => {
  if (isGuest()) return mockProjectApi.deleteProjectApi(projectId);
  const response = await client.delete(`/api/projects/${projectId}`);
  return response.data;
};
