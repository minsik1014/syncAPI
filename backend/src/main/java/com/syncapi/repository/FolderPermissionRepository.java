package com.syncapi.repository;

import com.syncapi.model.FolderPermission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FolderPermissionRepository extends JpaRepository<FolderPermission, String> {
    // 특정 폴더에 부여된 모든 권한 목록 조회
    List<FolderPermission> findByFolderId(String folderId);
    
    // 특정 사용자가 받은 모든 개별 폴더 권한 조회
    List<FolderPermission> findByUserId(String userId);
    
    // 특정 폴더에서 특정 사용자가 가진 권한 찾기 (중복 부여 방지용)
    Optional<FolderPermission> findByFolderIdAndUserId(String folderId, String userId);
}
