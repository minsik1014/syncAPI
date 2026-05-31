import React from 'react';
import { Activity, Copy, Play } from 'lucide-react';
import { toast } from 'sonner';
import { copyToClipboard } from '../../utils/clipboard';
import { ApiItem } from '../../store/useStore';

interface MockTesterProps {
  projectId: string;
  editingApi: ApiItem;
  isLoading: boolean;
  responseData: string;
  onUpdateMockConfig: (updates: any) => void;
  onSendRequest: () => void;
}

export default function MockTester({
  projectId,
  editingApi,
  isLoading,
  responseData,
  onUpdateMockConfig,
  onSendRequest,
}: MockTesterProps) {
  const getMethodBgColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-600';
      case 'POST': return 'bg-green-600';
      case 'PUT': return 'bg-orange-600';
      case 'DELETE': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300 pb-20">
      {/* Simulation Config Card */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-8">
        <div className="flex items-center justify-between border-b border-gray-50 pb-6">
          <div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Simulation Settings</h3>
            <p className="text-gray-500 text-sm font-medium mt-1">응답 지연 및 에러 상황을 자유롭게 설정하세요.</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
            <Activity size={24} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Network Latency (ms)</label>
              <span className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                {editingApi.mockConfig?.delay || 0}ms
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={editingApi.mockConfig?.delay || 0}
              onChange={(e) => onUpdateMockConfig({ delay: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Forced Error Status</label>
            <div className="grid grid-cols-4 gap-2">
              {[null, 400, 401, 403, 404, 500, 502, 503].map((code) => (
                <button
                  key={code === null ? 'null' : code}
                  onClick={() => onUpdateMockConfig({ forcedError: code })}
                  className={`py-2.5 rounded-xl text-xs font-black transition-all border ${
                    editingApi.mockConfig?.forcedError === code
                      ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-200'
                      : code === null
                      ? 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100'
                      : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'
                  }`}
                >
                  {code === null ? 'SUCCESS' : code}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">Target Endpoint</h3>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-lg text-[10px] font-black text-white ${getMethodBgColor(editingApi.method)}`}>
              {editingApi.method}
            </span>
            <code className="text-xs font-bold text-gray-400 font-mono">{editingApi.path}</code>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-5 bg-gray-900 rounded-[2rem] group border border-gray-800 shadow-2xl">
          <code className="flex-1 text-xs font-mono text-blue-400 overflow-hidden truncate">
            https://mock.syncapi.dev/p-{projectId}{editingApi.path}
          </code>
          <button 
            onClick={() => {
              copyToClipboard(`https://mock.syncapi.dev/p-${projectId}${editingApi.path}`);
              toast.success('URL 복사 완료');
            }}
            className="p-3 text-gray-500 hover:text-white transition-colors"
          >
            <Copy size={20} />
          </button>
        </div>
        
        <div className="flex justify-center py-6">
          <button
            onClick={onSendRequest}
            disabled={isLoading}
            className="group relative flex items-center gap-4 px-12 py-6 bg-gray-900 text-white rounded-[2rem] text-2xl font-black hover:bg-black hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-gray-300 disabled:opacity-50 overflow-hidden"
          >
            {isLoading && <div className="absolute inset-0 bg-blue-600/20 animate-pulse" />}
            <Play size={28} className={isLoading ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'} />
            <span>{isLoading ? 'SIMULATING...' : 'TEST API'}</span>
          </button>
        </div>

        {responseData && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] px-2">
              <span className="text-gray-400">Response Analysis</span>
              <span className={editingApi.mockConfig?.forcedError ? 'text-red-500' : 'text-green-500'}>
                {editingApi.mockConfig?.forcedError ? `ERROR ${editingApi.mockConfig.forcedError}` : '200 OK'}
              </span>
            </div>
            <div className="bg-gray-900 p-8 rounded-[2.5rem] shadow-2xl border border-gray-800">
              <pre className={`text-sm font-mono overflow-auto max-h-[400px] leading-relaxed ${editingApi.mockConfig?.forcedError ? 'text-red-400' : 'text-blue-400'}`}>
                {responseData}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
