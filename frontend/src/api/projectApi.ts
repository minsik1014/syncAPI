import client from './client';

export const getProjects = async (userId?: string) => {
  const url = userId ? `/api/projects?userId=${userId}` : '/api/projects';
  const response = await client.get(url);
  return response.data;
};

export const createProject = async (data: { title: string; description: string; baseUrl?: string; userId?: string }) => {
  const response = await client.post('/api/projects', data);
  return response.data;
};

export const deleteProjectApi = async (projectId: string) => {
  const response = await client.delete(`/api/projects/${projectId}`);
  return response.data;
};
