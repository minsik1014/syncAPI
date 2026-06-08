import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { useStore } from '../store/useStore';

export function useDashboard(projects: any[], onAddProject: (p: any) => Promise<string | null>, onSelectProject: (id: string) => void, onCloseModal: () => void) {
  const { apiTrees, fetchProjects } = useStore();

  // 대시보드 마운트 시 최신 통계(projects)를 다시 불러오기 위해 fetchProjects 호출
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const chartData = useMemo(() => {
    return projects.map(p => {
      let count = p.apiCount;
      if (typeof count !== 'number' || isNaN(count)) {
        const folders = apiTrees[p.id] || [];
        count = folders.reduce((sum, f) => sum + f.apis.length, 0);
      }
      return {
        name: p.title.length > 8 ? p.title.substring(0, 8) + '...' : p.title,
        apiCount: count,
        requests: p.todayRequests || 0
      };
    });
  }, [projects, apiTrees]);

  const totalApis = chartData.reduce((acc, data) => acc + data.apiCount, 0);
  const totalRequests = chartData.reduce((acc, data) => acc + data.requests, 0);
  
  // 전체 평균 응답속도 계산 (요청이 있는 프로젝트들의 평균, 없으면 0)
  const projectsWithLatency = projects.filter(p => p.avgLatency && p.avgLatency > 0);
  const avgLatency = projectsWithLatency.length > 0
    ? Math.round(projectsWithLatency.reduce((acc, p) => acc + p.avgLatency, 0) / projectsWithLatency.length)
    : 0;

  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      toast.error('프로젝트 이름을 입력해주세요');
      return;
    }

    const newProject = {
      title: newProjectName,
      description: newProjectDescription || '새로운 프로젝트입니다',
    };

    const savedId = await onAddProject(newProject);
    onCloseModal();
    setNewProjectName('');
    setNewProjectDescription('');
    
    if (savedId) {
      toast.success('프로젝트가 생성되었습니다!');
      onSelectProject(savedId);
    }
  };

  return {
    chartData,
    totalApis,
    totalRequests,
    avgLatency,
    newProjectName,
    setNewProjectName,
    newProjectDescription,
    setNewProjectDescription,
    handleCreateProject
  };
}
