package com.syncapi.repository;

import com.syncapi.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {
    // 기본 CRUD 쿼리 자동 생성
}
