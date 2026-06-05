package com.syncapi.repository;

import com.syncapi.model.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FolderRepository extends JpaRepository<Folder, String> {
    // 특정 프로젝트 하위 폴더 목록 조회
    List<Folder> findByProjectId(String projectId);
}
