import React from 'react';
import { Search, Folder, Star, Plus, Edit2, Trash2, ChevronRight, ChevronDown, Users } from 'lucide-react';
import { FolderItem, ApiItem } from '../../store/useStore';

interface EditorSidebarProps {
  projectId: string | null;
  folders: FolderItem[];
  selectedApiId: string | null;
  selectedFolderId: string | null;
  onSelectApi: (api: ApiItem) => void;
  onSelectFolder: (folderId: string) => void;
  onAddApi: () => void;
  onDeleteApi: (apiId: string) => void;
  onRenameApi: (apiId: string, currentName: string) => void;
  onAddFolder: () => void;
  onRenameFolder: (folderId: string, currentName: string) => void;
  onDeleteFolder: (folderId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenMemberModal?: () => void;
  readOnly?: boolean;
}

export default function EditorSidebar({
  folders,
  selectedApiId,
  selectedFolderId,
  onSelectApi,
  onSelectFolder,
  onAddApi,
  onDeleteApi,
  onRenameApi,
  onAddFolder,
  onRenameFolder,
  onDeleteFolder,
  searchQuery,
  onSearchChange,
  onOpenMemberModal,
  readOnly,
}: EditorSidebarProps) {
  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-blue-600 bg-blue-50';
      case 'POST': return 'text-green-600 bg-green-50';
      case 'PUT': return 'text-orange-600 bg-orange-50';
      case 'DELETE': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <aside className="w-64 border-r border-gray-100 flex flex-col bg-gray-50/30">
      <div className="p-4 border-b border-gray-100 bg-white">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="엔드포인트 검색..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {folders.map((folder) => (
          <div key={folder.id} className="space-y-1">
            <div 
              onClick={() => onSelectFolder(folder.id)}
              className={`group flex items-center justify-between px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                selectedFolderId === folder.id ? 'bg-blue-50 text-blue-700' : 'text-gray-400 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Folder size={12} className={selectedFolderId === folder.id ? 'text-blue-500' : 'text-gray-300'} />
                <span className="text-[11px] font-bold uppercase tracking-widest truncate">{folder.name}</span>
              </div>
              {!readOnly && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onRenameFolder(folder.id, folder.name); }}
                    className="p-1 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 size={10} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteFolder(folder.id); }}
                    className="p-1 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-0.5">
              {folder.apis
                .filter(api => 
                  api.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  api.path.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((api) => (
                <div 
                  key={api.id}
                  className="group relative"
                >
                  <button
                    onClick={() => onSelectApi(api)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                      selectedApiId === api.id
                        ? 'bg-white shadow-sm border border-gray-100 text-blue-600 ring-1 ring-black/5'
                        : 'text-gray-600 hover:bg-gray-100/50'
                    }`}
                  >
                    <span className={`w-10 text-[9px] font-black text-center py-0.5 rounded ${getMethodColor(api.method)}`}>
                      {api.method}
                    </span>
                    <span className="text-xs font-semibold truncate flex-1 text-left">{api.name}</span>
                    {api.isFavorite && <Star size={10} className="fill-yellow-400 text-yellow-400" />}
                  </button>
                  
                  {/* API Actions */}
                  {!readOnly && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-inherit pr-1">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onRenameApi(api.id, api.name); }}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 size={10} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteApi(api.id); }}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100 bg-white space-y-2">
        {!readOnly && (
          <>
            <button 
              onClick={onAddFolder}
              className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all shadow-sm"
            >
              <Folder size={14} className="text-gray-400" />
              폴더 추가
            </button>
            <button 
              onClick={onAddApi}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-sm shadow-gray-200"
            >
              <Plus size={16} />
              API 추가 {selectedFolderId ? '(선택됨)' : ''}
            </button>
          </>
        )}
        <button 
          onClick={onOpenMemberModal}
          className="w-full flex items-center justify-center gap-2 py-2 mt-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all shadow-sm"
        >
          <Users size={14} />
          팀원 및 권한 관리
        </button>
      </div>
    </aside>
  );
}
