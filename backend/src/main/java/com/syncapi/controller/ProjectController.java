package com.syncapi.controller;

import com.syncapi.dto.project.ProjectRequestDto;
import com.syncapi.dto.project.ProjectResponseDto;
import com.syncapi.service.ProjectService;
import org.springframework.http.ResponseEntity;
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
    public List<ProjectResponseDto> getAllProjects(@RequestParam(required = false) String userId) {
        return projectService.getAllProjects(userId);
    }

    // 프로젝트 생성 API
    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody ProjectRequestDto requestDto) {
        try {
            ProjectResponseDto response = projectService.createProject(requestDto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage() + "\n" + e.toString());
        }
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(@PathVariable String projectId) {
        projectService.deleteProject(projectId);
        return ResponseEntity.noContent().build();
    }
}
