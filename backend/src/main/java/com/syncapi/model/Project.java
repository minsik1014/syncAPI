package com.syncapi.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    private String id;
    private String title;
    private String description;
    private String createdAt;
    private Integer apiCount;
    private String status; // "active" 또는 "inactive"
    private String lastUpdated;
    private String baseUrl;
}
