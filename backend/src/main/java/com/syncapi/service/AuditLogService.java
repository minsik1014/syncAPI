package com.syncapi.service;

import com.syncapi.dto.audit.AuditLogResponseDto;
import com.syncapi.model.AuditLog;
import com.syncapi.model.Project;
import com.syncapi.model.User;
import com.syncapi.repository.AuditLogRepository;
import com.syncapi.repository.ProjectRepository;
import com.syncapi.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public AuditLogService(AuditLogRepository auditLogRepository, ProjectRepository projectRepository, UserRepository userRepository) {
        this.auditLogRepository = auditLogRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    // 프로젝트의 모든 이력 최신순으로 조회
    public List<AuditLogResponseDto> getLogsByProjectId(String projectId) {
        return auditLogRepository.findByProjectIdOrderByCreatedAtDesc(projectId).stream()
                .map(AuditLogResponseDto::from)
                .collect(Collectors.toList());
    }

    // 다른 서비스(예: ApiSpecService, FieldService)에서 특정 행동이 일어날 때마다 호출할 로그 기록 메서드
    @Transactional
    public void recordLog(String projectId, String userId, String actionType, String targetId, String details) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("프로젝트를 찾을 수 없습니다."));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        AuditLog log = AuditLog.builder()
                .project(project)
                .user(user)
                .actionType(actionType)
                .targetId(targetId)
                .details(details)
                .build();

        auditLogRepository.save(log);
    }
}
