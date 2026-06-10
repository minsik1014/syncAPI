import { create } from 'zustand';
import { Project, FolderItem, ApiItem, ActivityEvent } from '../types/api';
import { INITIAL_API_TREES, INITIAL_ACTIVITIES } from '../constants/api';

interface SyncApiState {
  projects: Project[];
  selectedProjectId: string | null;
  apiTrees: Record<string, FolderItem[]>;
  activities: Record<string, ActivityEvent[]>;
  mockStats: Record<string, { totalApis: number; todayRequests: number; avgResponseTime: number }>;
  
  // Actions
  fetchApiTrees: (projectId: string) => Promise<void>;
  fetchActivities: (projectId: string) => Promise<void>;
  fetchProjects: () => Promise<void>;
  setProjects: (projects: Project[]) => void;
  setSelectedProjectId: (id: string | null) => void;
  setActiveApiId: (id: string | null) => void;
  addProject: (project: Partial<Project>) => Promise<string | null>;
  deleteProject: (projectId: string) => void;
  updateApi: (projectId: string, apiId: string, updates: Partial<ApiItem>) => void;
  deleteApi: (projectId: string, apiId: string) => void;
  addApi: (projectId: string, folderId: string, api: ApiItem) => Promise<string | null>;
  addFolder: (projectId: string, name: string) => void;
  updateFolder: (projectId: string, folderId: string, updates: Partial<FolderItem>) => void;
  deleteFolder: (projectId: string, folderId: string) => void;
  importFolders: (projectId: string, folders: FolderItem[]) => void;
}

export const useStore = create<SyncApiState>((set, get) => ({
  projects: [],
  selectedProjectId: null,
  activeApiId: null,
  apiTrees: {},
  activities: INITIAL_ACTIVITIES,
  mockStats: {
    '1': { totalApis: 24, todayRequests: 1847, avgResponseTime: 38 },
    '2': { totalApis: 12, todayRequests: 892, avgResponseTime: 42 },
  },

  setProjects: (projects) => set({ projects }),
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),
  setActiveApiId: (id) => set({ activeApiId: id }),
  fetchProjects: async () => {
    try {
      const { getProjects } = await import('../../api/projectApi');
      const userStr = localStorage.getItem('user');
      const userId = userStr ? JSON.parse(userStr).id : undefined;
      const data = await getProjects(userId);
      set({ projects: data });
    } catch (e) {
      console.error("프로젝트 조회 실패", e);
    }
  },
  fetchActivities: async (projectId) => {
    try {
      const { getAuditLogs } = await import('../../api/auditApi');
      const logs = await getAuditLogs(projectId);
      
      const formattedActivities = logs.map((log: any) => {
        // Calculate timeAgo
        const diff = Date.now() - new Date(log.createdAt).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        let timeAgo = '방금 전';
        if (days > 0) timeAgo = `${days}일 전`;
        else if (hours > 0) timeAgo = `${hours}시간 전`;
        else if (minutes > 0) timeAgo = `${minutes}분 전`;

        return {
          id: log.id,
          user: {
            name: log.userName || '알 수 없는 사용자',
            avatar: '',
            role: 'MEMBER'
          },
          action: log.actionType === 'CREATE' ? '생성' : log.actionType === 'UPDATE' ? '수정' : '삭제',
          target: log.details || log.targetId,
          targetId: log.targetId,
          timestamp: log.createdAt,
          timeAgo: timeAgo,
          changes: [] // We don't have diff details yet from backend
        };
      });

      set((state) => ({ activities: { ...state.activities, [projectId]: formattedActivities } }));
    } catch (e) {
      console.error("활동 이력 조회 실패", e);
    }
  },
  fetchApiTrees: async (projectId) => {
    try {
      const { getFolders } = await import('../../api/folderApi');
      const { getApiSpecs } = await import('../../api/apiSpecApi');
      
      const folders = await getFolders(projectId);
      const apiSpecs = await getApiSpecs(projectId);
      
      // 조립 (folders 안에 apis 넣기)
      const folderMap = new Map();
      const newFolders = folders.map((f: any) => {
        const newFolder = { id: f.id, name: f.name, isExpanded: true, apis: [] };
        folderMap.set(f.id, newFolder);
        return newFolder;
      });

      apiSpecs.forEach((api: any) => {
        if (api.folderId && folderMap.has(api.folderId)) {
          folderMap.get(api.folderId).apis.push({
            id: api.id,
            method: api.method,
            path: api.endpoint,
            name: api.title,
            description: api.description || '',
            request: api.request ? {
              headers: api.request.headers || [],
              params: api.request.queryParams || [],
              body: api.request.body || []
            } : { headers: [], params: [], body: [] },
            response: api.response ? {
              headers: [], // 백엔드에 Response Header가 없으므로 빈 배열로 초기화
              body: api.response.body || [],
              statusCode: 200
            } : { headers: [], body: [], statusCode: 200 }
          });
        }
      });

      set((state) => ({ apiTrees: { ...state.apiTrees, [projectId]: newFolders } }));
    } catch (e) { console.error("API 트리 불러오기 실패", e); }
  },
  addProject: async (projectData) => {
    try {
      const { createProject } = await import('../../api/projectApi');
      const userStr = localStorage.getItem('user');
      const userId = userStr ? JSON.parse(userStr).id : undefined;

      const savedProject = await createProject({
        title: projectData.title,
        description: projectData.description,
        userId: userId
      });
      set((state) => ({ 
        projects: [savedProject, ...state.projects],
        apiTrees: { ...state.apiTrees, [savedProject.id]: [] },
        activities: { ...state.activities, [savedProject.id]: [] },
        mockStats: { ...state.mockStats, [savedProject.id]: { totalApis: 0, todayRequests: 0, avgResponseTime: 0 } }
      }));
      return savedProject.id;
    } catch (e) {
      console.error("프로젝트 생성 실패", e);
      return null;
    }
  },

  deleteProject: async (projectId) => {
    try {
      const { deleteProjectApi } = await import('../../api/projectApi');
      await deleteProjectApi(projectId);
      set((state) => ({
        projects: state.projects.filter(p => p.id !== projectId)
      }));
    } catch (e) {
      console.error("프로젝트 삭제 실패", e);
    }
  },
  
  updateApi: async (projectId, apiId, updates) => {
    try {
      const { updateApiSpec } = await import('../../api/apiSpecApi');
      const state = get();
      const projectTree = state.apiTrees[projectId] || [];
      
      // 기존 API 정보 찾기
      let oldApi: ApiItem | null = null;
      for (const folder of projectTree) {
        const found = folder.apis.find(a => a.id === apiId);
        if (found) { oldApi = found; break; }
      }

      // Diff 생성
      let logDetails = '';
      if (oldApi) {
        const diffs = [];
        if (oldApi.name !== updates.name) diffs.push(`이름 변경: ${oldApi.name} -> ${updates.name}`);
        if (oldApi.method !== updates.method) diffs.push(`메서드 변경: ${oldApi.method} -> ${updates.method}`);
        if (oldApi.path !== updates.path) diffs.push(`경로 변경: ${oldApi.path} -> ${updates.path}`);
        if (oldApi.description !== updates.description) diffs.push(`설명 변경`);
        
        const compareFields = (oldFields: any[], newFields: any[], prefix: string) => {
          const oldMap = new Map(oldFields.map(f => [f.id, f]));
          const newMap = new Map(newFields.map(f => [f.id, f]));

          // Added or Modified
          for (const [id, newF] of newMap.entries()) {
            const oldF = oldMap.get(id);
            if (!oldF) {
              diffs.push(`+ [${prefix}] 필드 추가: ${newF.name || '새 필드'} (${newF.type})`);
            } else {
              if (oldF.name !== newF.name) diffs.push(`± [${prefix}] 필드명 변경: ${oldF.name} -> ${newF.name}`);
              if (oldF.type !== newF.type) diffs.push(`± [${prefix}] ${newF.name} 타입 변경: ${oldF.type} -> ${newF.type}`);
              if (oldF.required !== newF.required) diffs.push(`± [${prefix}] ${newF.name} 필수여부 변경: ${oldF.required} -> ${newF.required}`);
              if (oldF.description !== newF.description) diffs.push(`± [${prefix}] ${newF.name} 설명 수정`);
            }
          }
          // Removed
          for (const [id, oldF] of oldMap.entries()) {
            if (!newMap.has(id)) {
              diffs.push(`- [${prefix}] 필드 삭제: ${oldF.name || '알수없음'}`);
            }
          }
        };

        compareFields(oldApi.request?.headers || [], updates.request?.headers || [], '요청 Header');
        compareFields(oldApi.request?.params || [], updates.request?.params || [], '요청 Query');
        compareFields(oldApi.request?.body || [], updates.request?.body || [], '요청 Body');
        compareFields(oldApi.response?.body || [], updates.response?.body || [], '응답 Body');

        if (diffs.length > 0) {
          logDetails = diffs.join('\n');
        } else {
          logDetails = updates.name || 'API 업데이트';
        }
      }

      const apiData = {
        title: updates.name,
        method: updates.method,
        endpoint: updates.path,
        description: updates.description,
        request: updates.request ? {
          headers: updates.request.headers,
          queryParams: updates.request.params,
          body: updates.request.body
        } : undefined,
        response: updates.response ? {
          body: updates.response.body
        } : undefined,
        userId: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string).id : undefined,
        logDetails: logDetails || updates.name
      };
      await updateApiSpec(apiId, apiData);
      await get().fetchActivities(projectId); // 저장 후 히스토리 즉시 갱신
      set((state) => {
        const projectTree = state.apiTrees[projectId] || [];
        const updatedTree = projectTree.map(folder => ({
          ...folder,
          apis: folder.apis.map(api => api.id === apiId ? { ...api, ...updates } : api)
        }));
        return { apiTrees: { ...state.apiTrees, [projectId]: updatedTree } };
      });
    } catch (e) { console.error("API 수정 실패", e); }
  },

  deleteApi: async (projectId, apiId) => {
    try {
      const { deleteApiSpec } = await import('../../api/apiSpecApi');
      await deleteApiSpec(apiId);
      await get().fetchActivities(projectId);
      set((state) => {
        const projectTree = state.apiTrees[projectId] || [];
        const updatedTree = projectTree.map(folder => ({
          ...folder,
          apis: folder.apis.filter(api => api.id !== apiId)
        }));
        return { apiTrees: { ...state.apiTrees, [projectId]: updatedTree } };
      });
    } catch (e) { console.error("API 삭제 실패", e); }
  },

  addApi: async (projectId, folderId, api) => {
    try {
      const { createApiSpec } = await import('../../api/apiSpecApi');
      const savedApi = await createApiSpec(projectId, folderId, {
        title: api.name,
        method: api.method,
        endpoint: api.path,
        description: api.description,
        request: api.request ? {
          headers: api.request.headers,
          queryParams: api.request.params,
          body: api.request.body
        } : undefined,
        response: api.response ? {
          body: api.response.body
        } : undefined,
        userId: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string).id : undefined
      });
      await get().fetchActivities(projectId);
      set((state) => {
        const projectTree = state.apiTrees[projectId] || [];
        const updatedTree = projectTree.map(folder => 
          folder.id === folderId 
            ? { ...folder, apis: [...folder.apis, { ...api, id: savedApi.id }] }
            : folder
        );
        return { apiTrees: { ...state.apiTrees, [projectId]: updatedTree } };
      });
      return savedApi.id;
    } catch (e) {
      console.error("API 생성 실패", e);
      return null;
    }
  },

  addFolder: async (projectId, name) => {
    try {
      const { createFolder } = await import('../../api/folderApi');
      const savedFolder = await createFolder(projectId, name);
      set((state) => {
        const projectTree = state.apiTrees[projectId] || [];
        const newFolder: FolderItem = {
          id: savedFolder.id,
          name: savedFolder.name,
          isExpanded: true,
          apis: []
        };
        return { apiTrees: { ...state.apiTrees, [projectId]: [...projectTree, newFolder] } };
      });
    } catch (e) { console.error("폴더 생성 실패", e); }
  },

  updateFolder: async (projectId, folderId, updates) => {
    try {
      if (updates.name) {
        const { updateFolder } = await import('../../api/folderApi');
        await updateFolder(folderId, updates.name);
      }
      set((state) => {
        const projectTree = state.apiTrees[projectId] || [];
        const updatedTree = projectTree.map(folder => 
          folder.id === folderId ? { ...folder, ...updates } : folder
        );
        return { apiTrees: { ...state.apiTrees, [projectId]: updatedTree } };
      });
    } catch (e) { console.error("폴더 수정 실패", e); }
  },

  deleteFolder: async (projectId, folderId) => {
    try {
      const { deleteFolder } = await import('../../api/folderApi');
      await deleteFolder(folderId);
      set((state) => {
        const projectTree = state.apiTrees[projectId] || [];
        const updatedTree = projectTree.filter(folder => folder.id !== folderId);
        return { apiTrees: { ...state.apiTrees, [projectId]: updatedTree } };
      });
    } catch (e) { console.error("폴더 삭제 실패", e); }
  },

  importFolders: (projectId, folders) => set((state) => ({
    apiTrees: {
      ...state.apiTrees,
      [projectId]: [...(state.apiTrees[projectId] || []), ...folders]
    }
  })),
}));
