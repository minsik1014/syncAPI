package com.syncapi.dto.audit;

import com.syncapi.model.AuditLog;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AuditLogResponseDto {
    private String id;
    private String projectId;
    private String userId;
    private String userName; // 누가 했는지 프론트에 바로 띄워주기 위함
    private String actionType;
    private String targetId;
    private String details;
    private LocalDateTime createdAt;

    public static AuditLogResponseDto from(AuditLog log) {
        return AuditLogResponseDto.builder()
                .id(log.getId())
                .projectId(log.getProject().getId())
                .userId(log.getUser().getId())
                .userName(log.getUser().getName())
                .actionType(log.getActionType())
                .targetId(log.getTargetId())
                .details(log.getDetails())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
