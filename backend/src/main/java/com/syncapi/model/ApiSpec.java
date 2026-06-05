package com.syncapi.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "api_specs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiSpec {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String method; // GET, POST, PUT, DELETE 등

    @Column(nullable = false)
    private String endpoint; // 예: /api/v1/users

    private String description;

    // 폴더에 속하지 않는 최상위 API 스펙을 위한 nullable 허용
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id")
    private Folder folder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    // API에 속한 전체 요청/응답 필드 목록
    @OneToMany(mappedBy = "apiSpec", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Field> fields = new ArrayList<>();
}
