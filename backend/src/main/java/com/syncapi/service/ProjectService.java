package com.syncapi.service;

import com.syncapi.dto.project.ProjectRequestDto;
import com.syncapi.dto.project.ProjectResponseDto;
import com.syncapi.model.Project;
import com.syncapi.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    // 프로젝트 목록 전체 조회 (Entity -> DTO 변환)
    public List<ProjectResponseDto> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(ProjectResponseDto::from)
                .collect(Collectors.toList());
    }

    // 프로젝트 생성
    @Transactional
    public ProjectResponseDto createProject(ProjectRequestDto requestDto) {
        // 1. DTO 데이터를 바탕으로 순수한 Entity 뼈대 조립
        Project project = Project.builder()
                .title(requestDto.getTitle())
                .description(requestDto.getDescription())
                .baseUrl(requestDto.getBaseUrl())
                .status("active")
                .build();

        // 2. 창고 관리자(Repository)를 통해 DB에 저장
        Project savedProject = projectRepository.save(project);
        
        // 3. 저장된 Entity를 다시 DTO 포장 박스에 담아서 반환
        return ProjectResponseDto.from(savedProject);
    }
}
