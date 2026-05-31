import React from 'react';
import { Download, Save } from 'lucide-react';
import { ApiItem } from '../../store/useStore';

interface EditorHeaderProps {
  editingApi: ApiItem;
  onUpdateApiName: (name: string) => void;
  onUpdateMethod: (method: ApiItem['method']) => void;
  onSave: () => void;
  onExportPostman: () => void;
}

const httpMethods: ApiItem['method'][] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

export default function EditorHeader({
  editingApi,
  onUpdateApiName,
  onUpdateMethod,
  onSave,
  onExportPostman,
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
    <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-6 flex-1">
        {/* Method Badge Group */}
        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
          {httpMethods.map((m) => (
            <button
              key={m}
              onClick={() => onUpdateMethod(m)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${getMethodColor(m, editingApi.method === m)}`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="flex-1">
          <input
            type="text"
            value={editingApi.name}
            onChange={(e) => onUpdateApiName(e.target.value)}
            className="text-lg font-bold text-gray-900 bg-transparent border-0 focus:ring-0 p-0 w-full"
          />
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
              {editingApi.path}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={onExportPostman}
          title="Postman Export"
          className="p-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center"
        >
          <Download size={18} />
        </button>
        <button 
          onClick={onSave}
          title="저장하기"
          className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-100 flex items-center justify-center"
        >
          <Save size={18} />
        </button>
      </div>
    </header>
  );
}
