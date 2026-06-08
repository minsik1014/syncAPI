import React from 'react';
import FieldTable from './FieldTable';
import { ApiItem, Field } from '../../store/useStore';

interface SpecEditorProps {
  editingApi: ApiItem;
  onUpdateApiPath: (path: string) => void;
  requestTab: 'params' | 'headers' | 'body';
  setRequestTab: (tab: 'params' | 'headers' | 'body') => void;
  responseTab: 'headers' | 'body';
  setResponseTab: (tab: 'headers' | 'body') => void;
  onUpdateField: (category: 'request' | 'response', type: 'params' | 'headers' | 'body', id: string, updates: Partial<Field>) => void;
  onRemoveField: (category: 'request' | 'response', type: 'params' | 'headers' | 'body', id: string) => void;
  onAddField: (category: 'request' | 'response', type: 'params' | 'headers' | 'body') => void;
  onOpenImport: (category: 'request' | 'response', type: 'body' | 'headers') => void;
  readOnly?: boolean;
}

export default function SpecEditor({
  editingApi,
  onUpdateApiPath,
  requestTab,
  setRequestTab,
  responseTab,
  setResponseTab,
  onUpdateField,
  onRemoveField,
  onAddField,
  onOpenImport,
  readOnly,
}: SpecEditorProps) {
  return (
    <div className="max-w-5xl space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Endpoint Path Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
            Endpoint
          </h3>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="bg-gray-100 px-3 py-2 rounded-lg text-gray-400 font-mono text-xs">BASE_URL</div>
          <input
            type="text"
            value={editingApi.path}
            onChange={(e) => onUpdateApiPath(e.target.value)}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
        </div>
      </section>

      {/* Request Section */}
      <section className="space-y-4">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-4 bg-green-600 rounded-full" />
          Request
        </h3>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-100 px-6 pt-3">
            {['params', 'headers', 'body'].map((t) => (
              <button
                key={t}
                onClick={() => setRequestTab(t as any)}
                className={`px-4 py-3 text-xs font-bold transition-all relative capitalize ${
                  requestTab === t ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {t}
                {requestTab === t && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
              </button>
            ))}
          </div>
          <div className="p-6 bg-gray-50/30">
            <FieldTable
              fields={editingApi.request[requestTab]}
              category="request"
              type={requestTab}
              onUpdateField={onUpdateField}
              onRemoveField={onRemoveField}
              onAddField={onAddField}
              onOpenImport={onOpenImport}
              readOnly={readOnly}
            />
          </div>
        </div>
      </section>

      {/* Response Section */}
      <section className="space-y-4">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-4 bg-purple-600 rounded-full" />
          Response
        </h3>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-100 px-6 pt-3">
            {['headers', 'body'].map((t) => (
              <button
                key={t}
                onClick={() => setResponseTab(t as any)}
                className={`px-4 py-3 text-xs font-bold transition-all relative capitalize ${
                  responseTab === t ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {t}
                {responseTab === t && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
              </button>
            ))}
            <div className="flex-1" />
            <div className="px-4 py-3 text-xs font-bold text-green-600">200 OK</div>
          </div>
          <div className="p-6 bg-gray-50/30">
            <FieldTable
              fields={editingApi.response[responseTab]}
              category="response"
              type={responseTab}
              onUpdateField={onUpdateField}
              onRemoveField={onRemoveField}
              onAddField={onAddField}
              onOpenImport={onOpenImport}
              readOnly={readOnly}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
