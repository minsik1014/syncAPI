package com.syncapi.service;

import com.syncapi.dto.apispec.ApiSpecRequestDto;
import com.syncapi.dto.apispec.ApiSpecResponseDto;
import com.syncapi.model.ApiSpec;
import com.syncapi.model.Folder;
import com.syncapi.model.Project;
import com.syncapi.repository.ApiSpecRepository;
import com.syncapi.repository.FolderRepository;
import com.syncapi.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ApiSpecService {

    private final ApiSpecRepository apiSpecRepository;
    private final ProjectRepository projectRepository;
    private final FolderRepository folderRepository;
    private final AuditLogService auditLogService;

    public ApiSpecService(ApiSpecRepository apiSpecRepository, ProjectRepository projectRepository, FolderRepository folderRepository, AuditLogService auditLogService) {
        this.apiSpecRepository = apiSpecRepository;
        this.projectRepository = projectRepository;
        this.folderRepository = folderRepository;
        this.auditLogService = auditLogService;
    }

    // 프로젝트 전체 API 조회
    public List<ApiSpecResponseDto> getApiSpecsByProjectId(String projectId) {
        return apiSpecRepository.findByProjectId(projectId).stream()
                .map(ApiSpecResponseDto::from)
                .collect(Collectors.toList());
    }
    
    // 특정 폴더 내부의 API만 조회
    public List<ApiSpecResponseDto> getApiSpecsByFolderId(String folderId) {
        return apiSpecRepository.findByFolderId(folderId).stream()
                .map(ApiSpecResponseDto::from)
                .collect(Collectors.toList());
    }

    // 새로운 API 명세 생성
    @Transactional
    public ApiSpecResponseDto createApiSpec(ApiSpecRequestDto requestDto) {
        // 1. 프로젝트 확인
        Project project = projectRepository.findById(requestDto.getProjectId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 프로젝트입니다."));

        // 2. 폴더 확인 (요청에 folderId가 있을 경우에만)
        Folder folder = null;
        if (requestDto.getFolderId() != null) {
            folder = folderRepository.findById(requestDto.getFolderId())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 폴더입니다."));
        }

        // 3. 엔티티 조립 (Project와 Folder 관계 설정)
        ApiSpec apiSpec = ApiSpec.builder()
                .title(requestDto.getTitle())
                .method(requestDto.getMethod())
                .endpoint(requestDto.getEndpoint())
                .description(requestDto.getDescription())
                .project(project)
                .folder(folder)
                .build();

        // 3.5. 필드 데이터 파싱
        if (requestDto.getRequest() != null) {
            parseAndAddFields(apiSpec, requestDto.getRequest().getHeaders(), "HEADER");
            parseAndAddFields(apiSpec, requestDto.getRequest().getQueryParams(), "QUERY_PARAM");
            parseAndAddFields(apiSpec, requestDto.getRequest().getBody(), "REQUEST_BODY");
        }
        if (requestDto.getResponse() != null) {
            parseAndAddFields(apiSpec, requestDto.getResponse().getBody(), "RESPONSE_BODY");
        }

        // 4. DB 저장 및 반환
        ApiSpec savedApiSpec = apiSpecRepository.save(apiSpec);

        // Audit Log 기록
        String userId = requestDto.getUserId() != null ? requestDto.getUserId() : "user-1";
        auditLogService.recordLog(requestDto.getProjectId(), userId, "CREATE", savedApiSpec.getId(), requestDto.getTitle());

        return ApiSpecResponseDto.from(savedApiSpec);
    }
    // API 명세 수정
    @Transactional
    public ApiSpecResponseDto updateApiSpec(String apiId, ApiSpecRequestDto requestDto) {
        ApiSpec apiSpec = apiSpecRepository.findById(apiId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 API 명세입니다."));

        if (requestDto.getTitle() != null) apiSpec.setTitle(requestDto.getTitle());
        if (requestDto.getMethod() != null) apiSpec.setMethod(requestDto.getMethod());
        if (requestDto.getEndpoint() != null) apiSpec.setEndpoint(requestDto.getEndpoint());
        if (requestDto.getDescription() != null) apiSpec.setDescription(requestDto.getDescription());

        // 폴더 이동이 있을 경우
        if (requestDto.getFolderId() != null) {
            Folder folder = folderRepository.findById(requestDto.getFolderId())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 폴더입니다."));
            apiSpec.setFolder(folder);
        }

        // 기존 필드 삭제 및 재생성
        apiSpec.getFields().clear();
        
        if (requestDto.getRequest() != null) {
            parseAndAddFields(apiSpec, requestDto.getRequest().getHeaders(), "HEADER");
            parseAndAddFields(apiSpec, requestDto.getRequest().getQueryParams(), "QUERY_PARAM");
            parseAndAddFields(apiSpec, requestDto.getRequest().getBody(), "REQUEST_BODY");
        }
        if (requestDto.getResponse() != null) {
            parseAndAddFields(apiSpec, requestDto.getResponse().getBody(), "RESPONSE_BODY");
        }

        // Audit Log 기록
        String userId = requestDto.getUserId() != null ? requestDto.getUserId() : "user-1";
        String details = requestDto.getLogDetails() != null ? requestDto.getLogDetails() : apiSpec.getTitle();
        auditLogService.recordLog(apiSpec.getProject().getId(), userId, "UPDATE", apiSpec.getId(), details);

        return ApiSpecResponseDto.from(apiSpec);
    }

    private void parseAndAddFields(ApiSpec apiSpec, List<com.syncapi.dto.apispec.FieldDto> dtoList, String location) {
        if (dtoList == null) return;
        for (com.syncapi.dto.apispec.FieldDto dto : dtoList) {
            addFieldRecursively(apiSpec, null, dto, location);
        }
    }

    private void addFieldRecursively(ApiSpec apiSpec, com.syncapi.model.Field parent, com.syncapi.dto.apispec.FieldDto dto, String location) {
        com.syncapi.model.Field field = com.syncapi.model.Field.builder()
                .name(dto.getName() != null ? dto.getName() : "")
                .type(dto.getType() != null ? dto.getType() : "String")
                .description(dto.getDescription())
                .isRequired(dto.isRequired())
                .location(location)
                .apiSpec(apiSpec)
                .parentField(parent)
                .build();
        
        if (parent != null) {
            parent.getChildFields().add(field);
        } else {
            apiSpec.getFields().add(field);
        }
        
        if (dto.getChildren() != null) {
            for (com.syncapi.dto.apispec.FieldDto childDto : dto.getChildren()) {
                addFieldRecursively(apiSpec, field, childDto, location);
            }
        }
    }

    // API 명세 삭제
    @Transactional
    public void deleteApiSpec(String apiId) {
        ApiSpec apiSpec = apiSpecRepository.findById(apiId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 API 명세입니다."));
        
        auditLogService.recordLog(apiSpec.getProject().getId(), "user-1", "DELETE", apiSpec.getId(), apiSpec.getTitle());
        apiSpecRepository.deleteById(apiId);
    }
}
