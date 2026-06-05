package com.syncapi.dto.project;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProjectRequestDto {
    private String title;
    private String description;
    private String baseUrl;
    private String userId; // 프로젝트 생성자 아이디
}
