import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useStore, ApiItem, Field } from '../store/useStore';
import { parseJsonToFields } from '../utils/jsonParser';
import { parseOpenApi } from '../utils/openapiParser';
import { exportToPostman } from '../utils/exportUtils';

export function useApiEditor(projectId: string | null) {
  const { apiTrees, updateApi, projects, importFolders } = useStore();
  
  const folders = projectId ? (apiTrees[projectId] || []) : [];
  const currentProject = projects.find(p => p.id === projectId);

  const [selectedApiId, setSelectedApiId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [editingApi, setEditingApi] = useState<ApiItem | null>(null);
  
  const [activeTab, setActiveTab] = useState<'spec' | 'mock' | 'code' | 'history'>('spec');
  const [requestTab, setRequestTab] = useState<'params' | 'headers' | 'body'>('params');
  const [responseTab, setResponseTab] = useState<'headers' | 'body'>('body');
  const [codeTab, setCodeTab] = useState<'axios' | 'react-query' | 'json'>('axios');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState('');
  
  const [showImportModal, setShowImportModal] = useState(false);
  const [showSwaggerModal, setShowSwaggerModal] = useState(false);
  const [showCreateApiModal, setShowCreateApiModal] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [swaggerJson, setSwaggerJson] = useState('');
  const [importTarget, setImportTarget] = useState<{ category: 'request' | 'response', type: 'body' | 'headers' } | null>(null);

  useEffect(() => {
    if (folders.length > 0 && folders[0].apis.length > 0 && !selectedApiId) {
      const firstApi = folders[0].apis[0];
      setSelectedApiId(firstApi.id);
      setEditingApi({ ...firstApi });
      setSelectedFolderId(folders[0].id);
    }
  }, [projectId, folders, selectedApiId]);

  const handleSelectApi = (api: ApiItem) => {
    setSelectedApiId(api.id);
    setEditingApi({ ...api });
    setActiveTab('spec');
  };

  const handleDeleteApi = (apiId: string) => {
    if (!projectId || !window.confirm('정말 이 API를 삭제하시겠습니까?')) return;
    useStore.getState().deleteApi(projectId, apiId);
    if (selectedApiId === apiId) {
      setSelectedApiId(null);
      setEditingApi(null);
    }
    toast.success('API가 삭제되었습니다.');
  };

  const handleRenameApi = (apiId: string, currentName: string) => {
    const newName = prompt('API 이름을 입력하세요:', currentName);
    if (newName && newName !== currentName && projectId) {
      updateApi(projectId, apiId, { name: newName });
      if (editingApi?.id === apiId) {
        setEditingApi({ ...editingApi, name: newName });
      }
    }
  };

  const onUpdateMethod = (method: ApiItem['method']) => {
    if (!editingApi || !projectId || !selectedApiId) return;
    const updated = { ...editingApi, method };
    setEditingApi(updated);
    updateApi(projectId, selectedApiId, { method });
  };

  const handleSave = () => {
    if (!projectId || !selectedApiId || !editingApi) return;
    updateApi(projectId, selectedApiId, editingApi);
    toast.success('API 명세가 저장되었습니다!');
  };

  const updateField = (category: 'request' | 'response', type: 'params' | 'headers' | 'body', id: string, updates: Partial<Field>) => {
    if (!editingApi) return;
    const updatedApi = { ...editingApi };
    const fields = category === 'request' ? updatedApi.request[type] : updatedApi.response[type as 'headers' | 'body'];
    const updatedFields = fields.map(f => f.id === id ? { ...f, ...updates } : f);
    
    if (category === 'request') updatedApi.request[type] = updatedFields;
    else updatedApi.response[type as 'headers' | 'body'] = updatedFields;
    setEditingApi(updatedApi);
  };

  const addField = (category: 'request' | 'response', type: 'params' | 'headers' | 'body') => {
    if (!editingApi) return;
    const newField: Field = { id: Date.now().toString(), name: '', type: 'string', required: false, description: '' };
    const updatedApi = { ...editingApi };
    if (category === 'request') updatedApi.request[type] = [...updatedApi.request[type], newField];
    else updatedApi.response[type as 'headers' | 'body'] = [...updatedApi.response[type as 'headers' | 'body'], newField];
    setEditingApi(updatedApi);
  };

  const removeField = (category: 'request' | 'response', type: 'params' | 'headers' | 'body', id: string) => {
    if (!editingApi) return;
    const updatedApi = { ...editingApi };
    if (category === 'request') updatedApi.request[type] = updatedApi.request[type].filter(f => f.id !== id);
    else updatedApi.response[type as 'headers' | 'body'] = updatedApi.response[type as 'headers' | 'body'].filter(f => f.id !== id);
    setEditingApi(updatedApi);
  };

  const handleSendRequest = async () => {
    if (!editingApi) return;
    setIsLoading(true);
    setResponseData('');
    
    const delay = editingApi.mockConfig?.delay || 0;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    const forcedError = editingApi.mockConfig?.forcedError;
    if (forcedError) {
      setResponseData(JSON.stringify({ status: forcedError, error: 'Error', message: `Forced ${forcedError} error` }, null, 2));
      toast.error(`Mock API 요청 실패 (${forcedError})`);
    } else {
      const mockRes: any = {};
      editingApi.response.body.forEach(f => {
        mockRes[f.name || 'key'] = f.type === 'number' ? 123 : f.type === 'boolean' ? true : `mock_${f.name}`;
      });
      setResponseData(JSON.stringify(mockRes, null, 2));
      toast.success('Mock API 요청 성공!');
    }
    setIsLoading(false);
  };

  const handleImportJson = () => {
    if (!editingApi || !importTarget || !importJson.trim()) return;
    try {
      const newFields = parseJsonToFields(importJson);
      const updatedApi = { ...editingApi };
      if (importTarget.category === 'request') updatedApi.request[importTarget.type] = [...updatedApi.request[importTarget.type], ...newFields];
      else updatedApi.response[importTarget.type] = [...updatedApi.response[importTarget.type], ...newFields];
      setEditingApi(updatedApi);
      setShowImportModal(false);
      toast.success('JSON 필드가 생성되었습니다!');
    } catch (e) {
      toast.error('JSON 파싱 실패');
    }
  };

  const handleImportSwagger = () => {
    if (!projectId || !swaggerJson.trim()) return;
    try {
      const newFolders = parseOpenApi(swaggerJson);
      importFolders(projectId, newFolders);
      setShowSwaggerModal(false);
      setSwaggerJson('');
      toast.success('Swagger 임포트 성공!');
    } catch (e) {
      toast.error('Swagger 파싱 실패');
    }
  };

  const handleCreateFolder = () => {
    if (!projectId) return;
    const folderName = prompt('폴더 이름을 입력하세요:', 'New Folder');
    if (folderName) {
      useStore.getState().addFolder(projectId, folderName);
      toast.success('폴더가 생성되었습니다!');
    }
  };

  const handleRenameFolder = (folderId: string, currentName: string) => {
    const newName = prompt('폴더 이름을 입력하세요:', currentName);
    if (newName && newName !== currentName && projectId) {
      useStore.getState().updateFolder(projectId, folderId, { name: newName });
    }
  };

  const handleDeleteFolder = (folderId: string) => {
    if (!projectId || !window.confirm('폴더와 내부 API가 모두 삭제됩니다. 계속하시겠습니까?')) return;
    useStore.getState().deleteFolder(projectId, folderId);
    if (selectedFolderId === folderId) setSelectedFolderId(null);
    toast.success('폴더가 삭제되었습니다.');
  };

  const handleCreateApi = (name: string, method: ApiItem['method']) => {
    if (!projectId) return;

    let targetFolderId = selectedFolderId;
    if (!targetFolderId) {
      if (folders.length > 0) {
        targetFolderId = folders[0].id;
      } else {
        const defaultFolderName = '기본 폴더';
        const newFolderId = `folder-${Date.now()}`;
        useStore.getState().addFolder(projectId, defaultFolderName);
        targetFolderId = newFolderId;
      }
    }

    const newApi: ApiItem = {
      id: `api-${Date.now()}`,
      name: name,
      method: method,
      path: '/api/new-endpoint',
      description: '이 API에 대한 설명을 입력하세요.',
      request: { params: [], headers: [], body: [] },
      response: { headers: [], body: [], statusCode: 200 },
      mockConfig: { delay: 0, forcedError: null }
    };

    const currentFolders = useStore.getState().apiTrees[projectId] || [];
    const finalFolderId = targetFolderId || (currentFolders.length > 0 ? currentFolders[0].id : '');

    if (finalFolderId) {
      useStore.getState().addApi(projectId, finalFolderId, newApi);
      handleSelectApi(newApi);
      toast.success(`'${name}' API가 추가되었습니다!`);
      setShowCreateApiModal(false);
    }
  };

  return {
    folders,
    currentProject,
    selectedApiId,
    selectedFolderId,
    setSelectedFolderId,
    editingApi,
    setEditingApi,
    activeTab,
    setActiveTab,
    requestTab,
    setRequestTab,
    responseTab,
    setResponseTab,
    codeTab,
    setCodeTab,
    searchQuery,
    setSearchQuery,
    isLoading,
    responseData,
    showImportModal,
    setShowImportModal,
    showSwaggerModal,
    setShowSwaggerModal,
    showCreateApiModal,
    setShowCreateApiModal,
    importJson,
    setImportJson,
    swaggerJson,
    setSwaggerJson,
    setImportTarget,
    handleSelectApi,
    handleDeleteApi,
    handleRenameApi,
    onUpdateMethod,
    handleSave,
    updateField,
    addField,
    removeField,
    handleSendRequest,
    handleImportJson,
    handleImportSwagger,
    handleCreateApi,
    handleCreateFolder,
    handleRenameFolder,
    handleDeleteFolder,
    onExportPostman: () => currentProject && folders && exportToPostman(currentProject, folders)
  };
}
