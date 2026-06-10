import client from './client';
import { mockAuditApi } from './mockApi';

const isGuest = () => {
  const userStr = localStorage.getItem('user');
  return userStr && JSON.parse(userStr).email === 'guest@syncapi.com';
};

export const getAuditLogs = async (projectId: string) => {
  if (isGuest()) return mockAuditApi.getAuditLogs(projectId);
  const response = await client.get(`/api/audit-logs?projectId=${projectId}`);
  return response.data;
};
