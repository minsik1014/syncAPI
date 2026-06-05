package com.syncapi.controller;

import com.syncapi.dto.folder.FolderRequestDto;
import com.syncapi.dto.folder.FolderResponseDto;
import com.syncapi.service.FolderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/folders")
public class FolderController {

    private final FolderService folderService;

    public FolderController(FolderService folderService) {
        this.folderService = folderService;
    }

    // GET /api/folders?projectId=123 형식으로 요청
    @GetMapping
    public List<FolderResponseDto> getFolders(@RequestParam String projectId) {
        return folderService.getFoldersByProjectId(projectId);
    }

    // POST /api/folders 형식으로 요청
    @PostMapping
    public FolderResponseDto createFolder(@RequestBody FolderRequestDto requestDto) {
        return folderService.createFolder(requestDto);
    }
}
