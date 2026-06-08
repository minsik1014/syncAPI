import React from 'react';
import { Plus } from 'lucide-react';
import StatsSummary from '../components/dashboard/StatsSummary';
import AnalyticsCharts from '../components/dashboard/AnalyticsCharts';
import ProjectGrid from '../components/dashboard/ProjectGrid';
import CreateProjectModal from '../components/dashboard/CreateProjectModal';
import { useDashboard } from '../hooks/useDashboard';
import { Project } from '../types/api';

interface DashboardProps {
  onSelectProject: (projectId: string) => void;
  projects: Project[];
  onAddProject: (project: Partial<Project>) => Promise<string | null>;
  showCreateModal: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onDeleteProject: (projectId: string) => void;
}

export default function Dashboard({
  onSelectProject,
  projects,
  onAddProject,
  showCreateModal,
  onOpenModal,
  onCloseModal,
  onDeleteProject,
}: DashboardProps) {
  const {
    chartData,
    totalApis,
    totalRequests,
    avgLatency,
    newProjectName,
    setNewProjectName,
    newProjectDescription,
    setNewProjectDescription,
    handleCreateProject,
  } = useDashboard(projects, onAddProject, onSelectProject, onCloseModal);

  return (
    <div className="h-full flex flex-col bg-gray-50/50 font-sans">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-12 space-y-12 animate-in fade-in duration-700">
          
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Workspace Overview</h2>
              <p className="text-gray-500 font-medium">모든 프로젝트의 활동 상태와 API 통계를 한눈에 확인하세요.</p>
            </div>
            <button
              onClick={onOpenModal}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100 active:scale-95"
            >
              <Plus size={20} strokeWidth={3} />
              새 프로젝트 생성
            </button>
          </div>

          <StatsSummary
            projectsCount={projects.length}
            totalApis={totalApis}
            totalRequests={totalRequests}
            avgLatency={avgLatency}
          />

          <AnalyticsCharts chartData={chartData} />

          <ProjectGrid
            projects={projects}
            onSelectProject={onSelectProject}
            onOpenModal={onOpenModal}
            onDeleteProject={onDeleteProject}
          />
        </div>
      </main>

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={onCloseModal}
        onCreate={handleCreateProject}
        projectName={newProjectName}
        setProjectName={setNewProjectName}
        projectDescription={newProjectDescription}
        setProjectDescription={setNewProjectDescription}
      />
    </div>
  );
}
