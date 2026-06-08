import { useState, useEffect } from 'react';
import { Calendar, User, Filter, History as HistoryIcon, Search } from 'lucide-react';
import { useStore } from '../store/useStore';

interface HistoryTimelineProps {
  projectId: string | null;
  onNavigateToApi?: (apiId: string) => void;
}

const users = [
  { id: 'all', name: '전체 사용자' },
  { id: '1', name: '김개발' },
  { id: '2', name: '이영희' },
  { id: '3', name: '박지훈' },
];

export default function HistoryTimeline({ projectId, onNavigateToApi }: HistoryTimelineProps) {
  const { activities, fetchActivities } = useStore();
  const [selectedUser, setSelectedUser] = useState('all');

  useEffect(() => {
    if (projectId) {
      fetchActivities(projectId);
    }
  }, [projectId]);

  // Get activities from store
  const projectActivities = projectId ? (activities[projectId] || []) : [];

  const getActionColor = (action: string) => {
    switch (action) {
      case '생성': return 'text-green-600 bg-green-50 ring-1 ring-green-100';
      case '수정': return 'text-blue-600 bg-blue-50 ring-1 ring-blue-100';
      case '삭제': return 'text-red-600 bg-red-50 ring-1 ring-red-100';
      default: return 'text-gray-600 bg-gray-50 ring-1 ring-gray-100';
    }
  };

  if (!projectId) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center animate-in fade-in duration-500">
          <HistoryIcon className="mx-auto text-gray-200 mb-4" size={64} />
          <h3 className="text-xl font-bold text-gray-900 mb-2">프로젝트를 선택하세요</h3>
          <p className="text-gray-500">활동 기록을 확인하려면 프로젝트 선택이 필요합니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50/50 p-8">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Page Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Activity Log</h1>
            <p className="text-gray-500 font-medium">실시간 API 명세 변경 이력 및 협업 타임라인</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="활동 검색..."
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
              <User size={18} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Collaborator</p>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full bg-transparent border-0 p-0 text-sm font-bold text-gray-900 focus:ring-0 cursor-pointer"
              >
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          </div>

          <div className="w-px h-10 bg-gray-100" />

          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
              <Calendar size={18} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date Range</p>
              <p className="text-sm font-bold text-gray-900">All Time</p>
            </div>
          </div>

          <button className="px-6 py-3 bg-gray-900 text-white rounded-2xl text-xs font-bold hover:bg-black transition-all shadow-md">
            <Filter size={16} className="inline mr-2" />
            Apply Filters
          </button>
        </div>

        {/* Timeline Section */}
        <div className="relative pl-12 space-y-12">
          {/* Vertical Line */}
          <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-gray-200" />

          {projectActivities.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-400 font-medium">기록된 활동이 없습니다.</p>
            </div>
          ) : (
            projectActivities.map((activity, idx) => (
              <div key={activity.id} className="relative animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                {/* Timeline Dot & Avatar */}
                <div className="absolute -left-12 flex items-center justify-center w-12 h-12">
                  <div className="absolute w-4 h-4 bg-white rounded-full ring-4 ring-gray-100 border-2 border-gray-300 z-10" />
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center border-2 border-white shadow-lg relative z-20 text-gray-400">
                    <User size={20} fill="currentColor" opacity={0.5} />
                  </div>
                </div>

                {/* Activity Card */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-gray-900">{activity.user.name}</span>
                          <span className="text-gray-400 font-medium">님이</span>
                          {(() => {
                            // API 이름 찾기
                            let apiName = '알 수 없는 API';
                            const state = useStore.getState();
                            const tree = state.apiTrees[projectId] || [];
                            for (const folder of tree) {
                              const found = folder.apis.find(a => a.id === activity.targetId);
                              if (found) { apiName = found.name; break; }
                            }
                            return (
                              <span className="font-black text-blue-600 underline decoration-2 underline-offset-4 cursor-pointer">{apiName}</span>
                            );
                          })()}
                          <span className="text-gray-400 font-medium">를</span>
                          {(() => {
                            let action = activity.action;
                            if (activity.target) {
                              const lines = activity.target.split('\n');
                              const hasAdd = lines.some(l => l.startsWith('+'));
                              const hasSub = lines.some(l => l.startsWith('-'));
                              const hasMod = lines.some(l => l.startsWith('±') || (!l.startsWith('+') && !l.startsWith('-') && lines.length > 1));
                              if (hasAdd && !hasSub && !hasMod) action = '추가';
                              else if (!hasAdd && hasSub && !hasMod) action = '삭제';
                              else action = '수정';
                            }
                            return (
                              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                action === '생성' || action === '추가' ? 'bg-green-50 text-green-600' :
                                action === '수정' ? 'bg-blue-50 text-blue-600' :
                                'bg-red-50 text-red-600'
                              }`}>{action}</span>
                            );
                          })()}
                          <span className="text-gray-400 font-medium">했습니다.</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                          <span>{activity.user.role}</span>
                          <div className="w-1 h-1 bg-gray-200 rounded-full" />
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {activity.timeAgo}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Change Diff View */}
                    {activity.target && (
                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Changes Summary</p>
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
                  
                  {/* Card Footer */}
                  <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold text-gray-400">Event ID: {activity.id}</span>
                    <button 
                      onClick={() => onNavigateToApi && onNavigateToApi(activity.targetId)}
                      className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                    >
                      View Full Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function Clock({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
