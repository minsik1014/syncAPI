package com.syncapi.repository;

import com.syncapi.model.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, String> {
    // 특정 프로젝트에 속한 멤버 목록 찾기
    List<ProjectMember> findByProjectId(String projectId);
    
    // 특정 유저가 참여 중인 프로젝트 목록 찾기
    List<ProjectMember> findByUserId(String userId);
}
