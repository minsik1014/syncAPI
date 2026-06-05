package com.syncapi.controller;

import com.syncapi.dto.audit.AuditLogResponseDto;
import com.syncapi.service.AuditLogService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    // 프론트엔드에서 프로젝트의 히스토리 내역을 시간순으로 불러오는 API
    // GET /api/audit-logs?projectId=xxx
    @GetMapping
    public List<AuditLogResponseDto> getProjectLogs(@RequestParam String projectId) {
        return auditLogService.getLogsByProjectId(projectId);
    }
}
