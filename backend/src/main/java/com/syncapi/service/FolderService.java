package com.syncapi.service;

import com.syncapi.dto.folder.FolderRequestDto;
import com.syncapi.dto.folder.FolderResponseDto;
import com.syncapi.model.Folder;
import com.syncapi.model.Project;
import com.syncapi.repository.FolderRepository;
import com.syncapi.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class FolderService {

    private final FolderRepository folderRepository;
    private final ProjectRepository projectRepository;

    public FolderService(FolderRepository folderRepository, ProjectRepository projectRepository) {
        this.folderRepository = folderRepository;
        this.projectRepository = projectRepository;
    }

    // 특정 프로젝트 안의 폴더 목록 조회
    public List<FolderResponseDto> getFoldersByProjectId(String projectId) {
        return folderRepository.findByProjectId(projectId).stream()
                .map(FolderResponseDto::from)
                .collect(Collectors.toList());
    }

    // 새 폴더 생성
    @Transactional
    public FolderResponseDto createFolder(FolderRequestDto requestDto) {
        // 1. DB에서 부모 프로젝트가 실제로 존재하는지 확인
        Project project = projectRepository.findById(requestDto.getProjectId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 프로젝트입니다."));

        // 2. 폴더 Entity 생성 및 연관관계 맺기
        Folder folder = Folder.builder()
                .name(requestDto.getName())
                .project(project)
                .build();

        // 3. DB 저장 후 DTO로 변환하여 반환
        Folder savedFolder = folderRepository.save(folder);
        return FolderResponseDto.from(savedFolder);
    }
    // 폴더 수정
    @Transactional
    public FolderResponseDto updateFolder(String folderId, String newName) {
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 폴더입니다."));
        folder.setName(newName);
        return FolderResponseDto.from(folder);
    }

    // 폴더 삭제
    @Transactional
    public void deleteFolder(String folderId) {
        if (!folderRepository.existsById(folderId)) {
            throw new IllegalArgumentException("존재하지 않는 폴더입니다.");
        }
        folderRepository.deleteById(folderId);
    }
}
