package com.syncapi.dto.folder;

import com.syncapi.model.FolderPermission;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FolderPermissionResponseDto {
    private String id;
    private String folderId;
    private String userId;
    private String userEmail;
    private String userName;
    private String role;

    public static FolderPermissionResponseDto from(FolderPermission permission) {
        return FolderPermissionResponseDto.builder()
                .id(permission.getId())
                .folderId(permission.getFolder().getId())
                .userId(permission.getUser().getId())
                .userEmail(permission.getUser().getEmail())
                .userName(permission.getUser().getName())
                .role(permission.getRole())
                .build();
    }
}
