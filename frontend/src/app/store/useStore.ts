import { create } from 'zustand';
import { Project, FolderItem, ApiItem, ActivityEvent } from '../types/api';
import { INITIAL_PROJECTS, INITIAL_API_TREES, INITIAL_ACTIVITIES } from '../constants/api';

interface SyncApiState {
  projects: Project[];
  selectedProjectId: string | null;
  apiTrees: Record<string, FolderItem[]>;
  activities: Record<string, ActivityEvent[]>;
  mockStats: Record<string, { totalApis: number; todayRequests: number; avgResponseTime: number }>;
  
  // Actions
  setProjects: (projects: Project[]) => void;
  setSelectedProjectId: (id: string | null) => void;
  addProject: (project: Project) => void;
  updateApi: (projectId: string, apiId: string, updates: Partial<ApiItem>) => void;
  deleteApi: (projectId: string, apiId: string) => void;
  addApi: (projectId: string, folderId: string, api: ApiItem) => void;
  addFolder: (projectId: string, name: string) => void;
  updateFolder: (projectId: string, folderId: string, updates: Partial<FolderItem>) => void;
  deleteFolder: (projectId: string, folderId: string) => void;
  importFolders: (projectId: string, folders: FolderItem[]) => void;
}

export const useStore = create<SyncApiState>((set) => ({
  projects: INITIAL_PROJECTS,
  selectedProjectId: '1',
  apiTrees: INITIAL_API_TREES,
  activities: INITIAL_ACTIVITIES,
  mockStats: {
    '1': { totalApis: 24, todayRequests: 1847, avgResponseTime: 38 },
    '2': { totalApis: 12, todayRequests: 892, avgResponseTime: 42 },
  },

  setProjects: (projects) => set({ projects }),
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),
  addProject: (project) => set((state) => ({ 
    projects: [project, ...state.projects],
    apiTrees: { ...state.apiTrees, [project.id]: [] },
    activities: { ...state.activities, [project.id]: [] },
    mockStats: { ...state.mockStats, [project.id]: { totalApis: 0, todayRequests: 0, avgResponseTime: 0 } }
  })),
  
  updateApi: (projectId, apiId, updates) => set((state) => {
    const projectTree = state.apiTrees[projectId] || [];
    const updatedTree = projectTree.map(folder => ({
      ...folder,
      apis: folder.apis.map(api => api.id === apiId ? { ...api, ...updates } : api)
    }));
    return { apiTrees: { ...state.apiTrees, [projectId]: updatedTree } };
  }),

  deleteApi: (projectId, apiId) => set((state) => {
    const projectTree = state.apiTrees[projectId] || [];
    const updatedTree = projectTree.map(folder => ({
      ...folder,
      apis: folder.apis.filter(api => api.id !== apiId)
    }));
    return { apiTrees: { ...state.apiTrees, [projectId]: updatedTree } };
  }),

  addApi: (projectId, folderId, api) => set((state) => {
    const projectTree = state.apiTrees[projectId] || [];
    const updatedTree = projectTree.map(folder => 
      folder.id === folderId 
        ? { ...folder, apis: [...folder.apis, api] }
        : folder
    );
    return { apiTrees: { ...state.apiTrees, [projectId]: updatedTree } };
  }),

  addFolder: (projectId, name) => set((state) => {
    const projectTree = state.apiTrees[projectId] || [];
    const newFolder: FolderItem = {
      id: `folder-${Date.now()}`,
      name: name,
      isExpanded: true,
      apis: []
    };
    return { apiTrees: { ...state.apiTrees, [projectId]: [...projectTree, newFolder] } };
  }),

  updateFolder: (projectId, folderId, updates) => set((state) => {
    const projectTree = state.apiTrees[projectId] || [];
    const updatedTree = projectTree.map(folder => 
      folder.id === folderId ? { ...folder, ...updates } : folder
    );
    return { apiTrees: { ...state.apiTrees, [projectId]: updatedTree } };
  }),

  deleteFolder: (projectId, folderId) => set((state) => {
    const projectTree = state.apiTrees[projectId] || [];
    const updatedTree = projectTree.filter(folder => folder.id !== folderId);
    return { apiTrees: { ...state.apiTrees, [projectId]: updatedTree } };
  }),

  importFolders: (projectId, folders) => set((state) => ({
    apiTrees: {
      ...state.apiTrees,
      [projectId]: [...(state.apiTrees[projectId] || []), ...folders]
    }
  })),
}));
