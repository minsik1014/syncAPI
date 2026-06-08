import React from 'react';
import { Download, Save } from 'lucide-react';
import { ApiItem } from '../../store/useStore';

interface EditorHeaderProps {
  editingApi: ApiItem;
  onUpdateApiName: (name: string) => void;
  onUpdateMethod: (method: ApiItem['method']) => void;
  onSave: () => void;
  onExportPostman: () => void;
  readOnly?: boolean;
}

const httpMethods: ApiItem['method'][] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

export default function EditorHeader({
  editingApi,
  onUpdateApiName,
  onUpdateMethod,
  onSave,
  onExportPostman,
  readOnly,
}: EditorHeaderProps) {
  const getMethodColor = (method: string, isActive: boolean) => {
    if (!isActive) return 'bg-gray-100 text-gray-400 hover:bg-gray-200';
    switch (method) {
      case 'GET': return 'bg-blue-600 text-white shadow-lg shadow-blue-100';
      case 'POST': return 'bg-green-600 text-white shadow-lg shadow-green-100';
      case 'PUT': return 'bg-orange-600 text-white shadow-lg shadow-orange-100';
      case 'DELETE': return 'bg-red-600 text-white shadow-lg shadow-red-100';
      case 'PATCH': return 'bg-purple-600 text-white shadow-lg shadow-purple-100';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm animate-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="space-y-4 flex-1 min-w-0">
          <div className="flex items-center gap-4 w-full">
            <input
              type="text"
              value={editingApi.name}
              onChange={(e) => onUpdateApiName(e.target.value)}
              disabled={readOnly}
              className="text-3xl font-black bg-transparent border-none focus:ring-0 p-0 text-gray-900 placeholder:text-gray-300 flex-1 min-w-0 disabled:bg-transparent disabled:opacity-80"
              placeholder="API 이름을 입력하세요"
            />
            <div className="shrink-0 bg-gray-50/80 rounded-xl px-4 py-2 border border-gray-100/50 font-mono text-sm text-gray-500 flex items-center backdrop-blur-sm max-w-[250px] sm:max-w-[300px] md:max-w-[400px]">
              <span className="text-gray-400 select-none mr-1 shrink-0">/</span>
              <span className="truncate block">{editingApi.path}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex shrink-0 bg-gray-50/80 p-1.5 rounded-xl border border-gray-100/50 backdrop-blur-sm">
              {httpMethods.map((m) => (
                <button
                  key={m}
                  onClick={() => onUpdateMethod(m)}
                  disabled={readOnly}
                  className={`px-4 py-2 rounded-lg text-xs font-black tracking-widest transition-all duration-300 ${getMethodColor(m, editingApi.method === m)}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onExportPostman}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all duration-300 shadow-sm"
          >
            <Download size={18} />
            <span className="text-sm">포스트맨 내보내기</span>
          </button>
          {!readOnly && (
            <button
              onClick={onSave}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-white bg-gray-900 hover:bg-black transition-all duration-300 shadow-[0_8px_16px_-6px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_20px_-6px_rgba(0,0,0,0.4)] hover:-translate-y-0.5"
            >
              <Save size={18} />
              <span className="text-sm tracking-wide">저장하기</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
