import React, { useState } from 'react';
import { FileCode, Terminal, Play, History, Code, X, Zap, Box, Plus } from 'lucide-react';
import { useApiEditor } from '../hooks/useApiEditor';
import EditorSidebar from '../components/api-editor/EditorSidebar';
import EditorHeader from '../components/api-editor/EditorHeader';
import SpecEditor from '../components/api-editor/SpecEditor';
import CodeGenerator from '../components/api-editor/CodeGenerator';
import MockTester from '../components/api-editor/MockTester';
import { MemberManagementModal } from '../../components/MemberManagementModal';
import { useMemberStore } from '../../store/useMemberStore';
import { ApiItem } from '../types/api';
import { generateEndpointFromName } from '../utils/endpointGenerator';

interface ApiEditorProps {
  projectId: string | null;
}

const httpMethods: ApiItem['method'][] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

export default function ApiEditor({ projectId }: ApiEditorProps) {
  const {
    folders,
    selectedApiId,
    selectedFolderId,
    setSelectedFolderId,
    editingApi,
    setEditingApi,
    activeTab,
    setActiveTab,
    activities,
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
    onExportPostman,
  } = useApiEditor(projectId);

  // 멤버 및 권한 로직
  const { members, fetchMembers } = useMemberStore();
  React.useEffect(() => {
    if (projectId) fetchMembers(projectId);
  }, [projectId]);
  
  const currentUserStr = localStorage.getItem('user');
  const currentUserId = currentUserStr ? JSON.parse(currentUserStr).id : null;
  const currentMember = members.find(m => m.userId === currentUserId);
  // 방장 확인 또는 권한 설정 (로컬에선 일단 멤버 목록을 보고 판단)
  const currentUserRole = currentMember?.role || 'VIEWER';
  const isViewer = currentUserRole === 'VIEWER';

  // New API Modal State
  const [newApiName, setNewApiName] = useState('');
  const [newApiMethod, setNewApiMethod] = useState<ApiItem['method']>('GET');
  const [newApiPath, setNewApiPath] = useState('');
  const [showMemberModal, setShowMemberModal] = useState(false);

  React.useEffect(() => {
    if (newApiName.trim()) {
      const generated = generateEndpointFromName(newApiName);
      setNewApiPath(generated.path);
      setNewApiMethod(generated.method as ApiItem['method']);
    } else {
      setNewApiPath('');
      setNewApiMethod('GET');
    }
  }, [newApiName]);

  const getMethodColor = (method: string, isActive: boolean) => {
    if (!isActive) return 'bg-gray-100 text-gray-400 hover:bg-gray-200';
    switch (method) {
      case 'GET': return 'bg-blue-600 text-white';
      case 'POST': return 'bg-green-600 text-white';
      case 'PUT': return 'bg-orange-600 text-white';
      case 'DELETE': return 'bg-red-600 text-white';
      case 'PATCH': return 'bg-purple-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  if (!projectId) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6 border border-gray-100">
            <Code className="text-gray-300" size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">프로젝트를 선택하세요</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-white">
      <EditorSidebar
        projectId={projectId}
        folders={folders}
        selectedApiId={selectedApiId}
        selectedFolderId={selectedFolderId}
        onSelectApi={handleSelectApi}
        onSelectFolder={setSelectedFolderId}
        onAddApi={() => setShowCreateApiModal(true)}
        onDeleteApi={handleDeleteApi}
        onRenameApi={handleRenameApi}
        onAddFolder={handleCreateFolder}
        onRenameFolder={handleRenameFolder}
        onDeleteFolder={handleDeleteFolder}
        readOnly={isViewer}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenMemberModal={() => setShowMemberModal(true)}
      />

      {/* Main Content */}
      {editingApi ? (
        <main className="flex-1 flex flex-col overflow-hidden bg-gray-50/50">
          <EditorHeader
            editingApi={editingApi}
            onUpdateApiName={(name) => {
              const generated = generateEndpointFromName(name, editingApi.method);
              setEditingApi({ 
                ...editingApi, 
                name,
                path: generated.path,
                method: generated.method as ApiItem['method']
              });
            }}
            onUpdateMethod={onUpdateMethod}
            onSave={handleSave}
            onExportPostman={onExportPostman}
            readOnly={isViewer}
          />
          <div className="bg-white px-8 border-b border-gray-100 shadow-sm z-10">
            <div className="flex gap-8">
              {[
                { id: 'spec', label: 'API 명세', icon: FileCode },
                { id: 'code', label: '코드 생성기', icon: Terminal },
                { id: 'mock', label: 'Mock 테스트', icon: Play },
                { id: 'history', label: '변경 이력', icon: History },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 text-sm font-bold transition-all relative flex items-center gap-2 ${
                    activeTab === tab.id ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            {activeTab === 'spec' && (
              <SpecEditor
                editingApi={editingApi}
                onUpdateApiPath={(path) => setEditingApi({ ...editingApi, path })}
                requestTab={requestTab}
                setRequestTab={setRequestTab}
                responseTab={responseTab}
                setResponseTab={setResponseTab}
                onUpdateField={updateField}
                onRemoveField={removeField}
                onAddField={addField}
                onOpenImport={(cat, type) => {
                  setImportTarget({ category: cat, type });
                  setShowImportModal(true);
                  setImportJson('');
                }}
                readOnly={isViewer}
              />
            )}
            {activeTab === 'code' && (
              <CodeGenerator editingApi={editingApi} codeTab={codeTab} setCodeTab={setCodeTab} />
            )}
            {activeTab === 'mock' && (
              <MockTester
                projectId={projectId}
                editingApi={editingApi}
                isLoading={isLoading}
                responseData={responseData}
                onUpdateMockConfig={(updates) => setEditingApi({ ...editingApi, mockConfig: { ...editingApi.mockConfig, ...updates } })}
                onSendRequest={handleSendRequest}
              />
            )}
            {activeTab === 'history' && (
              <div className="max-w-3xl mx-auto py-10 space-y-8">
                {activities && projectId && activities[projectId]?.filter(a => a.targetId === editingApi.id).length > 0 ? (
                  <div className="relative pl-8 space-y-8">
                    <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-200" />
                    {activities[projectId].filter(a => a.targetId === editingApi.id).map((activity, idx) => (
                      <div key={activity.id} className="relative animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                        <div className="absolute -left-12 flex items-center justify-center w-8 h-8">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm relative z-20 text-blue-600">
                            <span className="text-[10px] font-bold">{activity.user.name[0]}</span>
                          </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 text-sm">{activity.user.name}</span>
                              <span className="text-gray-500 text-sm">님이 명세를</span>
                              {(() => {
                                let action = activity.action;
                                if (activity.target && activity.target !== editingApi.id) {
                                  const lines = activity.target.split('\n');
                                  const hasAdd = lines.some(l => l.startsWith('+'));
                                  const hasSub = lines.some(l => l.startsWith('-'));
                                  const hasMod = lines.some(l => l.startsWith('±') || (!l.startsWith('+') && !l.startsWith('-')));
                                  if (hasAdd && !hasSub && !hasMod) action = '추가';
                                  else if (!hasAdd && hasSub && !hasMod) action = '삭제';
                                  else action = '수정';
                                }
                                return (
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    action === '생성' || action === '추가' ? 'bg-green-50 text-green-600' :
                                    action === '수정' ? 'bg-blue-50 text-blue-600' :
                                    'bg-red-50 text-red-600'
                                  }`}>{action}</span>
                                );
                              })()}
                              <span className="text-gray-500 text-sm">했습니다.</span>
                            </div>
                            <span className="text-xs text-gray-400 font-medium">{activity.timeAgo}</span>
                          </div>
                          {activity.target && activity.target !== editingApi.id && (
                            <div className="mt-4">
                              <div className="text-xs font-bold text-gray-400 mb-1.5 ml-1">Changes Summary</div>
                              <div className="text-xs text-gray-300 bg-[#0d1117] p-4 rounded-xl border border-gray-800 font-mono whitespace-pre-wrap leading-relaxed shadow-inner">
                                {activity.target.split('\n').map((line: string, i: number) => {
                                  if (line.startsWith('+')) return <div key={i} className="text-[#3fb950] font-bold bg-[#2ea0431a] px-2 py-0.5 rounded -mx-2">{line}</div>;
                                  if (line.startsWith('-')) return <div key={i} className="text-[#f85149] font-bold bg-[#f851491a] px-2 py-0.5 rounded -mx-2">{line}</div>;
                                  if (line.startsWith('±')) return <div key={i} className="text-[#58a6ff] font-medium bg-[#388bfd1a] px-2 py-0.5 rounded -mx-2">{line}</div>;
                                  return <div key={i} className="px-2 py-0.5">{line}</div>;
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <History className="text-gray-300 mx-auto mb-6" size={48} />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">변경 이력이 없습니다</h3>
                    <p className="text-gray-500 text-sm">이 API의 수정 내역이 아직 기록되지 않았습니다.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <p className="text-gray-400 font-medium">API를 선택하여 편집을 시작하세요</p>
        </div>
      )}

      {/* --- Modals --- */}

      {/* Create API Modal */}
      {showCreateApiModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-gray-900">새로운 API 추가</h3>
              <button onClick={() => setShowCreateApiModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">API Name</label>
                <input
                  type="text"
                  value={newApiName}
                  onChange={(e) => setNewApiName(e.target.value)}
                  placeholder="예: 사용자 정보 조회"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all font-medium"
                  autoFocus
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">HTTP Method</label>
                <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                  {httpMethods.map((m) => (
                    <button
                      key={m}
                      onClick={() => setNewApiMethod(m)}
                      className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${getMethodColor(m, newApiMethod === m)}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Endpoint Path</label>
                <div className="flex bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 items-center focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                  <span className="text-gray-400 font-mono text-sm select-none">/</span>
                  <input
                    type="text"
                    value={newApiPath.replace(/^\//, '')}
                    onChange={(e) => setNewApiPath('/' + e.target.value.replace(/^\//, ''))}
                    placeholder="api/v1/resource"
                    className="w-full bg-transparent border-0 focus:ring-0 text-gray-900 font-mono text-sm p-0 ml-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={() => setShowCreateApiModal(false)}
                className="flex-1 px-8 py-4 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  handleCreateApi(newApiName || '새로운 API', newApiMethod, newApiPath);
                  setShowCreateApiModal(false);
                }}
                className="flex-2 px-10 py-4 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all font-black text-sm shadow-xl shadow-gray-200"
              >
                생성하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JSON Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-10 space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black flex items-center gap-3"><Zap className="text-purple-600" /> JSON-to-Spec</h3>
              <button onClick={() => setShowImportModal(false)}><X className="text-gray-400" /></button>
            </div>
            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder='{ "id": 1, "name": "John" }'
              rows={10}
              className="w-full bg-gray-900 text-purple-400 p-8 rounded-[2rem] font-mono"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowImportModal(false)} className="px-6 py-2 text-gray-500 font-bold">취소</button>
              <button onClick={handleImportJson} className="px-8 py-3 bg-purple-600 text-white rounded-2xl font-black">필드 생성</button>
            </div>
          </div>
        </div>
      )}

      {showSwaggerModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-3xl rounded-[2.5rem] p-10 space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black flex items-center gap-3"><Box className="text-purple-600" /> Swagger Import</h3>
              <button onClick={() => setShowSwaggerModal(false)}><X className="text-gray-400" /></button>
            </div>
            <textarea
              value={swaggerJson}
              onChange={(e) => setSwaggerJson(e.target.value)}
              placeholder='{ "openapi": "3.0.0", ... }'
              rows={12}
              className="w-full bg-gray-900 text-purple-300 p-8 rounded-[2rem] font-mono text-xs"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowSwaggerModal(false)} className="px-6 py-2 text-gray-500 font-bold">취소</button>
              <button onClick={handleImportSwagger} className="px-8 py-3 bg-purple-600 text-white rounded-2xl font-black">임포트</button>
            </div>
          </div>
        </div>
      )}

      {/* 멤버 및 권한 관리 모달 */}
      <MemberManagementModal
        projectId={projectId}
        isOpen={showMemberModal}
        onOpenChange={setShowMemberModal}
        currentUserRole={currentUserRole} 
      />
    </div>
  );
}
