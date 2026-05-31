import React from 'react';
import { Layers, Zap, FileJson, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { copyToClipboard } from '../../utils/clipboard';
import { generateAxiosCode, generateReactQueryCode, generateSampleJson } from '../../utils/codeGenerator';
import { ApiItem } from '../../store/useStore';

interface CodeGeneratorProps {
  editingApi: ApiItem;
  codeTab: 'axios' | 'react-query' | 'json';
  setCodeTab: (tab: 'axios' | 'react-query' | 'json') => void;
}

export default function CodeGenerator({
  editingApi,
  codeTab,
  setCodeTab,
}: CodeGeneratorProps) {
  const getCodeSnippet = () => {
    switch (codeTab) {
      case 'axios': return generateAxiosCode(editingApi);
      case 'react-query': return generateReactQueryCode(editingApi);
      case 'json': return generateSampleJson(editingApi.response.body);
      default: return '';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-gray-50 bg-gray-50/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight truncate">Code Generator</h2>
              <p className="text-gray-500 font-medium mt-1 text-sm md:text-base">명세서를 기반으로 자동 생성된 연동 코드입니다.</p>
            </div>
            <div className="flex bg-white p-1 rounded-2xl border border-gray-200 shadow-sm flex-shrink-0 self-start md:self-center overflow-x-auto no-scrollbar">
              {[
                { id: 'axios', label: 'Axios', icon: Layers },
                { id: 'react-query', label: 'React Query', icon: Zap },
                { id: 'json', label: 'JSON Sample', icon: FileJson },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setCodeTab(t.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${
                    codeTab === t.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <t.icon size={12} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={async () => {
                  await copyToClipboard(getCodeSnippet());
                  toast.success('코드가 클립보드에 복사되었습니다!');
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl text-xs font-bold hover:bg-white/20 transition-all"
              >
                <Copy size={14} />
                코드 복사
              </button>
            </div>
            <pre className="bg-gray-900 text-blue-400 p-10 rounded-[2rem] font-mono text-sm overflow-auto max-h-[600px] shadow-2xl border border-gray-800 leading-relaxed">
              {getCodeSnippet()}
            </pre>
          </div>
          
          <div className="mt-8 flex items-center gap-3 p-6 bg-blue-50 rounded-2xl border border-blue-100">
            <Zap className="text-blue-500" size={20} fill="currentColor" />
            <p className="text-xs font-bold text-blue-700 leading-relaxed">
              <span className="block mb-1">PRO TIP</span>
              위 코드를 복사하여 프런트엔드 프로젝트의 <code className="bg-blue-100 px-1.5 py-0.5 rounded">/api</code> 폴더에 붙여넣으면 즉시 통신이 가능합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
