import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useStore } from '../store/useStore';

export function useDashboard(projects: any[], onAddProject: (p: any) => void, onSelectProject: (id: string) => void, onCloseModal: () => void) {
  const { mockStats } = useStore();

  const chartData = useMemo(() => {
    return projects.map(p => ({
      name: p.title.length > 8 ? p.title.substring(0, 8) + '...' : p.title,
      apiCount: p.apiCount,
      requests: mockStats[p.id]?.todayRequests || 0
    }));
  }, [projects, mockStats]);

  const totalApis = projects.reduce((acc, p) => acc + p.apiCount, 0);
  const totalRequests = projects.reduce((acc, p) => acc + (mockStats[p.id]?.todayRequests || 0), 0);

  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast.error('프로젝트 이름을 입력해주세요');
      return;
    }

    const newProject = {
      id: `${Date.now()}`,
      title: newProjectName,
      description: newProjectDescription || '새로운 프로젝트입니다',
      createdAt: new Date().toISOString().split('T')[0],
      apiCount: 0,
      status: 'active',
      lastUpdated: '방금 전',
    };

    onAddProject(newProject);
    onCloseModal();
    setNewProjectName('');
    setNewProjectDescription('');
    toast.success('프로젝트가 생성되었습니다!');
    setTimeout(() => onSelectProject(newProject.id), 300);
  };

  return {
    chartData,
    totalApis,
    totalRequests,
    newProjectName,
    setNewProjectName,
    newProjectDescription,
    setNewProjectDescription,
    handleCreateProject
  };
}
