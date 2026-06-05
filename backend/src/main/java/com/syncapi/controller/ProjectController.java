package com.syncapi.controller;

import com.syncapi.dto.project.ProjectRequestDto;
import com.syncapi.dto.project.ProjectResponseDto;
import com.syncapi.service.ProjectService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // 프로젝트 목록 조회 API
    @GetMapping
    public List<ProjectResponseDto> getProjects() {
        return projectService.getAllProjects();
    }

    // 프로젝트 생성 API
    @PostMapping
    public ProjectResponseDto createProject(@RequestBody ProjectRequestDto requestDto) {
        return projectService.createProject(requestDto);
    }
}
