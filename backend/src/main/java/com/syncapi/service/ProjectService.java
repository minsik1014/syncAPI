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

import com.syncapi.model.MockApiLog;
import com.syncapi.repository.ApiSpecRepository;
import com.syncapi.repository.MockApiLogRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final MockApiLogRepository mockApiLogRepository;
    private final ApiSpecRepository apiSpecRepository;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository, ProjectMemberRepository projectMemberRepository, MockApiLogRepository mockApiLogRepository, ApiSpecRepository apiSpecRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.mockApiLogRepository = mockApiLogRepository;
        this.apiSpecRepository = apiSpecRepository;
    }

    public List<ProjectResponseDto> getAllProjects(String userId) {
        List<Project> projects;
        if (userId == null || userId.isEmpty()) {
            projects = projectRepository.findAll();
        } else {
            projects = projectRepository.findProjectsByUserId(userId);
        }
        
        LocalDateTime startOfDay = LocalDateTime.now().with(LocalTime.MIN);
        
        return projects.stream()
                .map(p -> {
                    List<MockApiLog> logs = mockApiLogRepository.findByProjectIdAndCreatedAtAfter(p.getId(), startOfDay);
                    long todayRequests = logs.size();
                    long avgLatency = 0;
                    if (todayRequests > 0) {
                        long totalLatency = logs.stream().mapToLong(MockApiLog::getLatencyMs).sum();
                        avgLatency = totalLatency / todayRequests;
                    }
                    
                    long apiCount = apiSpecRepository.countByProjectId(p.getId());
                    
                    return ProjectResponseDto.fromWithStats(p, todayRequests, avgLatency, apiCount);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public ProjectResponseDto createProject(ProjectRequestDto requestDto) {
        // 1. 누가 프로젝트를 만들었는지(생성자) 확인
        User user;
        if (requestDto.getUserId() == null || requestDto.getUserId().isEmpty()) {
            // MVP용: 유저 ID가 없으면 DB의 첫 번째 유저를 가져오거나 임시 생성
            user = userRepository.findAll().stream().findFirst().orElseGet(() -> {
                User newUser = User.builder()
                        .email("admin@test.com")
                        .password("1234")
                        .name("Admin")
                        .build();
                return userRepository.save(newUser);
            });
        } else {
            user = userRepository.findById(requestDto.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        }

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

    @Transactional
    public void deleteProject(String projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new IllegalArgumentException("존재하지 않는 프로젝트입니다.");
        }
        projectRepository.deleteById(projectId);
    }
}
