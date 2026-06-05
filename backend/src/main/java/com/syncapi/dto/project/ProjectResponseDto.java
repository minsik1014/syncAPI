package com.syncapi.dto.project;

import com.syncapi.model.Project;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ProjectResponseDto {
    private String id;
    private String title;
    private String description;
    private String baseUrl;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime lastUpdated;

    // Entity 객체를 DTO로 안전하게 변환하는 정적 메서드
    public static ProjectResponseDto from(Project project) {
        return ProjectResponseDto.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .baseUrl(project.getBaseUrl())
                .status(project.getStatus())
                .createdAt(project.getCreatedAt())
                .lastUpdated(project.getLastUpdated())
                .build();
    }
}
