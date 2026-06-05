package com.syncapi.service;

import com.syncapi.dto.folder.FolderPermissionRequestDto;
import com.syncapi.dto.folder.FolderPermissionResponseDto;
import com.syncapi.model.Folder;
import com.syncapi.model.FolderPermission;
import com.syncapi.model.User;
import com.syncapi.repository.FolderPermissionRepository;
import com.syncapi.repository.FolderRepository;
import com.syncapi.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class FolderPermissionService {

    private final FolderPermissionRepository permissionRepository;
    private final FolderRepository folderRepository;
    private final UserRepository userRepository;

    public FolderPermissionService(FolderPermissionRepository permissionRepository, FolderRepository folderRepository, UserRepository userRepository) {
        this.permissionRepository = permissionRepository;
        this.folderRepository = folderRepository;
        this.userRepository = userRepository;
    }

    // 특정 폴더에 할당된 모든 권한 조회
    public List<FolderPermissionResponseDto> getPermissionsByFolderId(String folderId) {
        return permissionRepository.findByFolderId(folderId).stream()
                .map(FolderPermissionResponseDto::from)
                .collect(Collectors.toList());
    }

    // 폴더 개별 권한 부여
    @Transactional
    public FolderPermissionResponseDto grantPermission(FolderPermissionRequestDto request) {
        Folder folder = folderRepository.findById(request.getFolderId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 폴더입니다."));
        
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // 만약 해당 유저가 이 폴더에 이미 개별 권한을 가지고 있다면 기존 권한 삭제 (덮어쓰기)
        permissionRepository.findByFolderIdAndUserId(folder.getId(), user.getId())
                .ifPresent(permissionRepository::delete);

        FolderPermission permission = FolderPermission.builder()
                .folder(folder)
                .user(user)
                .role(request.getRole())
                .build();

        return FolderPermissionResponseDto.from(permissionRepository.save(permission));
    }

    // 부여된 폴더 개별 권한 삭제 (회수)
    @Transactional
    public void revokePermission(String permissionId) {
        permissionRepository.deleteById(permissionId);
    }
}
