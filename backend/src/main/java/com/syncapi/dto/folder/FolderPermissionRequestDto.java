package com.syncapi.dto.folder;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FolderPermissionRequestDto {
    private String folderId; // 권한을 줄 폴더
    private String userId;   // 권한을 받을 사람
    private String role;     // 줄 권한 (예: "EDITOR")
}
