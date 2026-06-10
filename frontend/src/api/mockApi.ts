import { v4 as uuidv4 } from 'uuid';

// 인메모리 가짜 데이터베이스 (새로고침 전까지 유지)
let mockProjects = [
  {
    id: 'mock-proj-1',
    title: '쇼핑몰 API (SyncShop)',
    description: '쇼핑몰 서비스 구축을 위한 핵심 API 명세서입니다.',
    baseUrl: 'https://api.syncshop.com',
    status: 'active',
    createdAt: new Date().toISOString(),
    apiCount: 4,
    todayRequests: 1205,
    avgLatency: 45
  }
];

let mockFolders = [
  { id: 'mock-folder-1', name: '회원 관리 (Users)', projectId: 'mock-proj-1' },
  { id: 'mock-folder-2', name: '상품 관리 (Products)', projectId: 'mock-proj-1' }
];

let mockApis = [
  {
    id: 'mock-api-1',
    projectId: 'mock-proj-1',
    folderId: 'mock-folder-1',
    title: '회원 가입',
    method: 'POST',
    endpoint: '/users/signup',
    description: '신규 회원을 등록합니다.',
    request: { body: [{ id: uuidv4(), name: 'email', type: 'string', required: true }] },
    response: { body: [{ id: uuidv4(), name: 'status', type: 'number', required: true }] }
  },
  {
    id: 'mock-api-2',
    projectId: 'mock-proj-1',
    folderId: 'mock-folder-2',
    title: '상품 목록 조회',
    method: 'GET',
    endpoint: '/products',
    description: '전체 상품 목록을 가져옵니다.',
    request: { queryParams: [{ id: uuidv4(), name: 'page', type: 'number', required: false }] },
    response: { body: [{ id: uuidv4(), name: 'items', type: 'array', required: true }] }
  }
];

let mockMembers = [
  {
    id: 'mock-member-1',
    projectId: 'mock-proj-1',
    userId: 'mock-guest-id',
    email: 'guest@syncapi.com',
    name: '게스트',
    role: 'OWNER'
  }
];

export const mockAuthApi = {
  login: async (data: any) => {
    return {
      accessToken: 'fake-access-token',
      refreshToken: 'fake-refresh-token',
      id: 'mock-guest-id',
      name: '게스트',
      email: 'guest@syncapi.com'
    };
  }
};

export const mockProjectApi = {
  getProjects: async () => mockProjects,
  createProject: async (data: any) => {
    const newProj = {
      id: `mock-proj-${Date.now()}`,
      title: data.title,
      description: data.description,
      baseUrl: data.baseUrl || '',
      status: 'active',
      createdAt: new Date().toISOString(),
      apiCount: 0,
      todayRequests: 0,
      avgLatency: 0
    };
    mockProjects = [newProj, ...mockProjects];
    
    mockMembers.push({
      id: `mock-member-${Date.now()}`,
      projectId: newProj.id,
      userId: 'mock-guest-id',
      email: 'guest@syncapi.com',
      name: '게스트',
      role: 'OWNER'
    });
    return newProj;
  },
  deleteProjectApi: async (id: string) => {
    mockProjects = mockProjects.filter(p => p.id !== id);
  }
};

export const mockFolderApi = {
  getFolders: async (projectId: string) => mockFolders.filter(f => f.projectId === projectId),
  createFolder: async (projectId: string, name: string) => {
    const newFolder = { id: `mock-folder-${Date.now()}`, name, projectId };
    mockFolders.push(newFolder);
    return newFolder;
  },
  updateFolder: async (id: string, name: string) => {
    const folder = mockFolders.find(f => f.id === id);
    if (folder) folder.name = name;
  },
  deleteFolder: async (id: string) => {
    mockFolders = mockFolders.filter(f => f.id !== id);
  }
};

export const mockApiSpecApi = {
  getApiSpecs: async (projectId: string) => mockApis.filter(a => a.projectId === projectId),
  createApiSpec: async (projectId: string, folderId: string, data: any) => {
    const newApi = { ...data, id: `mock-api-${Date.now()}`, projectId, folderId };
    mockApis.push(newApi);
    return newApi;
  },
  updateApiSpec: async (id: string, data: any) => {
    const idx = mockApis.findIndex(a => a.id === id);
    if (idx !== -1) mockApis[idx] = { ...mockApis[idx], ...data };
  },
  deleteApiSpec: async (id: string) => {
    mockApis = mockApis.filter(a => a.id !== id);
  }
};

export const mockMemberApi = {
  getMembers: async (projectId: string) => mockMembers.filter(m => m.projectId === projectId),
  inviteMember: async (projectId: string, email: string, role: string) => {
    const newMember = { id: `mock-member-${Date.now()}`, projectId, userId: `user-${Date.now()}`, email, name: email.split('@')[0], role };
    mockMembers.push(newMember);
    return newMember;
  },
  removeMember: async (id: string) => {
    mockMembers = mockMembers.filter(m => m.id !== id);
  },
  updateMemberRole: async (id: string, role: string) => {
    const member = mockMembers.find(m => m.id === id);
    if (member) member.role = role;
    return member;
  }
};

export const mockAuditApi = {
  getAuditLogs: async (projectId: string) => {
    return [
      {
        id: 'mock-log-1',
        projectId,
        actionType: 'CREATE',
        targetId: 'mock-api-1',
        details: 'API 명세를 생성했습니다.',
        userName: '게스트',
        createdAt: new Date().toISOString()
      }
    ];
  }
};
