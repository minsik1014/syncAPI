package com.syncapi.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "project_members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectMember {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    // 어떤 프로젝트인지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    // 어떤 유저인지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 권한: OWNER(주인), EDITOR(편집자), VIEWER(읽기전용) 등
    @Column(nullable = false)
    private String role;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime joinedAt; // 프로젝트 참여 시간
}
