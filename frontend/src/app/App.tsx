import React, { useState } from 'react';
import { Home, FileCode, Server, History, Plus, ChevronDown } from 'lucide-react';
import { Toaster } from 'sonner';
import DashboardPage from './pages/DashboardPage';
import ApiEditorPage from './pages/ApiEditorPage';
import MockServerPage from './pages/MockServerPage';
import HistoryPage from './pages/HistoryPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { useStore } from './store/useStore';

type View = 'dashboard' | 'editor' | 'mock' | 'history';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const { 
    projects, 
    selectedProjectId, 
    setSelectedProjectId, 
    addProject 
  } = useStore();

  const navigation = [
    { id: 'dashboard' as View, label: '대시보드', icon: Home },
    { id: 'editor' as View, label: 'API 에디터', icon: FileCode },
    { id: 'mock' as View, label: '목 서버', icon: Server },
    { id: 'history' as View, label: '히스토리', icon: History },
  ];

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView('editor');
  };

  if (!isAuthenticated) {
    if (authView === 'login') {
      return <LoginPage onLogin={() => setIsAuthenticated(true)} onNavigateSignup={() => setAuthView('signup')} />;
    }
    return <SignupPage onSignup={() => setIsAuthenticated(true)} onNavigateLogin={() => setAuthView('login')} />;
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="size-full flex bg-gray-50 font-sans">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <h1 className="font-bold text-xl text-gray-900 tracking-tight">SyncAPI</h1>
            </div>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-2 ml-1">
              API Collaboration Platform
            </p>
          </div>

          {/* Workspace Area - Fixed height to prevent navigation jump */}
          <div className="h-[92px] p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col justify-center transition-all">
            {currentView === 'dashboard' ? (
              <div className="px-1 animate-in fade-in duration-500">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Status
                </label>
                <p className="text-sm font-bold text-gray-900">전체 프로젝트 리포트</p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                  Workspace
                </label>
                <div className="relative">
                  <select
                    value={selectedProjectId || ''}
                    onChange={(e) => setSelectedProjectId(e.target.value || null)}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium appearance-none pr-10 shadow-sm cursor-pointer hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">프로젝트 선택</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          <nav className="flex-1 p-4 space-y-1.5">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  currentView === item.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon size={18} />
                <span className="font-semibold text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button
              onClick={() => { setCurrentView('dashboard'); setShowCreateModal(true); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-all font-bold text-sm"
            >
              <Plus size={18} />
              <span>새 프로젝트</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {currentView === 'dashboard' && (
            <DashboardPage
              onSelectProject={handleSelectProject}
              projects={projects}
              onAddProject={addProject}
              showCreateModal={showCreateModal}
              onOpenModal={() => setShowCreateModal(true)}
              onCloseModal={() => setShowCreateModal(false)}
            />
          )}
          {currentView === 'editor' && <ApiEditorPage projectId={selectedProjectId} />}
          {currentView === 'mock' && <MockServerPage projectId={selectedProjectId} />}
          {currentView === 'history' && <HistoryPage projectId={selectedProjectId} />}
        </main>
      </div>
    </>
  );
}
