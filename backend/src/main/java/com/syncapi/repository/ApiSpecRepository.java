package com.syncapi.repository;

import com.syncapi.model.ApiSpec;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApiSpecRepository extends JpaRepository<ApiSpec, String> {
    // 특정 프로젝트의 전체 API 스펙 조회
    List<ApiSpec> findByProjectId(String projectId);
    
    // 특정 폴더 내부의 API 스펙 조회
    List<ApiSpec> findByFolderId(String folderId);

    // 목업을 위한 특정 프로젝트의 엔드포인트/메소드 조회
    ApiSpec findByProjectIdAndMethodAndEndpoint(String projectId, String method, String endpoint);

    // 프로젝트의 전체 API 개수 카운트
    long countByProjectId(String projectId);
}
