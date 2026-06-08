package com.syncapi.controller;

import com.syncapi.dto.apispec.ApiSpecRequestDto;
import com.syncapi.dto.apispec.ApiSpecResponseDto;
import com.syncapi.service.ApiSpecService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/specs")
public class ApiSpecController {

    private final ApiSpecService apiSpecService;

    public ApiSpecController(ApiSpecService apiSpecService) {
        this.apiSpecService = apiSpecService;
    }

    // GET /api/specs?projectId=123 (프로젝트 전체 조회)
    // GET /api/specs?folderId=456 (특정 폴더 조회)
    @GetMapping
    public List<ApiSpecResponseDto> getApiSpecs(
            @RequestParam(required = false) String projectId,
            @RequestParam(required = false) String folderId) {
            
        if (folderId != null) {
            // 폴더 아이디가 파라미터로 넘어오면 폴더 내부 조회
            return apiSpecService.getApiSpecsByFolderId(folderId);
        } else if (projectId != null) {
            // 프로젝트 아이디가 넘어오면 프로젝트 전체 조회
            return apiSpecService.getApiSpecsByProjectId(projectId);
        } else {
            throw new IllegalArgumentException("projectId 또는 folderId가 필요합니다.");
        }
    }

    @PostMapping
    public ApiSpecResponseDto createApiSpec(@RequestBody ApiSpecRequestDto requestDto) {
        return apiSpecService.createApiSpec(requestDto);
    }
    @PutMapping("/{apiId}")
    public ApiSpecResponseDto updateApiSpec(@PathVariable String apiId, @RequestBody ApiSpecRequestDto requestDto) {
        return apiSpecService.updateApiSpec(apiId, requestDto);
    }

    @DeleteMapping("/{apiId}")
    public void deleteApiSpec(@PathVariable String apiId) {
        apiSpecService.deleteApiSpec(apiId);
    }
}
