package com.syncapi.dto.apispec;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ApiSpecRequestDto {
    private String title;
    private String method; // GET, POST, 등
    private String endpoint; // /api/users
    private String description;
    
    private String projectId; // 필수 (어느 프로젝트 소속인지)
    private String folderId;  // 선택 (특정 폴더 안에 속할 경우에만 입력, 없으면 null)
}
