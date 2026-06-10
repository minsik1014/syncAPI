import { useState, useEffect } from 'react';
import { Copy, CheckCircle, Activity, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { copyToClipboard } from '../utils/clipboard';
import { useStore } from '../store/useStore';

interface MockServerProps {
  projectId: string | null;
}

export default function MockServer({ projectId }: MockServerProps) {
  const { apiTrees, projects, fetchApiTrees, fetchProjects } = useStore();
  const [copied, setCopied] = useState(false);

  // 컴포넌트 마운트 시 최신 API 목록과 통계를 불러옴
  useEffect(() => {
    fetchProjects();
    if (projectId && !apiTrees[projectId]) {
      fetchApiTrees(projectId);
    }
  }, [projectId, apiTrees, fetchApiTrees, fetchProjects]);

  // Get project stats from real data
  const project = projects.find(p => p.id === projectId);
  const projectFolders = projectId ? (apiTrees[projectId] || []) : [];
  
  // Flatten all APIs from all folders
  const allApis = projectFolders.flatMap(folder => folder.apis);

  const stats = project ? {
    totalApis: project.apiCount || allApis.length,
    todayRequests: project.todayRequests || 0,
    avgResponseTime: project.avgLatency || 0
  } : null;

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8082';
  const mockUrl = projectId 
    ? `${BASE_URL}/mock/${projectId}` 
    : `${BASE_URL}/mock`;

  const handleCopyUrl = async () => {
    const success = await copyToClipboard(mockUrl);
    if (success) {
      setCopied(true);
      toast.success('Mock URL이 복사되었습니다!');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('복사에 실패했습니다');
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-500 text-white';
      case 'POST': return 'bg-green-500 text-white';
      case 'PUT': return 'bg-orange-500 text-white';
      case 'DELETE': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (!projectId || !stats) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center animate-in fade-in duration-500">
          <Activity className="mx-auto text-gray-200 mb-4" size={64} />
          <h3 className="text-xl font-bold text-gray-900 mb-2">프로젝트를 선택하세요</h3>
          <p className="text-gray-500">Mock 서버 상태를 모니터링하기 위해 프로젝트 선택이 필요합니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50/50 p-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Page Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Mock Server</h1>
            <p className="text-gray-500 font-medium">실시간 API 시뮬레이션 서버 가동 현황</p>
          </div>
          <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-2xl border border-green-100">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Server Operational</span>
          </div>
        </div>

        {/* Hero Section - Mock URL */}
        <div className="relative overflow-hidden bg-gray-900 rounded-[2.5rem] p-12 shadow-2xl shadow-gray-200 group">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-600/30 transition-all duration-700" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl group-hover:bg-purple-600/20 transition-all duration-700" />
          
          <div className="relative z-10 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-blue-400 text-xs font-black uppercase tracking-[0.3em]">Global Mock Endpoint</span>
              <h2 className="text-white text-3xl font-bold">Base URL</h2>
            </div>

            <div className="flex items-center gap-4 max-w-4xl mx-auto">
              <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl text-white text-xl font-mono text-center shadow-inner">
                {baseUrl}
              </div>
              <button
                onClick={handleCopyUrl}
                className={`flex items-center gap-3 px-8 py-6 rounded-3xl transition-all font-black text-lg ${
                  copied 
                    ? 'bg-green-500 text-white scale-95' 
                    : 'bg-white text-gray-900 hover:bg-blue-50 hover:scale-105 active:scale-95'
                }`}
              >
                {copied ? <CheckCircle size={24} /> : <Copy size={24} />}
                <span>{copied ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>
            
            <p className="text-center text-gray-500 text-sm font-medium">
              프론트엔드 코드의 <code className="text-blue-400 font-mono">baseURL</code>로 설정하여 즉시 개발을 시작하세요.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Total Endpoints', value: allApis.length, icon: Activity, color: 'blue' },
            { label: 'Today Requests', value: stats.todayRequests.toLocaleString(), icon: TrendingUp, color: 'green' },
            { label: 'Avg Response Time', value: `${stats.avgResponseTime}ms`, icon: Clock, color: 'purple' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className={`w-14 h-14 bg-${item.color}-50 rounded-2xl flex items-center justify-center mb-6`}>
                <item.icon className={`text-${item.color}-500`} size={28} />
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
              <p className="text-4xl font-black text-gray-900">{item.value}</p>
              <div className="mt-4 flex items-center gap-2">
                <div className={`w-1 h-1 rounded-full bg-${item.color}-500`} />
                <span className={`text-[11px] font-bold text-${item.color}-600 uppercase`}>Real-time tracking</span>
              </div>
            </div>
          ))}
        </div>

        {/* Endpoints Table */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Active Endpoints</h2>
              <p className="text-gray-400 text-sm mt-1 font-medium">현재 기동 중인 가상 API 목록</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-500 uppercase tracking-widest border border-gray-100">
                Filter: All Methods
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-10 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Method</th>
                  <th className="px-10 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Endpoint</th>
                  <th className="px-10 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-10 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Recent Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {allApis.map((api) => (
                  <tr key={api.id} className="group hover:bg-gray-50/30 transition-colors">
                    <td className="px-10 py-6">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black shadow-sm ${getMethodColor(api.method)}`}>
                        {api.method}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <code className="text-sm font-mono font-bold text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        {api.path}
                      </code>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm font-bold text-gray-900">Active</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-xs font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
                        Called 2 mins ago
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
