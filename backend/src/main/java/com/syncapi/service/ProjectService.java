package com.syncapi.service;

import com.syncapi.model.Project;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ProjectService {
    private final List<Project> projects = new ArrayList<>();

    public List<Project> getAllProjects() {
        return projects;
    }

    public Project createProject(Project project) {
        project.setId(UUID.randomUUID().toString());
        project.setCreatedAt(LocalTime.now().toString());
        project.setLastUpdated(LocalDateTime.now().toString());
        project.setApiCount(0);
        project.setStatus("active");

        projects.add(project);
        return project;
    }
}
