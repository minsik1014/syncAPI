package com.syncapi.service;

import com.syncapi.dto.project.ProjectRequestDto;
import com.syncapi.dto.project.ProjectResponseDto;
import com.syncapi.model.Project;
import com.syncapi.model.ProjectMember;
import com.syncapi.model.User;
import com.syncapi.repository.ProjectMemberRepository;
import com.syncapi.repository.ProjectRepository;
import com.syncapi.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository, ProjectMemberRepository projectMemberRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.projectMemberRepository = projectMemberRepository;
    }

    public List<ProjectResponseDto> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(ProjectResponseDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProjectResponseDto createProject(ProjectRequestDto requestDto) {
        // 1. 누가 프로젝트를 만들었는지(생성자) 확인
        if (requestDto.getUserId() == null) {
            throw new IllegalArgumentException("프로젝트 생성자(userId)가 필요합니다.");
        }
        User user = userRepository.findById(requestDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // 2. 프로젝트 저장
        Project project = Project.builder()
                .title(requestDto.getTitle())
                .description(requestDto.getDescription())
                .baseUrl(requestDto.getBaseUrl())
                .status("active")
                .build();
        Project savedProject = projectRepository.save(project);

        // 3. 생성자를 프로젝트의 OWNER 권한으로 즉시 등록
        ProjectMember owner = ProjectMember.builder()
                .project(savedProject)
                .user(user)
                .role("OWNER")
                .build();
        projectMemberRepository.save(owner);
        
        return ProjectResponseDto.from(savedProject);
    }
}
