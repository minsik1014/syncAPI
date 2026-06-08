import client from './client';

// 프로젝트 멤버 초대
export const inviteMember = async (projectId: string, email: string, role: string) => {
  const response = await client.post('/api/members/invite', { projectId, email, role });
  return response.data;
};

// 프로젝트 멤버 목록 조회
export const getMembers = async (projectId: string) => {
  const response = await client.get(`/api/members?projectId=${projectId}`);
  return response.data;
};

// 멤버 추방
export const removeMember = async (memberId: string) => {
  await client.delete(`/api/members/${memberId}`);
};

// 도메인(폴더) 개별 권한 부여
export const grantFolderPermission = async (folderId: string, userId: string, role: string) => {
  const response = await client.post('/api/folders/permissions', { folderId, userId, role });
  return response.data;
};

// 특정 폴더의 권한 목록 조회
export const getFolderPermissions = async (folderId: string) => {
  const response = await client.get(`/api/folders/permissions?folderId=${folderId}`);
  return response.data;
};

// 팀원 권한 수정
export const updateMemberRole = async (memberId: string, role: string) => {
  const response = await client.put(`/api/members/${memberId}/role`, { role });
  return response.data;
};
