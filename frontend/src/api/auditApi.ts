import client from './client';

export const getAuditLogs = async (projectId: string) => {
  const response = await client.get(`/api/audit-logs?projectId=${projectId}`);
  return response.data;
};
