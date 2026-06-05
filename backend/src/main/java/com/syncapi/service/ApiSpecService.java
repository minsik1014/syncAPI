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

    public ApiSpecService(ApiSpecRepository apiSpecRepository, ProjectRepository projectRepository, FolderRepository folderRepository) {
        this.apiSpecRepository = apiSpecRepository;
        this.projectRepository = projectRepository;
        this.folderRepository = folderRepository;
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

        // 4. DB 저장 및 반환
        ApiSpec savedApiSpec = apiSpecRepository.save(apiSpec);
        return ApiSpecResponseDto.from(savedApiSpec);
    }
}
