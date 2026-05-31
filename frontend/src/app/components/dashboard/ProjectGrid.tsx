import React from 'react';
import { Plus, Code, Calendar } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  apiCount: number;
  status: 'active' | 'inactive';
}

interface ProjectGridProps {
  projects: Project[];
  onSelectProject: (id: string) => void;
  onOpenModal: () => void;
}

export default function ProjectGrid({
  projects,
  onSelectProject,
  onOpenModal,
}: ProjectGridProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Recent Projects</h3>
        <p className="text-sm font-bold text-blue-600 cursor-pointer hover:underline">View All</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => onSelectProject(project.id)}
            className="group bg-white rounded-[2.5rem] border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden text-left p-8 space-y-6"
          >
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                <Code size={28} />
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                project.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'
              }`}>
                {project.status}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">{project.title}</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-2">{project.description}</p>
            </div>
            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code size={16} className="text-blue-500" />
                <span className="text-xs font-bold text-gray-900">{project.apiCount} APIs</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400">
                <Calendar size={14} />
                <span className="text-[10px] font-bold uppercase">{formatDate(project.createdAt)}</span>
              </div>
            </div>
          </button>
        ))}

        <button
          onClick={onOpenModal}
          className="bg-white rounded-[2.5rem] border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300 p-8 flex flex-col items-center justify-center min-h-[300px] group"
        >
          <div className="w-16 h-16 rounded-3xl bg-gray-50 group-hover:bg-blue-100 flex items-center justify-center mb-6 transition-all duration-500 group-hover:rotate-90">
            <Plus size={32} className="text-gray-300 group-hover:text-blue-600" strokeWidth={3} />
          </div>
          <p className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors">New Project</p>
        </button>
      </div>
    </div>
  );
}
