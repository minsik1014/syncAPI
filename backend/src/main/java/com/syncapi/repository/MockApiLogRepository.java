package com.syncapi.repository;

import com.syncapi.model.MockApiLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MockApiLogRepository extends JpaRepository<MockApiLog, String> {
    
    // 특정 프로젝트의 오늘 발생한 로그 조회
    List<MockApiLog> findByProjectIdAndCreatedAtAfter(String projectId, LocalDateTime createdAt);
}
