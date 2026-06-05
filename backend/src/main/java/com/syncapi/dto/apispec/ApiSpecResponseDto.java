package com.syncapi.dto.apispec;

import com.syncapi.model.ApiSpec;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ApiSpecResponseDto {
    private String id;
    private String title;
    private String method;
    private String endpoint;
    private String description;
    private String projectId;
    private String folderId;

    // Entity -> DTO 변환
    public static ApiSpecResponseDto from(ApiSpec apiSpec) {
        return ApiSpecResponseDto.builder()
                .id(apiSpec.getId())
                .title(apiSpec.getTitle())
                .method(apiSpec.getMethod())
                .endpoint(apiSpec.getEndpoint())
                .description(apiSpec.getDescription())
                .projectId(apiSpec.getProject().getId())
                // 폴더가 null일 수 있으므로 삼항 연산자로 안전하게 처리
                .folderId(apiSpec.getFolder() != null ? apiSpec.getFolder().getId() : null)
                .build();
    }
}
