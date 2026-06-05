package com.syncapi.repository;

import com.syncapi.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, String> {
    // 특정 프로젝트의 모든 변경 이력 시간순 정렬로 가져오기 (이력 보기 화면용)
    List<AuditLog> findByProjectIdOrderByCreatedAtDesc(String projectId);
}
